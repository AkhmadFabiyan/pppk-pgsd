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
    "# Isi password awal admin (minimum 12 karakter); jangan commit file ini.",
    "ADMIN_INITIAL_USERNAME=admin@pppk-pgsd.vercel.app",
    "ADMIN_INITIAL_PASSWORD=",
    "# Guard reset suara hanya untuk database development ini; jangan salin ke Production.",
    "APP_ENV=development",
    "SIMULATION_EVENT_ENABLED=true",
    "ALLOW_SIMULATION_RESET=true",
    ""
  ].join("\n");
  writeFileSync(target, content, { encoding: "utf8", mode: 0o600 });
  console.log(".env.local dibuat. Isi DATABASE_URL dan ADMIN_INITIAL_PASSWORD, lalu jalankan npm run dev dan buka /panitia/login.");
}
