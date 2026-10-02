"use client";

import { Check, ChevronLeft, ChevronRight, LoaderCircle, ShieldCheck, Vote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatBallotNumber, type CandidateSummary } from "@/lib/site";

type Step = "verify" | "choose" | "confirm";

type ApiResponse = {
  data?: { sessionToken?: string; receiptCode?: string };
  error?: { message?: string };
};

const DEVICE_TOKEN_STORAGE_KEY = "pgsd_vote_device_installation";

function createDeviceToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function getDeviceToken() {
  try {
    const stored = window.localStorage.getItem(DEVICE_TOKEN_STORAGE_KEY);
    if (stored && /^[A-Za-z0-9_-]{32,160}$/.test(stored)) return stored;
    const token = createDeviceToken();
    window.localStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token);
    return token;
  } catch {
    return createDeviceToken();
  }
}

async function requestJson(path: string, body: Record<string, string>) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  const payload = await response.json() as ApiResponse;
  if (!response.ok) throw new Error(payload.error?.message || "Permintaan tidak dapat diproses.");
  return payload;
}

export function VotingWizard({ candidates }: { candidates: CandidateSummary[] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("verify");
  const [nim, setNim] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const selected = useMemo(() => candidates.find((candidate) => candidate.id === candidateId), [candidateId, candidates]);

  async function verifyNim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const nextDeviceToken = getDeviceToken();
      const payload = await requestJson("/api/vote/verify", { nim, deviceToken: nextDeviceToken });
      if (!payload.data?.sessionToken) throw new Error("Sesi voting tidak tersedia.");
      setSessionToken(payload.data.sessionToken);
      setStep("choose");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "NIM tidak dapat diverifikasi.");
    } finally {
      setPending(false);
    }
  }

  async function submitVote() {
    if (!sessionToken || !selected) return;
    setError("");
    setPending(true);
    try {
      const idempotencyKey = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      const payload = await requestJson("/api/vote/submit", { sessionToken, candidateId: selected.id ?? "", idempotencyKey });
      if (!payload.data?.receiptCode) throw new Error("Receipt tidak dapat dibuat.");
      router.replace(`/bukti/${encodeURIComponent(payload.data.receiptCode)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Suara tidak dapat dikirim.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="vote-wizard" aria-label="Tahapan voting">
      <ol className="vote-progress" aria-label="Progres voting">
        {[{ id: "verify", label: "Verifikasi" }, { id: "choose", label: "Pilih calon" }, { id: "confirm", label: "Konfirmasi" }].map((item, index) => <li className={step === item.id ? "is-active" : ["verify", "choose", "confirm"].indexOf(step) > index ? "is-complete" : ""} key={item.id}><span>{["verify", "choose", "confirm"].indexOf(step) > index ? <Check aria-hidden="true" size={15} /> : index + 1}</span>{item.label}</li>)}
      </ol>

      {error && <p className="form-error" role="alert">{error}</p>}

      {step === "verify" && <form className="nim-form" onSubmit={verifyNim}>
        <ShieldCheck aria-hidden="true" className="wizard-icon" />
        <p className="eyebrow eyebrow-green">Tahap 1 dari 3</p><h2>Verifikasi NIM</h2>
        <p>Masukkan NIM milik sendiri. Hanya pemilih dalam daftar resmi yang dapat melanjutkan.</p>
        <p className="form-hint">Browser dan jaringan diproses secara terbatas untuk mencegah suara ganda. Data ini tidak ditampilkan publik.</p>
        <label>NIM<input name="nim" inputMode="numeric" autoComplete="off" value={nim} onChange={(event) => setNim(event.target.value.replace(/\D/g, ""))} minLength={8} maxLength={20} required disabled={pending} /></label>
        <button className="button" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" aria-hidden="true" size={18} /> Memeriksa</> : <>Lanjut pilih calon <ChevronRight aria-hidden="true" size={18} /></>}</button>
      </form>}

      {step === "choose" && <div className="ballot-step"><div><p className="eyebrow eyebrow-green">Tahap 2 dari 3</p><h2>Pilih satu calon</h2><p>Pilihan belum dikirim. Kamu masih bisa kembali ke beranda untuk memeriksa daftar calon.</p></div><div className="ballot-list" role="radiogroup" aria-label="Pilihan calon">{candidates.map((candidate) => <button className={candidateId === candidate.id ? "ballot-option is-selected" : "ballot-option"} type="button" role="radio" aria-checked={candidateId === candidate.id} key={candidate.id} onClick={() => setCandidateId(candidate.id ?? "")}><span className="ballot-number">{formatBallotNumber(candidate.number)}</span><span><strong>{candidate.name}</strong><small>{candidate.className}</small></span>{candidateId === candidate.id && <Check aria-hidden="true" />}</button>)}</div><div className="wizard-actions"><button className="button button-outline" type="button" onClick={() => { setStep("verify"); setError(""); }}><ChevronLeft aria-hidden="true" size={18} /> Kembali</button><button className="button" type="button" disabled={!selected} onClick={() => setStep("confirm")}>Lanjut konfirmasi <ChevronRight aria-hidden="true" size={18} /></button></div></div>}

      {step === "confirm" && selected && <div className="confirm-step"><Vote aria-hidden="true" className="wizard-icon" /><p className="eyebrow eyebrow-red">Tahap 3 dari 3</p><h2>Periksa pilihanmu.</h2><p>Kamu memilih:</p><div className="confirmation-choice"><span>{formatBallotNumber(selected.number)}</span><div><strong>{selected.name}</strong><p>{selected.className}</p></div></div><p className="confirmation-note">Setelah dikirim, pilihan tidak dapat diubah. Sistem hanya menyimpan satu suara final untuk setiap NIM.</p><div className="wizard-actions"><button className="button button-outline" type="button" onClick={() => setStep("choose")} disabled={pending}><ChevronLeft aria-hidden="true" size={18} /> Ubah pilihan</button><button className="button" type="button" onClick={submitVote} disabled={pending}>{pending ? <><LoaderCircle className="spin" aria-hidden="true" size={18} /> Mengirim suara</> : <><Check aria-hidden="true" size={18} /> Kirim suara</>}</button></div></div>}
    </section>
  );
}
