# Database Catalog

Database bersifat transaksional dan menjadi sumber kebenaran untuk eligibility, vote, audit, serta hasil. Public scoreboard membaca agregat yang sudah disanitasi, bukan tabel vote raw.

Setiap tabel di folder ini menjelaskan tujuan, field kunci, constraint, lifecycle, dan akses. Skema lintas entitas berada di `../07-kontrak-data.md`.
