"use client";

import { Check, ChevronLeft, ChevronRight, LoaderCircle, ShieldCheck, Vote } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatBallotNumber, type CandidateSummary } from "@/lib/site";

type Step = "verify" | "choose" | "confirm";

type ApiResponse = {
  data?: { sessionToken?: string; receiptCode?: string };
  error?: { code?: string; message?: string };
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
  if (!response.ok) throw new Error(payload.error?.message || "Permintaan belum dapat diproses. Coba lagi.");
  return payload;
}

export function VotingWizard({ candidates }: { candidates: CandidateSummary[] }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("verify");
  const [nim, setNim] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMounted = useRef(false);
  const selected = useMemo(() => candidates.find((candidate) => candidate.id === candidateId), [candidateId, candidates]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const stepTransition: Transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] };
  const stepMotion = {
    initial: reduceMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: stepTransition
  };

  async function verifyNim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const nextDeviceToken = getDeviceToken();
      const payload = await requestJson("/api/vote/verify", { nim, deviceToken: nextDeviceToken });
      if (!payload.data?.sessionToken) throw new Error("Sesi voting belum tersedia. Coba lagi.");
      setSessionToken(payload.data.sessionToken);
      setStep("choose");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "NIM belum dapat diverifikasi. Coba lagi.");
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
      if (!payload.data?.receiptCode) throw new Error("Kode bukti belum dapat dibuat. Coba lagi.");
      router.replace(`/bukti/${encodeURIComponent(payload.data.receiptCode)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Suara belum dapat dikirim. Coba lagi.");
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

      {step === "verify" && <motion.form className="nim-form" onSubmit={verifyNim} {...stepMotion}>
        <ShieldCheck aria-hidden="true" className="wizard-icon" />
        <p className="eyebrow eyebrow-green">Tahap 1 dari 3</p><h2 ref={headingRef} tabIndex={-1}>Masukkan NIM</h2>
        <p>Gunakan NIM-mu sendiri untuk lanjut.</p>
        <p className="form-hint">Browser dan jaringan diperiksa secara terbatas untuk mencegah suara ganda. Data ini tidak tampil publik.</p>
        <ul className="verification-help">
          <li>Sudah memilih? Kamu akan melihat status suaramu.</li>
          <li>NIM belum terdaftar? Periksa lagi atau hubungi panitia.</li>
          <li>Perangkat ini pernah dipakai? Hubungi panitia.</li>
        </ul>
        <label>NIM<input name="nim" inputMode="numeric" autoComplete="off" value={nim} onChange={(event) => setNim(event.target.value.replace(/\D/g, ""))} minLength={8} maxLength={20} required disabled={pending} /></label>
        <button className="button" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" aria-hidden="true" size={18} /> Mengecek</> : <>Cek NIM <ChevronRight aria-hidden="true" size={18} /></>}</button>
      </motion.form>}

      {step === "choose" && <motion.div className="ballot-step" {...stepMotion}><div><p className="eyebrow eyebrow-green">Tahap 2 dari 3</p><h2 ref={headingRef} tabIndex={-1}>Pilih satu calon</h2><p>Pilihan belum dikirim. Kamu masih bisa mengubahnya sebelum mengirim.</p></div><div className="ballot-list" role="radiogroup" aria-label="Pilihan calon">{candidates.map((candidate) => <motion.button className={candidateId === candidate.id ? "ballot-option is-selected" : "ballot-option"} type="button" role="radio" aria-checked={candidateId === candidate.id} key={candidate.id} onClick={() => setCandidateId(candidate.id ?? "")} whileTap={reduceMotion ? undefined : { scale: 0.985 }}><span className="ballot-number">{formatBallotNumber(candidate.number)}</span><span><strong>{candidate.name}</strong><small>{candidate.className}</small></span>{candidateId === candidate.id && <Check aria-hidden="true" />}</motion.button>)}</div><div className="wizard-actions"><button className="button button-outline" type="button" onClick={() => { setStep("verify"); setError(""); }}><ChevronLeft aria-hidden="true" size={18} /> Kembali</button><button className="button" type="button" disabled={!selected} onClick={() => setStep("confirm")}>Ke konfirmasi <ChevronRight aria-hidden="true" size={18} /></button></div></motion.div>}

      {step === "confirm" && selected && <motion.div className="confirm-step" {...stepMotion}><Vote aria-hidden="true" className="wizard-icon" /><p className="eyebrow eyebrow-red">Tahap 3 dari 3</p><h2 ref={headingRef} tabIndex={-1}>Cek pilihanmu</h2><p>Suara belum dikirim.</p><div className="confirmation-choice"><span>{formatBallotNumber(selected.number)}</span><div><strong>{selected.name}</strong><p>{selected.className}</p></div></div><p className="confirmation-note">Setelah dikirim, pilihan tidak bisa diubah. Setiap NIM hanya menyimpan satu suara final.</p><div className="wizard-actions"><button className="button button-outline" type="button" onClick={() => setStep("choose")} disabled={pending}><ChevronLeft aria-hidden="true" size={18} /> Ubah pilihan</button><button className="button" type="button" onClick={submitVote} disabled={pending}>{pending ? <><LoaderCircle className="spin" aria-hidden="true" size={18} /> Mengirim</> : <><Check aria-hidden="true" size={18} /> Kirim suara</>}</button></div></motion.div>}
    </section>
  );
}
