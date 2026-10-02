import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { consumeRateLimit, issueVotingSession } from "@/lib/db";
import { hmacSha256, randomToken } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEVICE_COOKIE = "pgsd_vote_device";
const DEVICE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const HASH_VERSION = 1;

const verificationMessages = {
  election_not_open: "Voting belum dibuka atau sudah ditutup oleh panitia.",
  nim_not_registered: "NIM yang kamu masukkan belum terdaftar sebagai pemilih. Periksa kembali NIM atau hubungi panitia.",
  not_eligible: "NIM ini terdaftar, tetapi belum mendapat hak pilih. Hubungi panitia bila ini keliru.",
  already_voted: "Kamu sudah memberikan suara dengan NIM ini. Satu NIM hanya dapat memilih satu kali.",
  device_already_used: "Perangkat ini sudah digunakan untuk menyelesaikan voting. Gunakan perangkat pribadi lain atau hubungi panitia bila ini keliru.",
  verification_failed: "Verifikasi tidak dapat diproses. Coba lagi beberapa saat.",
} as const;

function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isDeviceToken(value: string) {
  return /^[A-Za-z0-9_-]{32,160}$/.test(value);
}

export async function POST(request: Request) {
  const secret = process.env.VOTING_TOKEN_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: { code: "service_unavailable", message: "Layanan voting belum siap." } }, { status: 503 });

  let nim = "";
  let deviceToken = "";
  try {
    const body = await request.json() as { nim?: unknown; deviceToken?: unknown };
    nim = String(body.nim ?? "").replace(/\D/g, "");
    deviceToken = String(body.deviceToken ?? "");
  } catch {
    return NextResponse.json({ error: { code: "invalid_request", message: "Permintaan tidak valid." } }, { status: 400 });
  }
  if (!/^\d{8,20}$/.test(nim) || !isDeviceToken(deviceToken)) return NextResponse.json({ error: { code: "verification_failed", message: "Verifikasi tidak dapat diproses." } }, { status: 400 });

  const jar = await cookies();
  const storedDeviceCookie = jar.get(DEVICE_COOKIE)?.value;
  const deviceCookie = storedDeviceCookie && isDeviceToken(storedDeviceCookie) ? storedDeviceCookie : randomToken();
  const deviceBindingHash = hmacSha256(secret, "vote-device-binding:v1", deviceCookie);
  const deviceInstallationHash = hmacSha256(secret, "vote-device-installation:v1", deviceToken);
  const ipHash = hmacSha256(secret, "vote-ip:v1", clientAddress(request));
  const nimHash = hmacSha256(secret, "vote-nim:v1", nim);
  const [ipAllowed, nimAllowed, deviceAllowed] = await Promise.all([
    consumeRateLimit("vote.verify.ip", ipHash, 1_200, 10 * 60 * 1000),
    consumeRateLimit("vote.verify.nim", nimHash, 4, 10 * 60 * 1000),
    consumeRateLimit("vote.verify.device", deviceBindingHash, 6, 10 * 60 * 1000)
  ]);
  if (!ipAllowed || !nimAllowed || !deviceAllowed) return NextResponse.json({ error: { code: "rate_limited", message: "Terlalu banyak percobaan. Coba lagi beberapa menit." } }, { status: 429 });

  const sessionToken = randomToken();
  const result = await issueVotingSession(
    nim,
    hmacSha256(secret, "vote-session:v1", sessionToken),
    new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    { deviceBindingHash, deviceInstallationHash, ipHash, hashVersion: HASH_VERSION }
  );
  if (result.status !== "accepted") {
    const status = result.status === "election_not_open" || result.status === "already_voted" || result.status === "device_already_used" ? 409 : 403;
    return NextResponse.json({ error: { code: result.status, message: verificationMessages[result.status] } }, { status });
  }
  const response = NextResponse.json({ data: { sessionToken, expiresInSeconds: 600 } }, { headers: { "Cache-Control": "no-store" } });
  if (deviceCookie !== storedDeviceCookie) response.cookies.set(DEVICE_COOKIE, deviceCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEVICE_COOKIE_MAX_AGE_SECONDS
  });
  return response;
}
