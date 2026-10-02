import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { getReceipt } from "@/lib/db";

export const metadata: Metadata = { title: "Bukti Suara", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type ReceiptParams = Promise<{ receiptCode: string }>;

export default async function ReceiptPage({ params }: { params: ReceiptParams }) {
  const { receiptCode } = await params;
  const receipt = /^PGSD-[A-F0-9]{10}$/.test(receiptCode) ? await getReceipt(receiptCode) : undefined;
  const castAt = receipt ? new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(receipt.cast_at)) : null;
  return (
    <PageTransition>
      <section className="status-screen"><article className="status-card"><FileCheck2 aria-hidden="true" /><p className="eyebrow eyebrow-green">Bukti suara</p>{receipt ? <><h1>Suaramu diterima.</h1><p>Simpan kode bukti ini. Kode tidak menampilkan NIM atau pilihanmu.</p><p className="receipt-code">{receipt.receipt_code}</p><p>Diterima · {castAt} WIB.</p></> : <><h1>Kode bukti tidak ditemukan.</h1><p>Cek kembali kodenya. Halaman ini tidak menampilkan data pemilih atau pilihan.</p></>}<Link className="button" href="/">Kembali ke beranda</Link></article></section>
    </PageTransition>
  );
}
