# Deployment dan Release Freeze

Deploy melewati staging, migration review, health check, smoke test, rollback plan, serta sign-off admin event. Environment variable/secrets tidak ditulis di docs atau source. Domain canonical HTTPS dikunci sebelum SEO release.

Mulai freeze, hanya SEV-1/SEV-2 yang dapat mengubah production dengan approval. Build/version dan config snapshot diarsipkan setelah close.
