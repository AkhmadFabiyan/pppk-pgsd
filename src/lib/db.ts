import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { candidates, type Candidate, type ElectionStatus, type ResultVisibility } from "@/lib/site";

const ELECTION_ID = "pgsd-2026";

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
  simulationReset: { isAvailable: boolean; message: string };
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

type ElectionRow = { id: string; title: string; status: ElectionStatus; result_visibility: ResultVisibility; is_test: boolean; updated_at: string };
type CandidateRow = { id: string; ballot_number: number; slug: string; display_name: string; class_name: string; poster: string; vision: string; missions_json: string; is_published: boolean };
type CountRow = { count: number | string };

declare global {
  var __pgsdSchemaReady: Promise<void> | undefined;
}

function now() {
  return new Date().toISOString();
}

function isSimulationEnvironment() {
  const appEnvironment = process.env.APP_ENV;
  const vercelEnvironment = process.env.VERCEL_ENV;
  return vercelEnvironment !== "production"
    && (appEnvironment === "development" || appEnvironment === "preview")
    && (!vercelEnvironment || vercelEnvironment === "development" || vercelEnvironment === "preview");
}

function shouldMarkEventAsTest() {
  return isSimulationEnvironment() && process.env.SIMULATION_EVENT_ENABLED === "true";
}

function simulationResetState(event: ElectionRow) {
  if (!isSimulationEnvironment()) return { isAvailable: false, message: "Reset suara hanya tersedia pada local atau Vercel Preview." };
  if (process.env.ALLOW_SIMULATION_RESET !== "true") return { isAvailable: false, message: "Reset suara belum diaktifkan untuk environment test ini." };
  if (!event.is_test) return { isAvailable: false, message: "Event ini tidak ditandai sebagai data simulasi." };
  return { isAvailable: true, message: "Reset suara tersedia untuk data simulasi ini." };
}

function databaseUrl() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL atau POSTGRES_URL wajib diatur untuk menjalankan aplikasi.");
  return url;
}

function sqlClient() {
  return neon(databaseUrl());
}

async function query<T>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
  return (await sqlClient()(strings, ...values)) as T[];
}

async function ensureSchema() {
  if (!globalThis.__pgsdSchemaReady) {
    globalThis.__pgsdSchemaReady = migrate().catch((error) => {
      globalThis.__pgsdSchemaReady = undefined;
      throw error;
    });
  }
  await globalThis.__pgsdSchemaReady;
}

async function migrate() {
  const sql = sqlClient();
  await sql.transaction([
    sql`CREATE TABLE IF NOT EXISTS elections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('scheduled', 'open', 'closed')),
      result_visibility TEXT NOT NULL CHECK (result_visibility IN ('hidden', 'full_live', 'final_only')),
      is_test BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMPTZ NOT NULL
    )`,
    sql`ALTER TABLE elections ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE`,
    sql`CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      ballot_number INTEGER NOT NULL,
      slug TEXT NOT NULL,
      display_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      poster TEXT NOT NULL,
      vision TEXT NOT NULL,
      missions_json TEXT NOT NULL,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE (election_id, ballot_number),
      UNIQUE (election_id, slug)
    )`,
    sql`CREATE TABLE IF NOT EXISTS voters (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      nim TEXT NOT NULL,
      name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      attendance_marked BOOLEAN NOT NULL DEFAULT FALSE,
      is_eligible BOOLEAN NOT NULL DEFAULT TRUE,
      imported_at TIMESTAMPTZ NOT NULL,
      UNIQUE (election_id, nim)
    )`,
    sql`CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL
    )`,
    sql`CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )`,
    sql`CREATE TABLE IF NOT EXISTS voting_sessions (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      voter_id TEXT NOT NULL REFERENCES voters(id) ON DELETE RESTRICT,
      token_hash TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK (status IN ('issued', 'submitted', 'expired')),
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )`,
    sql`CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE RESTRICT,
      voter_id TEXT NOT NULL REFERENCES voters(id) ON DELETE RESTRICT,
      candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE RESTRICT,
      idempotency_hash TEXT NOT NULL,
      receipt_code TEXT NOT NULL UNIQUE,
      cast_at TIMESTAMPTZ NOT NULL,
      UNIQUE (election_id, voter_id),
      UNIQUE (election_id, voter_id, idempotency_hash)
    )`,
    sql`CREATE TABLE IF NOT EXISTS rate_limits (
      scope TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      window_started BIGINT NOT NULL,
      count INTEGER NOT NULL,
      PRIMARY KEY (scope, key_hash)
    )`,
    sql`CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      detail TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )`,
    sql`CREATE INDEX IF NOT EXISTS voters_event_nim_idx ON voters (election_id, nim)`,
    sql`CREATE INDEX IF NOT EXISTS votes_event_candidate_idx ON votes (election_id, candidate_id)`,
    sql`CREATE INDEX IF NOT EXISTS voting_sessions_token_idx ON voting_sessions (token_hash)`,
    sql`INSERT INTO elections (id, title, status, result_visibility, is_test, updated_at)
      VALUES (${ELECTION_ID}, 'Pemilihan Ketua Angkatan PGSD 2026', 'scheduled', 'hidden', ${shouldMarkEventAsTest()}, ${now()})
      ON CONFLICT (id) DO NOTHING`
  ]);

  if (shouldMarkEventAsTest()) {
    await sql`UPDATE elections SET is_test = TRUE, updated_at = ${now()} WHERE id = ${ELECTION_ID} AND is_test = FALSE`;
  }

  await sql.transaction(candidates.map((candidate) => sql`INSERT INTO candidates (id, election_id, ballot_number, slug, display_name, class_name, poster, vision, missions_json, is_published)
    VALUES (${`candidate-${candidate.number}`}, ${ELECTION_ID}, ${candidate.number}, ${candidate.slug}, ${candidate.name}, ${candidate.className}, ${candidate.poster}, ${candidate.vision}, ${JSON.stringify(candidate.missions)}, TRUE)
    ON CONFLICT (id) DO NOTHING`));
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

function numberValue(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function mapCandidate(row: CandidateRow): Candidate {
  let missions: string[] = [];
  try {
    const parsed: unknown = JSON.parse(row.missions_json);
    missions = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch { /* an invalid stored mission list should not break public rendering */ }
  return { id: row.id, number: Number(row.ballot_number), slug: row.slug, name: row.display_name, className: row.class_name, poster: row.poster, vision: row.vision, missions };
}

async function eventRow() {
  await ensureSchema();
  const rows = await query<ElectionRow>`SELECT * FROM elections WHERE id = ${ELECTION_ID}`;
  const row = rows[0];
  if (!row) throw new Error("Konfigurasi pemilihan tidak tersedia.");
  return row;
}

export async function getPublishedCandidates() {
  await ensureSchema();
  const rows = await query<CandidateRow>`SELECT * FROM candidates WHERE election_id = ${ELECTION_ID} AND is_published = TRUE ORDER BY ballot_number`;
  return rows.map(mapCandidate);
}

export async function getAllCandidates() {
  await ensureSchema();
  const rows = await query<CandidateRow>`SELECT * FROM candidates WHERE election_id = ${ELECTION_ID} ORDER BY ballot_number`;
  return rows.map((row) => ({ ...mapCandidate(row), isPublished: row.is_published === true }));
}

export async function getPublicResult(): Promise<PublicResult> {
  await ensureSchema();
  const [eligibleRows, castRows, voteRows, event, published] = await Promise.all([
    query<CountRow>`SELECT COUNT(*)::int AS count FROM voters WHERE election_id = ${ELECTION_ID} AND is_eligible = TRUE`,
    query<CountRow>`SELECT COUNT(*)::int AS count FROM votes WHERE election_id = ${ELECTION_ID}`,
    query<{ candidate_id: string; vote_count: number | string }>`SELECT candidate_id, COUNT(*)::int AS vote_count FROM votes WHERE election_id = ${ELECTION_ID} GROUP BY candidate_id`,
    eventRow(),
    getPublishedCandidates()
  ]);
  const totalEligible = numberValue(eligibleRows[0]?.count ?? 0);
  const totalCast = numberValue(castRows[0]?.count ?? 0);
  const counts = new Map(voteRows.map((row) => [row.candidate_id, numberValue(row.vote_count)]));
  return {
    totalEligible,
    totalCast,
    turnoutPercent: totalEligible === 0 ? 0 : Number(((totalCast / totalEligible) * 100).toFixed(2)),
    candidates: published.map((candidate) => {
      const voteCount = counts.get(candidate.id ?? "") ?? 0;
      return { candidateId: candidate.id ?? "", voteCount, votePercent: totalCast === 0 ? 0 : Number(((voteCount / totalCast) * 100).toFixed(2)) };
    }),
    updatedAt: event.updated_at
  };
}

export async function getElectionSnapshot(): Promise<ElectionSnapshot> {
  const event = await eventRow();
  const canShowResult = event.result_visibility === "full_live" || (event.result_visibility === "final_only" && event.status === "closed");
  const [published, result] = await Promise.all([getPublishedCandidates(), canShowResult ? getPublicResult() : Promise.resolve(null)]);
  return {
    id: event.id,
    title: event.title,
    status: event.status,
    statusLabel: statusLabel(event.status),
    scheduleLabel: scheduleLabel(event.status),
    resultVisibility: event.result_visibility,
    candidates: published,
    result
  };
}

export async function hasAdminUsers() {
  await ensureSchema();
  const rows = await query<CountRow>`SELECT COUNT(*)::int AS count FROM admin_users`;
  return numberValue(rows[0]?.count ?? 0) > 0;
}

export async function createAdmin(username: string, passwordHash: string) {
  await ensureSchema();
  const sql = sqlClient();
  const id = randomUUID();
  await sql.transaction([
    sql`INSERT INTO admin_users (id, username, password_hash, created_at) VALUES (${id}, ${username}, ${passwordHash}, ${now()})`,
    sql`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, NULL, 'admin.initialized', 'Akun admin awal dibuat.', ${now()})`
  ]);
  return id;
}

export async function findAdminByUsername(username: string) {
  await ensureSchema();
  const rows = await query<{ id: string; username: string; password_hash: string; is_active: boolean }>`SELECT id, username, password_hash, is_active FROM admin_users WHERE username = ${username}`;
  return rows[0];
}

export async function createAdminSession(adminId: string, tokenHash: string, expiresAt: string) {
  await ensureSchema();
  await sqlClient()`INSERT INTO admin_sessions (id, admin_id, token_hash, expires_at, created_at) VALUES (${randomUUID()}, ${adminId}, ${tokenHash}, ${expiresAt}, ${now()})`;
}

export async function findAdminSession(tokenHash: string) {
  await ensureSchema();
  const rows = await query<{ id: string; username: string }>`SELECT admin_users.id, admin_users.username FROM admin_sessions
    JOIN admin_users ON admin_users.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ${tokenHash} AND admin_sessions.expires_at > ${now()} AND admin_users.is_active = TRUE`;
  return rows[0];
}

export async function deleteAdminSession(tokenHash: string) {
  await ensureSchema();
  await sqlClient()`DELETE FROM admin_sessions WHERE token_hash = ${tokenHash}`;
}

export async function audit(adminId: string | null, action: string, detail: string) {
  await ensureSchema();
  await sqlClient()`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, ${adminId}, ${action}, ${detail}, ${now()})`;
}

export async function getAdminSummary(): Promise<AdminSummary> {
  await ensureSchema();
  const [snapshot, voterRows, voteRows, adminRows, auditRows] = await Promise.all([
    getElectionSnapshot(),
    query<CountRow>`SELECT COUNT(*)::int AS count FROM voters WHERE election_id = ${ELECTION_ID}`,
    query<CountRow>`SELECT COUNT(*)::int AS count FROM votes WHERE election_id = ${ELECTION_ID}`,
    query<CountRow>`SELECT COUNT(*)::int AS count FROM admin_users WHERE is_active = TRUE`,
    query<{ action: string; detail: string; created_at: string }>`SELECT action, detail, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 10`
  ]);
  return {
    ...snapshot,
    voterCount: numberValue(voterRows[0]?.count ?? 0),
    voteCount: numberValue(voteRows[0]?.count ?? 0),
    adminCount: numberValue(adminRows[0]?.count ?? 0),
    simulationReset: simulationResetState(await eventRow()),
    recentAudit: auditRows.map((row) => ({ action: row.action, detail: row.detail, createdAt: row.created_at }))
  };
}

export async function getAdminVoters(searchQuery = ""): Promise<AdminVoter[]> {
  await ensureSchema();
  const term = searchQuery.trim().slice(0, 80);
  const pattern = `%${term}%`;
  const rows = term
    ? await query<{ nim: string; name: string; class_name: string; attendance_marked: boolean; is_eligible: boolean; has_voted: boolean }>`SELECT voters.nim, voters.name, voters.class_name, voters.attendance_marked, voters.is_eligible,
      EXISTS(SELECT 1 FROM votes WHERE votes.election_id = voters.election_id AND votes.voter_id = voters.id) AS has_voted
      FROM voters WHERE voters.election_id = ${ELECTION_ID} AND (voters.nim ILIKE ${pattern} OR voters.name ILIKE ${pattern} OR voters.class_name ILIKE ${pattern})
      ORDER BY voters.class_name, voters.name LIMIT 500`
    : await query<{ nim: string; name: string; class_name: string; attendance_marked: boolean; is_eligible: boolean; has_voted: boolean }>`SELECT voters.nim, voters.name, voters.class_name, voters.attendance_marked, voters.is_eligible,
      EXISTS(SELECT 1 FROM votes WHERE votes.election_id = voters.election_id AND votes.voter_id = voters.id) AS has_voted
      FROM voters WHERE voters.election_id = ${ELECTION_ID} ORDER BY voters.class_name, voters.name LIMIT 500`;
  return rows.map((row) => ({ nim: row.nim, name: row.name, className: row.class_name, attendanceMarked: row.attendance_marked, isEligible: row.is_eligible, hasVoted: row.has_voted }));
}

export async function setElectionStatus(adminId: string, status: ElectionStatus) {
  await ensureSchema();
  const sql = sqlClient();
  const [voteRows, eligibleRows, candidateRows] = await Promise.all([
    query<CountRow>`SELECT COUNT(*)::int AS count FROM votes WHERE election_id = ${ELECTION_ID}`,
    query<CountRow>`SELECT COUNT(*)::int AS count FROM voters WHERE election_id = ${ELECTION_ID} AND is_eligible = TRUE`,
    query<CountRow>`SELECT COUNT(*)::int AS count FROM candidates WHERE election_id = ${ELECTION_ID} AND is_published = TRUE`
  ]);
  const voteCount = numberValue(voteRows[0]?.count ?? 0);
  if (status === "open") {
    if (!process.env.VOTING_TOKEN_SECRET || process.env.VOTING_TOKEN_SECRET.length < 32) throw new Error("VOTING_TOKEN_SECRET minimal 32 karakter diperlukan sebelum voting dibuka.");
    if (numberValue(eligibleRows[0]?.count ?? 0) === 0 || numberValue(candidateRows[0]?.count ?? 0) < 2) throw new Error("Voting membutuhkan peserta eligible dan minimal dua calon published.");
  }
  if (status === "scheduled" && voteCount > 0) throw new Error("Voting dengan suara sah tidak dapat dikembalikan ke terjadwal.");
  await sql.transaction([
    sql`UPDATE elections SET status = ${status}, updated_at = ${now()} WHERE id = ${ELECTION_ID}`,
    sql`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, ${adminId}, ${`election.${status}`}, ${`Status pemilihan diubah menjadi ${status}.`}, ${now()})`
  ]);
}

export async function setResultVisibility(adminId: string, visibility: ResultVisibility) {
  await ensureSchema();
  const sql = sqlClient();
  await sql.transaction([
    sql`UPDATE elections SET result_visibility = ${visibility}, updated_at = ${now()} WHERE id = ${ELECTION_ID}`,
    sql`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, ${adminId}, 'election.result_visibility', ${`Kebijakan hasil diubah menjadi ${visibility}.`}, ${now()})`
  ]);
}

export async function setCandidatePublished(adminId: string, candidateId: string, published: boolean) {
  const event = await eventRow();
  if (event.status === "open") throw new Error("Calon tidak dapat diubah ketika voting dibuka.");
  const changed = await query<{ id: string }>`UPDATE candidates SET is_published = ${published} WHERE id = ${candidateId} AND election_id = ${ELECTION_ID} RETURNING id`;
  if (changed.length !== 1) throw new Error("Calon tidak ditemukan.");
  await audit(adminId, "candidate.publish", "Status publikasi calon diperbarui.");
}

export async function syncCandidateCatalog(adminId: string) {
  const event = await eventRow();
  const sql = sqlClient();
  const voteRows = await query<CountRow>`SELECT COUNT(*)::int AS count FROM votes WHERE election_id = ${ELECTION_ID}`;
  if (event.status === "open" || numberValue(voteRows[0]?.count ?? 0) > 0) throw new Error("Materi calon tidak dapat disinkronkan setelah voting dibuka atau suara tersimpan.");
  await sql.transaction([
    ...candidates.map((candidate) => sql`INSERT INTO candidates (id, election_id, ballot_number, slug, display_name, class_name, poster, vision, missions_json, is_published)
      VALUES (${`candidate-${candidate.number}`}, ${ELECTION_ID}, ${candidate.number}, ${candidate.slug}, ${candidate.name}, ${candidate.className}, ${candidate.poster}, ${candidate.vision}, ${JSON.stringify(candidate.missions)}, TRUE)
      ON CONFLICT (id) DO UPDATE SET ballot_number = EXCLUDED.ballot_number, slug = EXCLUDED.slug, display_name = EXCLUDED.display_name,
      class_name = EXCLUDED.class_name, poster = EXCLUDED.poster, vision = EXCLUDED.vision, missions_json = EXCLUDED.missions_json`),
    sql`UPDATE elections SET updated_at = ${now()} WHERE id = ${ELECTION_ID}`,
    sql`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, ${adminId}, 'candidates.sync_catalog', ${`${candidates.length} materi calon disinkronkan dari katalog proyek.`}, ${now()})`
  ]);
  return candidates.length;
}

export async function replaceVoters(adminId: string, voters: ImportedVoter[]) {
  const event = await eventRow();
  const sql = sqlClient();
  const voteRows = await query<CountRow>`SELECT COUNT(*)::int AS count FROM votes WHERE election_id = ${ELECTION_ID}`;
  if (event.status === "open" || numberValue(voteRows[0]?.count ?? 0) > 0) throw new Error("Daftar peserta tidak dapat diimpor ulang setelah voting dibuka atau suara tersimpan.");
  if (voters.length === 0) throw new Error("Tidak ada peserta valid untuk diimpor.");
  const payload = voters.map((voter) => ({
    id: randomUUID(),
    nim: voter.nim,
    name: voter.name,
    class_name: voter.className,
    attendance_marked: voter.attendanceMarked
  }));
  const importedAt = now();
  await sql.transaction([
    sql`DELETE FROM voting_sessions WHERE election_id = ${ELECTION_ID}`,
    sql`DELETE FROM voters WHERE election_id = ${ELECTION_ID}`,
    sql`INSERT INTO voters (id, election_id, nim, name, class_name, attendance_marked, is_eligible, imported_at)
      SELECT record.id, ${ELECTION_ID}, record.nim, record.name, record.class_name, record.attendance_marked, TRUE, ${importedAt}
      FROM jsonb_to_recordset(${JSON.stringify(payload)}::jsonb) AS record(id TEXT, nim TEXT, name TEXT, class_name TEXT, attendance_marked BOOLEAN)`,
    sql`UPDATE elections SET updated_at = ${now()} WHERE id = ${ELECTION_ID}`,
    sql`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, ${adminId}, 'voters.import', ${`${voters.length} peserta diimpor.`}, ${now()})`
  ]);
}

export async function resetSimulationVotes(adminId: string, reason: string) {
  const event = await eventRow();
  const state = simulationResetState(event);
  if (!state.isAvailable) throw new Error(state.message);
  const sql = sqlClient();
  await sql.transaction([
    sql`UPDATE elections SET status = 'scheduled', result_visibility = 'hidden', updated_at = ${now()} WHERE id = ${ELECTION_ID}`,
    sql`DELETE FROM voting_sessions WHERE election_id = ${ELECTION_ID}`,
    sql`DELETE FROM votes WHERE election_id = ${ELECTION_ID}`,
    sql`DELETE FROM rate_limits WHERE scope IN ('vote.verify', 'vote.submit')`,
    sql`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, ${adminId}, 'simulation.vote_reset', ${`Reset suara simulasi: ${reason.slice(0, 160)}`}, ${now()})`
  ]);
}

export async function resetVoters(adminId: string, reason: string) {
  const event = await eventRow();
  const sql = sqlClient();
  const voteRows = await query<CountRow>`SELECT COUNT(*)::int AS count FROM votes WHERE election_id = ${ELECTION_ID}`;
  if (event.status !== "scheduled") throw new Error("Reset peserta hanya tersedia setelah event kembali terjadwal.");
  if (numberValue(voteRows[0]?.count ?? 0) > 0) throw new Error("Kosongkan suara voting terlebih dahulu.");
  await sql.transaction([
    sql`DELETE FROM voting_sessions WHERE election_id = ${ELECTION_ID}`,
    sql`DELETE FROM voters WHERE election_id = ${ELECTION_ID}`,
    sql`UPDATE elections SET status = 'scheduled', result_visibility = 'hidden', updated_at = ${now()} WHERE id = ${ELECTION_ID}`,
    sql`INSERT INTO audit_logs (id, admin_id, action, detail, created_at) VALUES (${randomUUID()}, ${adminId}, 'election.voters_reset', ${`Reset peserta: ${reason.slice(0, 160)}`}, ${now()})`
  ]);
}

export async function consumeRateLimit(scope: string, keyHash: string, limit: number, windowMs: number) {
  await ensureSchema();
  const windowStarted = Date.now();
  const rows = await query<{ count: number }>`INSERT INTO rate_limits (scope, key_hash, window_started, count)
    VALUES (${scope}, ${keyHash}, ${windowStarted}, 1)
    ON CONFLICT (scope, key_hash) DO UPDATE SET
      window_started = CASE WHEN ${windowStarted} - rate_limits.window_started >= ${windowMs} THEN ${windowStarted} ELSE rate_limits.window_started END,
      count = CASE WHEN ${windowStarted} - rate_limits.window_started >= ${windowMs} THEN 1 ELSE rate_limits.count + 1 END
    WHERE rate_limits.count < ${limit} OR ${windowStarted} - rate_limits.window_started >= ${windowMs}
    RETURNING count`;
  return rows.length === 1;
}

export async function issueVotingSession(nim: string, tokenHash: string, expiresAt: string) {
  await ensureSchema();
  const rows = await query<{ id: string }>`WITH active_event AS (
      SELECT id FROM elections WHERE id = ${ELECTION_ID} AND status = 'open' FOR UPDATE
    ), eligible_voter AS (
      SELECT voters.id FROM voters JOIN active_event ON active_event.id = voters.election_id
      WHERE voters.election_id = ${ELECTION_ID} AND voters.nim = ${nim} AND voters.is_eligible = TRUE
    )
    INSERT INTO voting_sessions (id, election_id, voter_id, token_hash, status, expires_at, created_at)
    SELECT ${randomUUID()}, ${ELECTION_ID}, eligible_voter.id, ${tokenHash}, 'issued', ${expiresAt}, ${now()}
    FROM eligible_voter
    WHERE NOT EXISTS (SELECT 1 FROM votes WHERE votes.election_id = ${ELECTION_ID} AND votes.voter_id = eligible_voter.id)
    ON CONFLICT (token_hash) DO NOTHING
    RETURNING id`;
  return rows.length === 1;
}

export async function submitVote(tokenHash: string, candidateId: string, idempotencyHash: string, receiptCode: string): Promise<VoteSubmitResult> {
  await ensureSchema();
  const castAt = now();
  const inserted = await query<{ receipt_code: string; cast_at: string }>`WITH active_event AS (
      SELECT id FROM elections WHERE id = ${ELECTION_ID} AND status = 'open' FOR UPDATE
    ), active_session AS (
      SELECT voting_sessions.voter_id FROM voting_sessions JOIN active_event ON active_event.id = voting_sessions.election_id
      WHERE voting_sessions.token_hash = ${tokenHash} AND voting_sessions.status = 'issued' AND voting_sessions.expires_at > ${castAt}
    ), valid_candidate AS (
      SELECT id FROM candidates WHERE id = ${candidateId} AND election_id = ${ELECTION_ID} AND is_published = TRUE
    ), inserted AS (
      INSERT INTO votes (id, election_id, voter_id, candidate_id, idempotency_hash, receipt_code, cast_at)
      SELECT ${randomUUID()}, ${ELECTION_ID}, active_session.voter_id, valid_candidate.id, ${idempotencyHash}, ${receiptCode}, ${castAt}
      FROM active_session CROSS JOIN valid_candidate
      ON CONFLICT (election_id, voter_id) DO NOTHING
      RETURNING receipt_code, cast_at
    ), session_updated AS (
      UPDATE voting_sessions SET status = 'submitted' WHERE token_hash = ${tokenHash} AND EXISTS (SELECT 1 FROM inserted)
    ), event_updated AS (
      UPDATE elections SET updated_at = ${castAt} WHERE id = ${ELECTION_ID} AND EXISTS (SELECT 1 FROM inserted)
    ) SELECT receipt_code, cast_at FROM inserted`;
  if (inserted[0]) return { status: "accepted", receiptCode: inserted[0].receipt_code, castAt: inserted[0].cast_at };

  const previous = await query<{ receipt_code: string; cast_at: string; idempotency_hash: string }>`SELECT votes.receipt_code, votes.cast_at, votes.idempotency_hash FROM votes
    JOIN voting_sessions ON voting_sessions.voter_id = votes.voter_id AND voting_sessions.election_id = votes.election_id
    WHERE voting_sessions.token_hash = ${tokenHash} AND votes.election_id = ${ELECTION_ID}`;
  if (previous[0]) return previous[0].idempotency_hash === idempotencyHash
    ? { status: "accepted", receiptCode: previous[0].receipt_code, castAt: previous[0].cast_at }
    : { status: "already_voted" };

  const event = await eventRow();
  if (event.status !== "open") return { status: "election_not_open" };
  const candidate = await query<{ id: string }>`SELECT id FROM candidates WHERE id = ${candidateId} AND election_id = ${ELECTION_ID} AND is_published = TRUE`;
  return candidate[0] ? { status: "invalid_session" } : { status: "candidate_unavailable" };
}

export async function getReceipt(receiptCode: string) {
  await ensureSchema();
  const rows = await query<{ receipt_code: string; cast_at: string }>`SELECT receipt_code, cast_at FROM votes WHERE receipt_code = ${receiptCode}`;
  return rows[0];
}
