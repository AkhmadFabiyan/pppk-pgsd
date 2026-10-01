import { NextResponse } from "next/server";
import { consumeRateLimit, submitVote } from "@/lib/db";
import { randomReceiptCode, sha256 } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.VOTING_TOKEN_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: { code: "service_unavailable", message: "Layanan voting belum siap." } }, { status: 503 });
  let sessionToken = "";
  let candidateId = "";
  let idempotencyKey = "";
  try {
    const body = await request.json() as { sessionToken?: unknown; candidateId?: unknown; idempotencyKey?: unknown };
    sessionToken = String(body.sessionToken ?? "");
    candidateId = String(body.candidateId ?? "");
    idempotencyKey = String(body.idempotencyKey ?? "");
  } catch {
    return NextResponse.json({ error: { code: "invalid_request", message: "Permintaan tidak valid." } }, { status: 400 });
  }
  if (sessionToken.length < 32 || !/^candidate-\d+$/.test(candidateId) || idempotencyKey.length < 20 || idempotencyKey.length > 160) {
    return NextResponse.json({ error: { code: "invalid_request", message: "Data suara tidak valid." } }, { status: 400 });
  }
  const sessionHash = sha256(`${secret}:session:${sessionToken}`);
  if (!(await consumeRateLimit("vote.submit", sessionHash, 8, 10 * 60 * 1000))) return NextResponse.json({ error: { code: "rate_limited", message: "Terlalu banyak percobaan. Coba lagi nanti." } }, { status: 429 });

  const result = await submitVote(sessionHash, candidateId, sha256(`${secret}:idempotency:${idempotencyKey}`), randomReceiptCode());
  if (result.status === "accepted") return NextResponse.json({ data: { receiptCode: result.receiptCode, castAt: result.castAt } }, { headers: { "Cache-Control": "no-store" } });
  const message = result.status === "already_voted" ? "Suara untuk NIM ini sudah tercatat." : "Sesi voting tidak berlaku. Silakan kembali ke tahap verifikasi.";
  return NextResponse.json({ error: { code: result.status, message } }, { status: result.status === "election_not_open" ? 409 : 403 });
}
