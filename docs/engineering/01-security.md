# Security Baseline

Admin memakai login kuat, MFA production, session aman, authorization server-side, CSRF protection, rate limit, secret manager, dan audit. Visitor tidak mendapat akses endpoint admin, export, raw voter, maupun audit.

Validasi input/file berada di server. Error publik ter-redaksi; log tidak menyimpan NIM/token mentah. Dependency scan, secret scan, dan vulnerability review adalah release gate.
