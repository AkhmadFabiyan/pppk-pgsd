import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { createAdminSession, deleteAdminSession, findAdminSession } from "@/lib/db";

const scrypt = promisify(scryptCallback);
const ADMIN_COOKIE = "pgsd_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const DEFAULT_INITIAL_ADMIN_USERNAME = "admin@pppk-pgsd.vercel.app";

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

function constantTimeEqual(leftValue: string, rightValue: string) {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function initialAdminUsername() {
  return process.env.ADMIN_INITIAL_USERNAME?.trim().toLowerCase() || DEFAULT_INITIAL_ADMIN_USERNAME;
}

export function isValidInitialAdminCredentials(username: string, password: string) {
  const expectedPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!expectedPassword || expectedPassword.length < 12) return false;
  const usernameMatches = constantTimeEqual(username, initialAdminUsername());
  const passwordMatches = constantTimeEqual(password, expectedPassword);
  return usernameMatches && passwordMatches;
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
