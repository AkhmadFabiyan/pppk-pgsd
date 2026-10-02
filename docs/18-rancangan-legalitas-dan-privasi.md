# Rancangan Legalitas dan Privasi

Sebelum production, panitia menetapkan pemilik data, dasar penggunaan NIM, pemberitahuan privasi, akses admin, lokasi penyimpanan, retensi, prosedur permintaan bantuan, serta prosedur sengketa. NIM adalah data pribadi operasional dan tidak boleh dijadikan identifier URL atau telemetry.

Rilis ini tidak mengumpulkan fingerprint browser/HP. IP hanya HMAC rate-limit; cookie server dan token instalasi local storage menjadi dua claim browser yang di-HMAC, tetapi bukan bukti perangkat fisik atau identitas manusia. Detail notice, retensi, dan batas pengumpulan berada di `20-integritas-perangkat-dan-anti-duplikasi.md`. Pengumpulan biometrik, lokasi presisi, atau kontak pribadi berada di luar scope tanpa persetujuan baru.

Data diklasifikasikan dalam `03-data-dan-keamanan.md`; prosedur export/hapus ada di `workflow/privacy-retention.md`.
