"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdmin,
  consumeRateLimit,
  findAdminByUsername,
  hasAdminUsers,
  replaceVoters,
  resetBeforeVoting,
  setCandidatePublished,
  setElectionStatus,
  setResultVisibility,
  syncCandidateCatalog
} from "@/lib/db";
import { hashPassword, isValidBootstrapToken, establishAdminSession, endAdminSession, requireAdmin, sha256, verifyPassword } from "@/lib/security";
import { parseVoterWorkbook } from "@/lib/voter-import";

function textValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function redirectWithMessage(type: "notice" | "error", message: string): never {
  return redirect(`/panitia?${type}=${encodeURIComponent(message)}`);
}

function refreshPublicPaths() {
  revalidatePath("/");
  revalidatePath("/vote");
  revalidatePath("/bukti/[receiptCode]", "page");
  revalidatePath("/panitia");
}

export async function bootstrapAdminAction(formData: FormData) {
  if (hasAdminUsers()) redirect("/panitia/login?error=Setup%20admin%20sudah%20selesai.");
  const username = textValue(formData, "username").toLowerCase();
  const password = textValue(formData, "password");
  const setupToken = textValue(formData, "setupToken");
  if (!/^[a-z0-9._-]{3,40}$/.test(username) || password.length < 12 || !isValidBootstrapToken(setupToken)) {
    redirect("/panitia/login?error=Data%20setup%20tidak%20valid.");
  }
  const adminId = createAdmin(username, await hashPassword(password));
  await establishAdminSession(adminId);
  redirect("/panitia?notice=Akun%20admin%20awal%20berhasil%20dibuat.");
}

export async function loginAction(formData: FormData) {
  const username = textValue(formData, "username").toLowerCase();
  const password = textValue(formData, "password");
  if (!consumeRateLimit("admin.login", sha256(`admin-login:${username}`), 10, 15 * 60 * 1000)) {
    redirect("/panitia/login?error=Terlalu%20banyak%20percobaan.%20Coba%20lagi%20nanti.");
  }
  const admin = findAdminByUsername(username);
  if (!admin || admin.is_active !== 1 || !(await verifyPassword(password, admin.password_hash))) {
    redirect("/panitia/login?error=Username%20atau%20kata%20sandi%20tidak%20valid.");
  }
  await establishAdminSession(admin.id);
  redirect("/panitia");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/panitia/login");
}

export async function eventStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const status = textValue(formData, "status");
  if (status !== "scheduled" && status !== "open" && status !== "closed") redirectWithMessage("error", "Status pemilihan tidak valid.");
  try {
    setElectionStatus(admin.id, status);
    refreshPublicPaths();
    redirectWithMessage("notice", "Status pemilihan diperbarui.");
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Status tidak dapat diperbarui.");
  }
}

export async function resultVisibilityAction(formData: FormData) {
  const admin = await requireAdmin();
  const visibility = textValue(formData, "visibility");
  if (visibility !== "hidden" && visibility !== "full_live" && visibility !== "final_only") redirectWithMessage("error", "Kebijakan hasil tidak valid.");
  setResultVisibility(admin.id, visibility);
  refreshPublicPaths();
  redirectWithMessage("notice", "Kebijakan hasil diperbarui.");
}

export async function candidatePublishAction(formData: FormData) {
  const admin = await requireAdmin();
  const candidateId = textValue(formData, "candidateId");
  const published = textValue(formData, "published") === "true";
  try {
    setCandidatePublished(admin.id, candidateId, published);
    refreshPublicPaths();
    redirectWithMessage("notice", "Status calon diperbarui.");
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Calon tidak dapat diperbarui.");
  }
}

export async function syncCandidatesAction() {
  const admin = await requireAdmin();
  try {
    const count = syncCandidateCatalog(admin.id);
    refreshPublicPaths();
    redirectWithMessage("notice", `${count} materi calon disinkronkan dari katalog proyek.`);
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Materi calon tidak dapat disinkronkan.");
  }
}

export async function importVotersAction(formData: FormData) {
  const admin = await requireAdmin();
  const file = formData.get("workbook");
  if (!(file instanceof File) || file.size === 0 || file.size > 10 * 1024 * 1024 || !file.name.toLowerCase().endsWith(".xlsx")) {
    redirectWithMessage("error", "Pilih file XLSX dengan ukuran maksimal 10 MB.");
  }
  try {
    const voters = await parseVoterWorkbook(Buffer.from(await file.arrayBuffer()));
    replaceVoters(admin.id, voters);
    refreshPublicPaths();
    redirectWithMessage("notice", `${voters.length} peserta berhasil diimpor.`);
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Spreadsheet tidak dapat diimpor.");
  }
}

export async function resetBeforeVotingAction(formData: FormData) {
  const admin = await requireAdmin();
  const confirmation = textValue(formData, "confirmation");
  const reason = textValue(formData, "reason");
  if (confirmation !== "RESET" || reason.length < 8) redirectWithMessage("error", "Ketik RESET dan isi alasan minimal 8 karakter.");
  try {
    resetBeforeVoting(admin.id, reason);
    refreshPublicPaths();
    redirectWithMessage("notice", "Data peserta dan sesi pra-voting telah direset. Kandidat tetap tersimpan.");
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Reset ditolak.");
  }
}
