# HouseING Property

Aplikasi Angular untuk mencari, membandingkan, dan menghitung simulasi KPR properti.

## Fitur

- Pencarian properti dengan filter lokasi, harga, tipe, kamar, fasilitas, dan ketersediaan.
- Detail properti dengan galeri, denah, spesifikasi, dan legalitas.
- Perbandingan dua properti.
- Daftar favorit dengan penyimpanan lokal.
- Simulator KPR dan jadwal amortisasi.

## Struktur

```text
src/
├── app/
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── core/
│   │   ├── services/
│   │   └── types/
│   ├── features/
│   │   ├── home/home.component.ts
│   │   ├── discovery/discovery.component.ts
│   │   ├── discovery/components/card.component.ts
│   │   ├── property/property.component.ts
│   │   ├── comparison/comparison.component.ts
│   │   ├── favorites/favorites.component.ts
│   │   └── simulator/kpr/kpr.component.ts
│   └── shared/
│       ├── components/
│       ├── pipes/
│       ├── ui/
│       └── utils/
├── assets/mock/
├── index.html
├── main.ts
└── styles.css
```

## Menjalankan

Prasyarat: Node.js 20 atau lebih baru.

```bash
npm install
npm start
```

Aplikasi tersedia di `http://localhost:4200/`.

## Perintah

```bash
npm test
npm run build
```

Build production berada di `dist/houseing-property`.

## Prinsip

- Gunakan standalone component dan lazy route.
- Letakkan service global di `app/core/services`.
- Letakkan komponen umum di `app/shared`.
- Gunakan `track` pada setiap `@for`.
- Pertahankan HTML semantik, `alt` gambar, judul route, dan metadata halaman.
