import readXlsxFile from "read-excel-file/node";
import type { ImportedVoter } from "@/lib/db";

function cellText(value: unknown) {
  return String(value ?? "").trim();
}

function headerIndex(row: unknown[], label: string) {
  return row.findIndex((value) => cellText(value).toLocaleUpperCase("id-ID") === label);
}

export async function parseVoterWorkbook(buffer: Buffer): Promise<ImportedVoter[]> {
  const sheets = await readXlsxFile(buffer);
  const byNim = new Map<string, ImportedVoter>();

  for (const sheet of sheets) {
    const headerRowIndex = sheet.data.findIndex((row) => headerIndex(row, "NIM") >= 0 && headerIndex(row, "NAMA") >= 0 && headerIndex(row, "KELAS") >= 0);
    if (headerRowIndex < 0) continue;
    const header = sheet.data[headerRowIndex];
    const nimIndex = headerIndex(header, "NIM");
    const nameIndex = headerIndex(header, "NAMA");
    const classIndex = headerIndex(header, "KELAS");
    const attendanceIndex = headerIndex(header, "TTD");

    for (const row of sheet.data.slice(headerRowIndex + 1)) {
      const nim = cellText(row[nimIndex]).replace(/\s/g, "");
      const name = cellText(row[nameIndex]).replace(/\s+/g, " ");
      const className = cellText(row[classIndex]).replace(/\s+/g, " ").toUpperCase();
      if (!nim && !name && !className) continue;
      if (!/^\d{8,20}$/.test(nim) || !name || !className) throw new Error("Spreadsheet memiliki baris peserta dengan NIM, nama, atau kelas yang tidak valid.");
      if (byNim.has(nim)) throw new Error("Spreadsheet memiliki NIM duplikat.");
      byNim.set(nim, { nim, name, className, attendanceMarked: Boolean(cellText(row[attendanceIndex])) });
    }
  }

  const voters = [...byNim.values()];
  if (voters.length === 0) throw new Error("Kolom NIM, NAMA, dan KELAS tidak ditemukan pada spreadsheet.");
  return voters;
}
