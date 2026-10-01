# Data Protection by Design

Pisahkan PII voter dari result public; gunakan ID internal/FK, minimalkan kolom, enkripsi at-rest bila provider mendukung, dan batasi export. NIM selalu string. Hapus/retensi mengikuti keputusan DEC-05.

Database backup, dashboard, analytics, error tracker, dan fixture dilarang menerima PII tanpa approval tertulis.
