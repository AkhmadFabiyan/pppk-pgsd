# Realtime dan Konsistensi Hasil

Server menjadi sumber agregat. Event realtime hanya membawa revision dan snapshot/patch agregat publik. Client yang revision-nya lompat wajib refetch snapshot; realtime down beralih ke polling tanpa mengubah vote transaction.

Jangan broadcast voter ID, candidate pilihan per pemilih, IP, receipt, atau raw count yang belum transaction-committed.
