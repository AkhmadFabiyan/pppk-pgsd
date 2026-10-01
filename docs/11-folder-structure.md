# Struktur Folder Target

```text
src/
  app/                 # rute App Router dan metadata
  components/          # UI presentasional yang aksesibel
  features/             # vote, candidate, event, admin, results
  server/               # service, authorization, transaction, audit
  lib/                  # schema, config, crypto/redaction, helpers
  data/                 # fixture dummy saja, bukan master production
docs/                   # source of truth; docs/data restricted
public/                 # aset publik yang sudah disetujui saja
tests/                  # unit, integration, e2e, load fixtures
```

Tidak ada spreadsheet, export, `.env`, NIM, receipt asli, atau audit log di `public/`, bundle client, fixture, screenshot, maupun repository publik. Detail dependency dan environment berada di `05-rencana-implementasi.md` dan `06-arsitektur-teknis.md`.
