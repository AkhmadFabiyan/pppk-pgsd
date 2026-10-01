import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { createAdminSession, deleteAdminSession, findAdminSession } from "@/lib/db";

const scrypt = promisify(scryptCallback);
const ADMIN_COOKIE = "pgsd_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function randomReceiptCode() {
  return `PGSD-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const derived = await scrypt(password, salt, 64) as Buffer;
  const expectedBuffer = Buffer.from(expected, "hex");
  return expectedBuffer.length === derived.length && timingSafeEqual(expectedBuffer, derived);
}

export function isValidBootstrapToken(token: string) {
  const expected = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!expected || expected.length < 16) return false;
  const left = Buffer.from(token);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function establishAdminSession(adminId: string) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  await createAdminSession(adminId, sha256(token), expiresAt.toISOString());
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });
}

export async function currentAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return token ? await findAdminSession(sha256(token)) : undefined;
}

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) throw new Error("Akses admin diperlukan.");
  return admin;
}

export async function endAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) await deleteAdminSession(sha256(token));
  jar.delete(ADMIN_COOKIE);
}
