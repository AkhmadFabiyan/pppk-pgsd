import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { consumeRateLimit, submitVote } from "@/lib/db";
import { hmacSha256, randomReceiptCode } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEVICE_COOKIE = "pgsd_vote_device";

function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

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
  const deviceCookie = (await cookies()).get(DEVICE_COOKIE)?.value;
  if (!deviceCookie || !/^[A-Za-z0-9_-]{32,160}$/.test(deviceCookie)) return NextResponse.json({ error: { code: "invalid_session", message: "Sesi voting tidak berlaku. Silakan verifikasi ulang." } }, { status: 403 });

  const sessionHash = hmacSha256(secret, "vote-session:v1", sessionToken);
  const deviceBindingHash = hmacSha256(secret, "vote-device-binding:v1", deviceCookie);
  const ipHash = hmacSha256(secret, "vote-ip:v1", clientAddress(request));
  const [sessionAllowed, deviceAllowed, ipAllowed] = await Promise.all([
    consumeRateLimit("vote.submit.session", sessionHash, 8, 10 * 60 * 1000),
    consumeRateLimit("vote.submit.device", deviceBindingHash, 8, 10 * 60 * 1000),
    consumeRateLimit("vote.submit.ip", ipHash, 1_200, 10 * 60 * 1000)
  ]);
  if (!sessionAllowed || !deviceAllowed || !ipAllowed) return NextResponse.json({ error: { code: "rate_limited", message: "Terlalu banyak percobaan. Coba lagi nanti." } }, { status: 429 });

  const result = await submitVote(sessionHash, candidateId, hmacSha256(secret, "vote-idempotency:v1", idempotencyKey), randomReceiptCode(), deviceBindingHash);
  if (result.status === "accepted") return NextResponse.json({ data: { receiptCode: result.receiptCode, castAt: result.castAt } }, { headers: { "Cache-Control": "no-store" } });
  const message = result.status === "already_voted"
    ? "Suara untuk NIM ini sudah tercatat."
    : result.status === "device_already_used"
      ? "Perangkat ini tidak dapat digunakan untuk melanjutkan voting. Gunakan perangkat pribadi lain atau hubungi panitia."
      : "Sesi voting tidak berlaku. Silakan kembali ke tahap verifikasi.";
  return NextResponse.json({ error: { code: result.status, message } }, { status: result.status === "election_not_open" || result.status === "device_already_used" ? 409 : 403 });
}
