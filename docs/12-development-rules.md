# Aturan Pengembangan

- Mulai setiap pekerjaan dengan entry `EXE-*` pada `16-log-eksekusi.md`.
- Kode mengikuti kontrak `07-kontrak-data.md` dan `08-kontrak-api-dan-realtime.md`; perubahan kontrak memperbarui dokumen dalam perubahan yang sama.
- Client boleh memvalidasi UX, tetapi server menentukan eligibility, waktu event, candidate aktif, idempotency, dan one-vote rule.
- Gunakan dependency terkunci, schema validation bersama, error ter-redaksi, lint, typecheck, test, dan build di CI.
- Dilarang mengakses spreadsheet production dari browser, local fixture, atau analitik.
- PR/commit harus menyebut ID entry kerja, test yang dijalankan, risiko, serta dokumen terdampak.

Rincian hygiene ada di `engineering/12-codebase-hygiene.md`; kriteria rilis ada di `10-quality-gate-dan-pengujian.md`.
