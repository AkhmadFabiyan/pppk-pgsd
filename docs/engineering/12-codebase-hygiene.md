# Codebase Hygiene

Pisahkan UI dari service vote, query database, dan authorization. Gunakan type eksplisit, schema bersama, naming domain `Candidate`, `Election`, `Vote`, `Voter`, dan test fixture terisolasi.

Hapus dead code/dependency sebelum release. Tidak ada secret/PII di commit, sample, comment, seed, atau screenshot. Perubahan dependency dicatat di log dan diuji build.
