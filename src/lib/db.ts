import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { candidates, type Candidate, type ElectionStatus, type ResultVisibility } from "@/lib/site";

const ELECTION_ID = "pgsd-2026";
const DEFAULT_DB_PATH = join(process.cwd(), "data", "voting.sqlite");

type ElectionRow = {
  id: string;
  title: string;
  status: ElectionStatus;
  result_visibility: ResultVisibility;
  updated_at: string;
};

type CandidateRow = {
  id: string;
  ballot_number: number;
  slug: string;
  display_name: string;
  class_name: string;
  poster: string;
  vision: string;
  missions_json: string;
  is_published: number;
};

type ResultRow = { candidate_id: string; vote_count: number };
type CountRow = { count: number };

export type ElectionSnapshot = {
  id: string;
  title: string;
  status: ElectionStatus;
  statusLabel: string;
  scheduleLabel: string;
  resultVisibility: ResultVisibility;
  candidates: Candidate[];
  result: PublicResult | null;
};

export type PublicResult = {
  totalEligible: number;
  totalCast: number;
  turnoutPercent: number;
  candidates: Array<{ candidateId: string; voteCount: number; votePercent: number }>;
  updatedAt: string;
};

export type AdminSummary = ElectionSnapshot & {
  voterCount: number;
  voteCount: number;
  adminCount: number;
  recentAudit: Array<{ action: string; detail: string; createdAt: string }>;
};

export type AdminVoter = {
  nim: string;
  name: string;
  className: string;
  attendanceMarked: boolean;
  isEligible: boolean;
  hasVoted: boolean;
};

export type ImportedVoter = {
  nim: string;
  name: string;
  className: string;
  attendanceMarked: boolean;
};

export type VoteSubmitResult =
  | { status: "accepted"; receiptCode: string; castAt: string }
  | { status: "already_voted" | "invalid_session" | "candidate_unavailable" | "election_not_open" };

declare global {
  var __pgsdVotingDb: DatabaseSync | undefined;
}

function now() {
  return new Date().toISOString();
}

function databasePath() {
  const configured = process.env.VOTING_DB_PATH;
  if (!configured) return DEFAULT_DB_PATH;
  if (!isAbsolute(configured)) throw new Error("VOTING_DB_PATH harus menggunakan path absolut.");
  return configured;
}

function getDatabase() {
  if (globalThis.__pgsdVotingDb) return globalThis.__pgsdVotingDb;
  const path = databasePath();
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  migrate(db);
  globalThis.__pgsdVotingDb = db;
  return db;
}

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS elections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('scheduled', 'open', 'closed')),
      result_visibility TEXT NOT NULL CHECK (result_visibility IN ('hidden', 'full_live', 'final_only')),
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      ballot_number INTEGER NOT NULL,
      slug TEXT NOT NULL,
      display_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      poster TEXT NOT NULL,
      vision TEXT NOT NULL,
      missions_json TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
      UNIQUE (election_id, ballot_number),
      UNIQUE (election_id, slug)
    );
    CREATE TABLE IF NOT EXISTS voters (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      nim TEXT NOT NULL,
      name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      attendance_marked INTEGER NOT NULL DEFAULT 0 CHECK (attendance_marked IN (0, 1)),
      is_eligible INTEGER NOT NULL DEFAULT 1 CHECK (is_eligible IN (0, 1)),
      imported_at TEXT NOT NULL,
      UNIQUE (election_id, nim)
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS voting_sessions (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      voter_id TEXT NOT NULL REFERENCES voters(id) ON DELETE RESTRICT,
      token_hash TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK (status IN ('issued', 'submitted', 'expired')),
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      voter_id TEXT NOT NULL REFERENCES voters(id) ON DELETE RESTRICT,
      candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE RESTRICT,
      idempotency_hash TEXT NOT NULL,
      receipt_code TEXT NOT NULL UNIQUE,
      cast_at TEXT NOT NULL,
      UNIQUE (election_id, voter_id),
      UNIQUE (election_id, voter_id, idempotency_hash)
    );
    CREATE TABLE IF NOT EXISTS rate_limits (
      scope TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      window_started INTEGER NOT NULL,
      count INTEGER NOT NULL,
      PRIMARY KEY (scope, key_hash)
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      detail TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const election = db.prepare("SELECT id FROM elections WHERE id = ?").get(ELECTION_ID) as { id: string } | undefined;
  if (!election) {
    db.prepare("INSERT INTO elections (id, title, status, result_visibility, updated_at) VALUES (?, ?, ?, ?, ?)")
      .run(ELECTION_ID, "Pemilihan Ketua Angkatan PGSD 2026", "scheduled", "hidden", now());
  }

  const candidateCount = db.prepare("SELECT COUNT(*) AS count FROM candidates WHERE election_id = ?").get(ELECTION_ID) as CountRow;
  if (candidateCount.count === 0) {
    const insert = db.prepare(`INSERT INTO candidates (id, election_id, ballot_number, slug, display_name, class_name, poster, vision, missions_json, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`);
    for (const candidate of candidates) {
      insert.run(`candidate-${candidate.number}`, ELECTION_ID, candidate.number, candidate.slug, candidate.name, candidate.className, candidate.poster, candidate.vision, JSON.stringify(candidate.missions));
    }
  }
}

function mapCandidate(row: CandidateRow): Candidate {
  let missions: string[] = [];
  try {
    const parsed: unknown = JSON.parse(row.missions_json);
    missions = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    missions = [];
  }
  return { id: row.id, number: row.ballot_number, slug: row.slug, name: row.display_name, className: row.class_name, poster: row.poster, vision: row.vision, missions };
}

function eventRow() {
  const row = getDatabase().prepare("SELECT * FROM elections WHERE id = ?").get(ELECTION_ID) as ElectionRow | undefined;
  if (!row) throw new Error("Konfigurasi pemilihan tidak tersedia.");
  return row;
}

function statusLabel(status: ElectionStatus) {
  if (status === "open") return "Dibuka";
  if (status === "closed") return "Ditutup";
  return "Terjadwal";
}

function scheduleLabel(status: ElectionStatus) {
  if (status === "open") return "Voting sedang berlangsung. Gunakan NIM milik sendiri untuk melanjutkan.";
  if (status === "closed") return "Voting telah ditutup oleh panitia.";
  return "Jadwal voting akan diumumkan oleh panitia.";
}

export function getPublicResult(): PublicResult {
  const db = getDatabase();
  const totalEligible = (db.prepare("SELECT COUNT(*) AS count FROM voters WHERE election_id = ? AND is_eligible = 1").get(ELECTION_ID) as CountRow).count;
  const totalCast = (db.prepare("SELECT COUNT(*) AS count FROM votes WHERE election_id = ?").get(ELECTION_ID) as CountRow).count;
  const rows = db.prepare("SELECT candidate_id, COUNT(*) AS vote_count FROM votes WHERE election_id = ? GROUP BY candidate_id").all(ELECTION_ID) as ResultRow[];
  const counts = new Map(rows.map((row) => [row.candidate_id, row.vote_count]));
  const updatedAt = eventRow().updated_at;
  return {
    totalEligible,
    totalCast,
    turnoutPercent: totalEligible === 0 ? 0 : Number(((totalCast / totalEligible) * 100).toFixed(2)),
    candidates: getPublishedCandidates().map((candidate) => {
      const voteCount = counts.get(candidate.id ?? "") ?? 0;
      return { candidateId: candidate.id ?? "", voteCount, votePercent: totalCast === 0 ? 0 : Number(((voteCount / totalCast) * 100).toFixed(2)) };
    }),
    updatedAt
  };
}

export function getPublishedCandidates() {
  const rows = getDatabase().prepare("SELECT * FROM candidates WHERE election_id = ? AND is_published = 1 ORDER BY ballot_number").all(ELECTION_ID) as CandidateRow[];
  return rows.map(mapCandidate);
}

export function getAllCandidates() {
  const rows = getDatabase().prepare("SELECT * FROM candidates WHERE election_id = ? ORDER BY ballot_number").all(ELECTION_ID) as CandidateRow[];
  return rows.map((row) => ({ ...mapCandidate(row), isPublished: row.is_published === 1 }));
}

export function getElectionSnapshot(): ElectionSnapshot {
  const event = eventRow();
  const canShowResult = event.result_visibility === "full_live" || (event.result_visibility === "final_only" && event.status === "closed");
  return {
    id: event.id,
    title: event.title,
    status: event.status,
    statusLabel: statusLabel(event.status),
    scheduleLabel: scheduleLabel(event.status),
    resultVisibility: event.result_visibility,
    candidates: getPublishedCandidates(),
    result: canShowResult ? getPublicResult() : null
  };
}

export function hasAdminUsers() {
  return (getDatabase().prepare("SELECT COUNT(*) AS count FROM admin_users").get() as CountRow).count > 0;
}

export function createAdmin(username: string, passwordHash: string) {
  const id = randomUUID();
  getDatabase().prepare("INSERT INTO admin_users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)").run(id, username, passwordHash, now());
  audit(null, "admin.bootstrap", "Akun admin awal dibuat.");
  return id;
}

export function findAdminByUsername(username: string) {
  return getDatabase().prepare("SELECT id, username, password_hash, is_active FROM admin_users WHERE username = ?").get(username) as { id: string; username: string; password_hash: string; is_active: number } | undefined;
}

export function createAdminSession(adminId: string, tokenHash: string, expiresAt: string) {
  const id = randomUUID();
  getDatabase().prepare("INSERT INTO admin_sessions (id, admin_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)").run(id, adminId, tokenHash, expiresAt, now());
}

export function findAdminSession(tokenHash: string) {
  return getDatabase().prepare(`SELECT admin_users.id, admin_users.username FROM admin_sessions
    JOIN admin_users ON admin_users.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ? AND admin_sessions.expires_at > ? AND admin_users.is_active = 1`).get(tokenHash, now()) as { id: string; username: string } | undefined;
}

export function deleteAdminSession(tokenHash: string) {
  getDatabase().prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(tokenHash);
}

export function audit(adminId: string | null, action: string, detail: string) {
  getDatabase().prepare("INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (?, ?, ?, ?, ?)").run(randomUUID(), adminId, action, detail, now());
}

export function getAdminSummary(): AdminSummary {
  const snapshot = getElectionSnapshot();
  const db = getDatabase();
  const recentAudit = db.prepare("SELECT action, detail, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 10").all() as Array<{ action: string; detail: string; created_at: string }>;
  return {
    ...snapshot,
    voterCount: (db.prepare("SELECT COUNT(*) AS count FROM voters WHERE election_id = ?").get(ELECTION_ID) as CountRow).count,
    voteCount: (db.prepare("SELECT COUNT(*) AS count FROM votes WHERE election_id = ?").get(ELECTION_ID) as CountRow).count,
    adminCount: (db.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE is_active = 1").get() as CountRow).count,
    recentAudit: recentAudit.map((row) => ({ action: row.action, detail: row.detail, createdAt: row.created_at }))
  };
}

export function getAdminVoters(query = ""): AdminVoter[] {
  const db = getDatabase();
  const term = query.trim().slice(0, 80);
  const rows = term
    ? db.prepare(`SELECT voters.nim, voters.name, voters.class_name, voters.attendance_marked, voters.is_eligible,
        EXISTS(SELECT 1 FROM votes WHERE votes.election_id = voters.election_id AND votes.voter_id = voters.id) AS has_voted
        FROM voters WHERE voters.election_id = ? AND (voters.nim LIKE ? OR voters.name LIKE ? OR voters.class_name LIKE ?)
        ORDER BY voters.class_name, voters.name LIMIT 500`).all(ELECTION_ID, `%${term}%`, `%${term}%`, `%${term}%`)
    : db.prepare(`SELECT voters.nim, voters.name, voters.class_name, voters.attendance_marked, voters.is_eligible,
        EXISTS(SELECT 1 FROM votes WHERE votes.election_id = voters.election_id AND votes.voter_id = voters.id) AS has_voted
        FROM voters WHERE voters.election_id = ? ORDER BY voters.class_name, voters.name LIMIT 500`).all(ELECTION_ID);
  return (rows as Array<{ nim: string; name: string; class_name: string; attendance_marked: number; is_eligible: number; has_voted: number }>).map((row) => ({
    nim: row.nim,
    name: row.name,
    className: row.class_name,
    attendanceMarked: row.attendance_marked === 1,
    isEligible: row.is_eligible === 1,
    hasVoted: row.has_voted === 1
  }));
}

export function setElectionStatus(adminId: string, status: ElectionStatus) {
  const db = getDatabase();
  const votes = (db.prepare("SELECT COUNT(*) AS count FROM votes WHERE election_id = ?").get(ELECTION_ID) as CountRow).count;
  if (status === "open") {
    const eligible = (db.prepare("SELECT COUNT(*) AS count FROM voters WHERE election_id = ? AND is_eligible = 1").get(ELECTION_ID) as CountRow).count;
    const published = (db.prepare("SELECT COUNT(*) AS count FROM candidates WHERE election_id = ? AND is_published = 1").get(ELECTION_ID) as CountRow).count;
    if (!process.env.VOTING_TOKEN_SECRET || process.env.VOTING_TOKEN_SECRET.length < 32) throw new Error("VOTING_TOKEN_SECRET minimal 32 karakter diperlukan sebelum voting dibuka.");
    if (eligible === 0 || published < 2) throw new Error("Voting membutuhkan peserta eligible dan minimal dua calon published.");
  }
  if (status === "scheduled" && votes > 0) throw new Error("Voting dengan suara sah tidak dapat dikembalikan ke terjadwal.");
  db.prepare("UPDATE elections SET status = ?, updated_at = ? WHERE id = ?").run(status, now(), ELECTION_ID);
  audit(adminId, `election.${status}`, `Status pemilihan diubah menjadi ${status}.`);
}

export function setResultVisibility(adminId: string, visibility: ResultVisibility) {
  getDatabase().prepare("UPDATE elections SET result_visibility = ?, updated_at = ? WHERE id = ?").run(visibility, now(), ELECTION_ID);
  audit(adminId, "election.result_visibility", `Kebijakan hasil diubah menjadi ${visibility}.`);
}

export function setCandidatePublished(adminId: string, candidateId: string, published: boolean) {
  const event = eventRow();
  if (event.status === "open") throw new Error("Calon tidak dapat diubah ketika voting dibuka.");
  const changed = getDatabase().prepare("UPDATE candidates SET is_published = ? WHERE id = ? AND election_id = ?").run(published ? 1 : 0, candidateId, ELECTION_ID);
  if (changed.changes !== 1) throw new Error("Calon tidak ditemukan.");
  audit(adminId, "candidate.publish", `Status publikasi calon diperbarui.`);
}

export function syncCandidateCatalog(adminId: string) {
  const db = getDatabase();
  const event = eventRow();
  const voteCount = (db.prepare("SELECT COUNT(*) AS count FROM votes WHERE election_id = ?").get(ELECTION_ID) as CountRow).count;
  if (event.status === "open" || voteCount > 0) throw new Error("Materi calon tidak dapat disinkronkan setelah voting dibuka atau suara tersimpan.");
  db.exec("BEGIN IMMEDIATE");
  try {
    const upsert = db.prepare(`INSERT INTO candidates (id, election_id, ballot_number, slug, display_name, class_name, poster, vision, missions_json, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(id) DO UPDATE SET ballot_number = excluded.ballot_number, slug = excluded.slug, display_name = excluded.display_name,
      class_name = excluded.class_name, poster = excluded.poster, vision = excluded.vision, missions_json = excluded.missions_json`);
    for (const candidate of candidates) {
      upsert.run(`candidate-${candidate.number}`, ELECTION_ID, candidate.number, candidate.slug, candidate.name, candidate.className, candidate.poster, candidate.vision, JSON.stringify(candidate.missions));
    }
    db.prepare("UPDATE elections SET updated_at = ? WHERE id = ?").run(now(), ELECTION_ID);
    audit(adminId, "candidates.sync_catalog", `${candidates.length} materi calon disinkronkan dari katalog proyek.`);
    db.exec("COMMIT");
    return candidates.length;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function replaceVoters(adminId: string, voters: ImportedVoter[]) {
  const db = getDatabase();
  const event = eventRow();
  const voteCount = (db.prepare("SELECT COUNT(*) AS count FROM votes WHERE election_id = ?").get(ELECTION_ID) as CountRow).count;
  if (event.status === "open" || voteCount > 0) throw new Error("Daftar peserta tidak dapat diimpor ulang setelah voting dibuka atau suara tersimpan.");
  if (voters.length === 0) throw new Error("Tidak ada peserta valid untuk diimpor.");

  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("DELETE FROM voting_sessions WHERE election_id = ?").run(ELECTION_ID);
    db.prepare("DELETE FROM voters WHERE election_id = ?").run(ELECTION_ID);
    const insert = db.prepare(`INSERT INTO voters (id, election_id, nim, name, class_name, attendance_marked, is_eligible, imported_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)`);
    const importedAt = now();
    for (const voter of voters) insert.run(randomUUID(), ELECTION_ID, voter.nim, voter.name, voter.className, voter.attendanceMarked ? 1 : 0, importedAt);
    db.prepare("UPDATE elections SET updated_at = ? WHERE id = ?").run(now(), ELECTION_ID);
    audit(adminId, "voters.import", `${voters.length} peserta diimpor.`);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function resetBeforeVoting(adminId: string, reason: string) {
  const db = getDatabase();
  const event = eventRow();
  const voteCount = (db.prepare("SELECT COUNT(*) AS count FROM votes WHERE election_id = ?").get(ELECTION_ID) as CountRow).count;
  if (event.status === "open" || voteCount > 0) throw new Error("Reset ditolak: voting terbuka atau sudah memiliki suara sah.");
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("DELETE FROM voting_sessions WHERE election_id = ?").run(ELECTION_ID);
    db.prepare("DELETE FROM voters WHERE election_id = ?").run(ELECTION_ID);
    db.prepare("UPDATE elections SET status = 'scheduled', result_visibility = 'hidden', updated_at = ? WHERE id = ?").run(now(), ELECTION_ID);
    audit(adminId, "election.reset_before_vote", `Reset pra-voting: ${reason.slice(0, 160)}`);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function consumeRateLimit(scope: string, keyHash: string, limit: number, windowMs: number) {
  const db = getDatabase();
  const nowMs = Date.now();
  const current = db.prepare("SELECT window_started, count FROM rate_limits WHERE scope = ? AND key_hash = ?").get(scope, keyHash) as { window_started: number; count: number } | undefined;
  if (!current || nowMs - current.window_started >= windowMs) {
    db.prepare("INSERT OR REPLACE INTO rate_limits (scope, key_hash, window_started, count) VALUES (?, ?, ?, 1)").run(scope, keyHash, nowMs);
    return true;
  }
  if (current.count >= limit) return false;
  db.prepare("UPDATE rate_limits SET count = count + 1 WHERE scope = ? AND key_hash = ?").run(scope, keyHash);
  return true;
}

export function issueVotingSession(nim: string, tokenHash: string, expiresAt: string) {
  const db = getDatabase();
  const event = eventRow();
  if (event.status !== "open") return false;
  const voter = db.prepare("SELECT id FROM voters WHERE election_id = ? AND nim = ? AND is_eligible = 1").get(ELECTION_ID, nim) as { id: string } | undefined;
  if (!voter) return false;
  const existing = db.prepare("SELECT id FROM votes WHERE election_id = ? AND voter_id = ?").get(ELECTION_ID, voter.id) as { id: string } | undefined;
  if (existing) return false;
  db.prepare("DELETE FROM voting_sessions WHERE voter_id = ? AND expires_at <= ?").run(voter.id, now());
  db.prepare("INSERT INTO voting_sessions (id, election_id, voter_id, token_hash, status, expires_at, created_at) VALUES (?, ?, ?, ?, 'issued', ?, ?)")
    .run(randomUUID(), ELECTION_ID, voter.id, tokenHash, expiresAt, now());
  return true;
}

export function submitVote(tokenHash: string, candidateId: string, idempotencyHash: string, receiptCode: string): VoteSubmitResult {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    const event = eventRow();
    if (event.status !== "open") {
      db.exec("ROLLBACK");
      return { status: "election_not_open" };
    }
    const session = db.prepare("SELECT voter_id, status, expires_at FROM voting_sessions WHERE token_hash = ?").get(tokenHash) as { voter_id: string; status: string; expires_at: string } | undefined;
    if (!session || session.expires_at <= now()) {
      db.exec("ROLLBACK");
      return { status: "invalid_session" };
    }
    const candidate = db.prepare("SELECT id FROM candidates WHERE id = ? AND election_id = ? AND is_published = 1").get(candidateId, ELECTION_ID) as { id: string } | undefined;
    if (!candidate) {
      db.exec("ROLLBACK");
      return { status: "candidate_unavailable" };
    }
    const previous = db.prepare("SELECT receipt_code, cast_at, idempotency_hash FROM votes WHERE election_id = ? AND voter_id = ?").get(ELECTION_ID, session.voter_id) as { receipt_code: string; cast_at: string; idempotency_hash: string } | undefined;
    if (previous) {
      db.exec("ROLLBACK");
      if (previous.idempotency_hash === idempotencyHash) return { status: "accepted", receiptCode: previous.receipt_code, castAt: previous.cast_at };
      return { status: "already_voted" };
    }
    const castAt = now();
    db.prepare("INSERT INTO votes (id, election_id, voter_id, candidate_id, idempotency_hash, receipt_code, cast_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(randomUUID(), ELECTION_ID, session.voter_id, candidate.id, idempotencyHash, receiptCode, castAt);
    db.prepare("UPDATE voting_sessions SET status = 'submitted' WHERE token_hash = ?").run(tokenHash);
    db.prepare("UPDATE elections SET updated_at = ? WHERE id = ?").run(castAt, ELECTION_ID);
    db.exec("COMMIT");
    return { status: "accepted", receiptCode, castAt };
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch { /* transaction already closed */ }
    throw error;
  }
}

export function getReceipt(receiptCode: string) {
  return getDatabase().prepare("SELECT receipt_code, cast_at FROM votes WHERE receipt_code = ?").get(receiptCode) as { receipt_code: string; cast_at: string } | undefined;
}
