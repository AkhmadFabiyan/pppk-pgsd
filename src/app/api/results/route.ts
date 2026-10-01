import { NextResponse } from "next/server";
import { getElectionSnapshot } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const election = getElectionSnapshot();
  if (!election.result) return NextResponse.json({ data: { status: election.status, visible: false } }, { status: 404, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ data: { status: election.status, visible: true, result: election.result } }, { headers: { "Cache-Control": "no-store" } });
}
