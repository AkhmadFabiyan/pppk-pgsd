# Quality Gates Engineering

Minimum CI: format/lint, typecheck, unit, integration database, API contract, E2E critical path, security scan, dan production build. Staging wajib memakai fixture anonim kecuali prosedur khusus disetujui.

Tidak ada bypass untuk test one-vote, PII redaction, authorization admin, atau migration review. Detail scenario ada di `../10-quality-gate-dan-pengujian.md`.
