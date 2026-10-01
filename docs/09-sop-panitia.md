# 09. SOP Panitia

## Sebelum voting

1. Admin yang ditunjuk menetapkan daftar pemilih, calon, periode WIB, kebijakan hasil, dan data-retention owner secara tertulis.
2. Admin mengimpor spreadsheet ke staging import, memperbaiki baris invalid di file sumber, lalu melakukan commit setelah admin kedua menyetujui jumlah dan duplikat.
3. Admin memasukkan calon; admin kedua memeriksa foto, nama, visi-misi, nomor urut, serta tampilan mobile.
4. Admin memeriksa konfigurasi terkunci: event, calon aktif, total eligible, MFA, domain HTTPS, backup, serta contact person incident.
5. Panitia menjalankan simulasi voting dengan data dummy pada staging: vote serentak, retry setelah timeout, hasil realtime, ekspor, close event, dan audit.
6. Admin menghapus data dummy dari staging; production hanya memuat data final yang telah disetujui.

## Saat voting

| Fungsi operasional admin | Tugas |
| --- | --- |
| Admin monitoring | Memantau dashboard kesehatan, antrian, invalid attempt agregat, dan pertanyaan pemilih. Tidak mengubah calon atau periode. |
| Admin review | Memantau audit log dan anomali; mencatat incident tanpa melihat pilihan pemilih. |
| Admin penanggung jawab | Menyetujui tindakan exception atau penghentian sementara. |

- Permintaan bantuan pemilih diverifikasi tanpa menyebut calon pilihan. Panitia tidak meminta screenshot yang memuat NIM kepada kanal publik.
- Jika hasil calon disembunyikan, panitia juga tidak menyebarkannya dari dasbor internal selama voting terbuka.
- Jika ada lonjakan error, admin mengaktifkan halaman status dan mencatat waktu/impact; jangan membuka ulang atau memperpanjang periode tanpa keputusan admin yang terekam.

## Menutup voting dan pengumuman

1. Sistem otomatis menolak submit setelah `closes_at`; admin memverifikasi status dan total rekap.
2. Admin menutup event secara eksplisit bila diperlukan, lalu konfigurasi tetap terkunci.
3. Admin mengekspor rekap hasil dan log audit, memverifikasi checksum, lalu menyimpan arsip pada penyimpanan panitia yang disetujui.
4. Hasil calon dipublikasikan mengikuti kebijakan event. Pengumuman menyebut total eligible, total sah, partisipasi, calon, dan suara sah tanpa identitas pemilih.
5. Masa sengketa dibuka sesuai keputusan panitia. Koreksi tidak boleh mengedit vote langsung; gunakan proses request, alasan, persetujuan pihak berbeda, dan rekap revisi.

## Reset draft dan pemilihan ulang

- Reset hanya boleh dilakukan pada `draft`/`scheduled` sebelum ada vote sah, melalui re-auth, alasan tertulis, dan persetujuan akun admin kedua.
- Jika event sudah memiliki vote sah, panitia tidak boleh mengosongkan hasil atau membuat peserta memilih ulang pada event yang sama. Tutup event, arsipkan bukti, lalu gunakan prosedur `Buat pemilihan ulang` untuk membuat event baru.
- Reset data simulasi hanya berlaku untuk local/staging dengan data dummy; tidak pernah untuk production atau spreadsheet peserta asli.
- Rincian batas data, UI, API, dan test berada pada `13-reset-dan-pengulangan-event.md`.

## SOP insiden

| Kejadian | Respons awal | Eskalasi |
| --- | --- | --- |
| Pemilih mendapat `already_voted` | Beri instruksi cek receipt/layanan panitia; jangan membuka detail suara. | Admin menelusuri audit dengan NIM melalui kanal privat. |
| Indikasi bot/brute force | Rate limit/CAPTCHA; simpan alert agregat. | Admin memutuskan pembatasan tambahan. |
| Gangguan database/provider | Hentikan penerimaan bila integritas tidak dapat dijamin; tampilkan status. | Catat incident, pulihkan, lalu lakukan rekonsiliasi. |
| Dugaan akses admin tidak sah | Cabut sesi/credential terdampak, preserve log, jangan menghapus bukti. | Admin penanggung jawab dan pemilik data. |
| Salah konfigurasi sebelum open | Perbaiki draft dan audit perubahan. | Admin kedua mengesahkan ulang. |

## Checklist produksi

- [ ] Domain production HTTPS dan redirect HTTP benar.
- [ ] Backup database diuji pemulihannya.
- [ ] Minimal dua akun admin aktif, MFA aktif, dan akun pengaju/penyetuju aksi sensitif berbeda.
- [ ] Calon, daftar eligible, jadwal WIB, dan visibility hasil disetujui.
- [ ] Uji satu NIM satu suara dan submit simultan lulus.
- [ ] Pemberitahuan privasi dan kanal bantuan tampil.
- [ ] Dashboard kesehatan, logging, alert, dan prosedur rollback siap.

## Struktur komando dan kanal komunikasi

| Fungsi | Minimal personel | Otoritas | Kanal yang disetujui |
| --- | --- | --- | --- |
| Admin penanggung jawab event | 1 | Buka/tutup, keputusan sengketa, incident severity tinggi. | Kanal internal prioritas. |
| Admin operasional | 1-2 | Calon draft, import, bantuan umum, dashboard. | Kanal bantuan/panel. |
| Admin review | 1 | Audit/log/rekonsiliasi/export final. | Kanal internal restricted. |
| Penanggung jawab teknis | 1 | Deploy, kesehatan infra, recovery. | Kanal incident. |
| Humas bantuan | 1+ | Komunikasi ke pemilih tanpa akses PII. | FAQ/WhatsApp resmi yang disetujui. |

Satu orang tidak boleh menjadi pengaju dan penyetuju void yang sama. Nama, nomor kontak, dan pengganti setiap fungsi dicatat di runbook internal, tidak di halaman publik.

## Runbook pembukaan event

1. T-60 menit: admin operasional memastikan dashboard sehat, backup berstatus berhasil, calon/config snapshot sesuai sign-off, dan kanal realtime menerima test event nonproduction atau health signal.
2. T-30 menit: admin review mengunci final checklist, memeriksa MFA, jumlah eligible, serta status halaman privasi/bantuan.
3. T-10 menit: humas menerbitkan link resmi dan instruksi singkat; tidak membagikan daftar NIM atau screenshot dashboard internal.
4. T-0: admin penanggung jawab membuka event atau memastikan scheduled transition berhasil. Admin operasional memverifikasi dari browser visitor dan admin bahwa status, countdown, serta hasil live konsisten.
5. T+5 menit: admin review menyimpan snapshot baseline rekap dan event revision pertama; admin operasional memantau error dan invalid attempt agregat.

## Runbook penutupan event

1. Setelah `closes_at`, admin operasional mencoba submit test yang aman/terkendali untuk membuktikan server menolak vote baru tanpa membuat record.
2. Admin review membandingkan `total_cast` dashboard, hasil export, dan agregat query; perbedaan harus diselesaikan sebelum pengumuman.
3. Admin penanggung jawab mengesahkan status `closed`, hasil, timestamp, dan versi rekap. Konfigurasi tidak dibuka ulang untuk mengubah tampilan hasil.
4. Generate tiga arsip terpisah: rekap final, daftar partisipasi restricted, dan audit log restricted; masing-masing diberi checksum serta lokasi penyimpanan.
5. Humas mengumumkan hasil menggunakan template yang disetujui, menyertakan total eligible/sah/partisipasi dan prosedur sengketa, tanpa PII.

## Severity insiden dan target respons

| Severity | Contoh | Target pertama | Tindakan |
| --- | --- | --- | --- |
| SEV-1 | Vote tidak dapat dipastikan integritasnya, akses admin tidak sah, database write gagal. | Segera | Pause/close sesuai keputusan admin penanggung jawab, preserve evidence, escalation teknis/pemilik data. |
| SEV-2 | Submit error besar, realtime total tertinggal, lonjakan bot. | Cepat | Aktifkan status, mitigation rate/capacity, rekonsiliasi sebelum lanjut. |
| SEV-3 | Satu pemilih token expired, import draft invalid, issue tampilan non-kritis. | Dalam operasional normal | Bantu pengguna/perbaiki draft, catat issue. |
| SEV-4 | Pertanyaan umum/typo konten draft. | Backlog | Perbaiki hanya bila event belum terkunci. |

## Bukti dan komunikasi insiden

- Catat waktu mulai/deteksi, impact, request/correlation ID, aksi, keputusan, owner, dan waktu pemulihan dalam incident log.
- Jangan meminta atau memposting NIM, screenshot vote, token, atau pilihan calon pada grup publik.
- Preserve log dan export relevan sebelum melakukan recovery; jangan menghapus data untuk "merapikan" incident.
- Hanya admin penanggung jawab/humas yang menyampaikan status publik. Status harus faktual: apa yang terdampak, tindakan sementara, dan kapan update berikutnya, tanpa spekulasi.

## Template bukti UAT

| Area | Bukti yang dilampirkan |
| --- | --- |
| Integritas | Hasil `VOT-01` sampai `VOT-06`, terutama request paralel dan idempotency. |
| Data | Preview import, count eligible, duplikat nol atau daftar penyelesaian. |
| Security | MFA/admin-policy screenshot ter-redaksi, hasil scan, uji PII response. |
| UX | Mobile/desktop, keyboard, screen reader/reduced motion, copy recovery. |
| Operasional | Backup restore drill, realtime fallback, incident tabletop, sign-off akun admin. |
