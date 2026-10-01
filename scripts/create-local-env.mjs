import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const target = resolve(process.cwd(), ".env.local");

if (existsSync(target)) {
  console.error(".env.local sudah ada. Script tidak akan menimpa konfigurasi yang ada.");
  process.exitCode = 1;
} else {
  const content = [
    "# Dibuat oleh npm run setup:local. Jangan commit file ini.",
    "# Isi dengan URL PostgreSQL serverless development milikmu.",
    "DATABASE_URL=",
    `VOTING_TOKEN_SECRET=${randomBytes(32).toString("base64url")}`,
    `ADMIN_BOOTSTRAP_TOKEN=${randomBytes(24).toString("base64url")}`,
    ""
  ].join("\n");
  writeFileSync(target, content, { encoding: "utf8", mode: 0o600 });
  console.log(".env.local dibuat. Isi DATABASE_URL terlebih dahulu, lalu jalankan npm run dev dan buka /panitia/login.");
}
