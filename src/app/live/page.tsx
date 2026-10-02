import type { Metadata } from "next";
import { LiveResultsBoard } from "@/components/live-results-board";
import { getElectionSnapshot } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hasil Live",
  description: "Layar hasil resmi Pemilihan Ketua Angkatan PGSD 2026.",
  robots: { index: false, follow: false }
};

export default async function LiveResultsPage() {
  const election = await getElectionSnapshot();
  return <LiveResultsBoard candidates={election.candidates} initialResult={election.result} initialStatus={election.status} />;
}
