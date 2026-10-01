# Backup dan Recovery

Backup terenkripsi, akses restricted, jadwal terdokumentasi, dan restore drill dilakukan di staging. Rekonsiliasi setelah restore membandingkan checksum rekap, count vote, migration state, dan config snapshot.

Saat integritas write diragukan, pause acceptance sesuai SOP; jangan memulihkan dengan edit manual vote.
