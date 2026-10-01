# API Engineering Contract

Endpoint dibagi public read, visitor verification/submit, dan admin protected. Semua mutation memiliki request ID, schema, authorization, audit, status error stabil, dan `Cache-Control: no-store` bila memuat state sensitif.

Public result hanya mengirim agregat yang disetujui. Jangan menambah endpoint tanpa memperbarui `08-kontrak-api-dan-realtime.md` dan test API.
