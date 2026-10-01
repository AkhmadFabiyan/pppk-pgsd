import { NextResponse } from "next/server";
import { consumeRateLimit, issueVotingSession } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const secret = process.env.VOTING_TOKEN_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: { code: "service_unavailable", message: "Layanan voting belum siap." } }, { status: 503 });

  let nim = "";
  try {
    const body = await request.json() as { nim?: unknown };
    nim = String(body.nim ?? "").replace(/\D/g, "");
  } catch {
    return NextResponse.json({ error: { code: "invalid_request", message: "Permintaan tidak valid." } }, { status: 400 });
  }
  if (!/^\d{8,20}$/.test(nim)) return NextResponse.json({ error: { code: "verification_failed", message: "NIM tidak dapat diverifikasi." } }, { status: 400 });

  const throttleKey = sha256(`${secret}:verify:${clientAddress(request)}`);
  if (!(await consumeRateLimit("vote.verify", throttleKey, 5, 10 * 60 * 1000))) return NextResponse.json({ error: { code: "rate_limited", message: "Terlalu banyak percobaan. Coba lagi beberapa menit." } }, { status: 429 });

  const sessionToken = randomToken();
  const accepted = await issueVotingSession(nim, sha256(`${secret}:session:${sessionToken}`), new Date(Date.now() + 10 * 60 * 1000).toISOString());
  if (!accepted) return NextResponse.json({ error: { code: "verification_failed", message: "NIM tidak dapat diverifikasi." } }, { status: 403 });
  return NextResponse.json({ data: { sessionToken, expiresInSeconds: 600 } }, { headers: { "Cache-Control": "no-store" } });
}
