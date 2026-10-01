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
  if (await hasAdminUsers()) redirect("/panitia/login?error=Setup%20admin%20sudah%20selesai.");
  const username = textValue(formData, "username").toLowerCase();
  const password = textValue(formData, "password");
  const setupToken = textValue(formData, "setupToken");
  if (!/^[a-z0-9._-]{3,40}$/.test(username) || password.length < 12 || !isValidBootstrapToken(setupToken)) {
    redirect("/panitia/login?error=Data%20setup%20tidak%20valid.");
  }
  const adminId = await createAdmin(username, await hashPassword(password));
  await establishAdminSession(adminId);
  redirect("/panitia?notice=Akun%20admin%20awal%20berhasil%20dibuat.");
}

export async function loginAction(formData: FormData) {
  const username = textValue(formData, "username").toLowerCase();
  const password = textValue(formData, "password");
  if (!(await consumeRateLimit("admin.login", sha256(`admin-login:${username}`), 10, 15 * 60 * 1000))) {
    redirect("/panitia/login?error=Terlalu%20banyak%20percobaan.%20Coba%20lagi%20nanti.");
  }
  const admin = await findAdminByUsername(username);
  if (!admin || !admin.is_active || !(await verifyPassword(password, admin.password_hash))) {
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
    await setElectionStatus(admin.id, status);
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Status tidak dapat diperbarui.");
  }
  refreshPublicPaths();
  redirectWithMessage("notice", "Status pemilihan diperbarui.");
}

export async function resultVisibilityAction(formData: FormData) {
  const admin = await requireAdmin();
  const visibility = textValue(formData, "visibility");
  if (visibility !== "hidden" && visibility !== "full_live" && visibility !== "final_only") redirectWithMessage("error", "Kebijakan hasil tidak valid.");
  try {
    await setResultVisibility(admin.id, visibility);
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Kebijakan hasil tidak dapat diperbarui.");
  }
  refreshPublicPaths();
  redirectWithMessage("notice", "Kebijakan hasil diperbarui.");
}

export async function candidatePublishAction(formData: FormData) {
  const admin = await requireAdmin();
  const candidateId = textValue(formData, "candidateId");
  const published = textValue(formData, "published") === "true";
  try {
    await setCandidatePublished(admin.id, candidateId, published);
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Calon tidak dapat diperbarui.");
  }
  refreshPublicPaths();
  redirectWithMessage("notice", "Status calon diperbarui.");
}

export async function syncCandidatesAction() {
  const admin = await requireAdmin();
  let count: number;
  try {
    count = await syncCandidateCatalog(admin.id);
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Materi calon tidak dapat disinkronkan.");
  }
  refreshPublicPaths();
  redirectWithMessage("notice", `${count!} materi calon disinkronkan dari katalog proyek.`);
}

export async function importVotersAction(formData: FormData) {
  const admin = await requireAdmin();
  const file = formData.get("workbook");
  if (!(file instanceof File) || file.size === 0 || file.size > 10 * 1024 * 1024 || !file.name.toLowerCase().endsWith(".xlsx")) {
    redirectWithMessage("error", "Pilih file XLSX dengan ukuran maksimal 10 MB.");
  }
  let importedCount = 0;
  try {
    const voters = await parseVoterWorkbook(Buffer.from(await file.arrayBuffer()));
    await replaceVoters(admin.id, voters);
    importedCount = voters.length;
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Spreadsheet tidak dapat diimpor.");
  }
  refreshPublicPaths();
  redirectWithMessage("notice", `${importedCount} peserta berhasil diimpor.`);
}

export async function resetBeforeVotingAction(formData: FormData) {
  const admin = await requireAdmin();
  const confirmation = textValue(formData, "confirmation");
  const reason = textValue(formData, "reason");
  if (confirmation !== "RESET" || reason.length < 8) redirectWithMessage("error", "Ketik RESET dan isi alasan minimal 8 karakter.");
  try {
    await resetBeforeVoting(admin.id, reason);
  } catch (error) {
    redirectWithMessage("error", error instanceof Error ? error.message : "Reset ditolak.");
  }
  refreshPublicPaths();
  redirectWithMessage("notice", "Data peserta dan sesi pra-voting telah direset. Kandidat tetap tersimpan.");
}
