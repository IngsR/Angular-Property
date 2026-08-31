# 🏡 HouseING Property — Platform Pencarian & Keputusan Properti

[![Angular](https://img.shields.io/badge/Angular-Standalone_Architecture-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25_Pure-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4_Modern_Design-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-Fast_Package_Manager-FBF0DF?logo=bun&logoColor=black)](https://bun.sh/)

> **HouseING Property** adalah aplikasi web modern berbasis **Angular Standalone Components (Full TypeScript)** yang dirancang untuk membantu calon pembeli rumah mengambil keputusan pembelian dan finansial properti secara objektif, transparan, dan terverifikasi.

---

## 📌 Ringkasan Eksekutif (Untuk HR & Recruiter)

Aplikasi ini mendemonstrasikan implementasi arsitektur frontend tingkat enterprise dengan fokus pada:
1. **Modern State Reactivity**: Menggunakan **Angular Signals** (`signal()`, `computed()`, `effect()`) untuk reaktivitas state berkecepatan tinggi tanpa overhead kompleksitas store pihak ketiga.
2. **Clean Domain-Driven Architecture**: Pemisahan lapisan kode yang jelas antara `core` (models, types, services, repository), `shared` (UI primitives, pipes, layout components), dan `features` (halaman mandiri & business logic).
3. **100% Full TypeScript & Standalone Components**: Seluruh kode ditulis murni dalam TypeScript dengan deklarasi tipe data yang ketat (`strict`), tanpa JSX/React, dan tanpa file NgModule legacy.
4. **Performance & Modern Tooling**: Dibangun menggunakan **Bun** sebagai runtime/package manager dan **Tailwind CSS v4** dengan sistem lazy-loaded routes untuk waktu inisialisasi awal yang sangat cepat.

---

## 🚀 Fitur Utama & Value Proposition

### 1. 🏠 Smart Discovery & Filter Multidimensi
- Pencarian cerdas berbasis tokenisasi teks (mencakup judul, deskripsi, developer, legalitas, kecamatan, dan kota).
- Filter lanjutan: Pilihan kota (Padang, Jakarta, Bandung, Bali, dll), kategori tipe properti, rentang harga fleksibel, dan jumlah kamar tidur.
- Sorting engine multi-parameter: Relevansi, harga terendah/tertinggi, properti terbaru, serta luas tanah dan bangunan terbesar.

### 2. 📐 Visual Blueprint & Denah Arsitektur 2D Terukur
- Eksplorasi denah arsitektur bertingkat (*multi-floor level switcher*) dengan kontrol **Zoom In/Out/Reset** dan tampilan layar penuh.
- Visual kompas penunjuk arah mata angin arsitektural (Utara).
- Tabel rincian dimensi presisi per ruangan lengkap dengan proporsi luas terhadap total luas lantai dan *highlight* arsitektur (sirkulasi silang, tinggi plafon 3.8m, fondasi rumah tumbuh).

### 3. ⚖️ Matriks Komparasi 2 Properti Objektif
- Membandingkan 2 properti pilihan secara berdampingan (*side-by-side matrix*).
- Sinkronisasi metrik kunci: Harga penawaran, estimasi cicilan KPR, legalitas sertifikat (SHM/PPJB), spesifikasi fisik (LB/LT, kamar, lantai, parkir), dan developer terverifikasi.
- Dialog modal interaktif untuk memilih unit pembanding dari katalog secara instan.

### 4. 🧮 Simulator KPR Finansial Standar Bank Indonesia
- Perhitungan angsuran KPR bulanan formula anuitas perbankan secara *real-time*.
- Parameter interaktif: Slider uang muka (% & nominal Rupiah), pilihan suku bunga acuan, dan tenor pinjaman (hingga 25 tahun).
- Rekomendasi penghasilan minimum keluarga berbasis batas aman *Debt Service Ratio (DSR)* maksimal 33%.
- Tabel rincian jadwal amortisasi tahunan (pembagian porsi pembayaran pokok vs bunga hingga akhir masa tenor).

### 5. ❤️ Sistem Favorit & Notifikasi Toast Reaktif
- Penyimpanan listing hunian favorit pengguna dengan persistensi `localStorage`.
- Notifikasi toast reaktif untuk setiap interaksi aksi pengguna (simpan favorit, tambah komparasi, reset).

---

## 🏗️ Struktur Arsitektur Proyek

```
src/
├── app/
│   ├── app.config.ts          # ApplicationConfig & Provider setup (Router, ChangeDetection)
│   ├── app.routes.ts          # Lazy-loaded route definitions
│   └── app.ts                 # Root App Shell (Header, Router Outlet, Footer, Toast)
├── core/
│   ├── models/                # Domain models & navigation interfaces
│   ├── repositories/          # Type-safe Repository Pattern (Mock API dengan simulasi latency)
│   ├── services/              # Angular @Injectable Signals Services (Favorite, Comparison, Notification, KPR)
│   └── types/                 # Pure TypeScript type declarations (Property, KPR, Notification)
├── features/
│   ├── home/pages/            # Beranda: Hero Search, Panduan Pembeli Cerdas, Featured Listing
│   ├── discovery/             # Katalog: Filter Sidebar, Search Console, Property Card Component
│   ├── property/pages/        # Detail: Galeri Foto, Denah 2D, Spesifikasi, Peta, Decision Panel
│   ├── comparison/pages/      # Matriks Komparasi 2 Properti Side-by-Side
│   ├── favorites/pages/       # Halaman Koleksi Properti Tersimpan
│   └── simulator/kpr/pages/   # Simulator KPR & Analisis Kelayakan Finansial
├── shared/
│   ├── components/            # Reusable Header, Footer, dan Breadcrumbs
│   ├── pipes/                 # Custom Pipes (RupiahPipe untuk format mata uang)
│   ├── ui/                    # Atom UI components (Button, Modal, EmptyState, Skeleton)
│   └── utils/                 # Utility helper functions & formatters
├── assets/mock/               # Dataset properti, developer, lokasi, dan fasilitas
├── index.html                 # Single Page Application HTML Entry Point
├── main.ts                    # Bootstrap entry point
└── styles.css                 # Tailwind CSS v4 root stylesheet
```

---

## 💻 Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
- [Bun](https://bun.sh/) (v1.2+) atau [Node.js](https://nodejs.org/) (v20+)

### Langkah Instalasi & Menjalankan

1. **Clone repository & masuk ke direktori proyek**:
   ```bash
   cd d:/Project/Angular
   ```

2. **Instal seluruh dependensi menggunakan Bun**:
   ```bash
   bun install
   ```

3. **Jalankan development server**:
   ```bash
   bun run start
   ```
   *Aplikasi akan berjalan secara default di: **`http://localhost:4200/`***

4. **Build bundle production**:
   ```bash
   bun run build
   ```
   *Hasil build yang telah dioptimasi akan berada di direktori `dist/property-decide`.*

---

## 🛠️ Ringkasan Teknologi (Tech Stack)

| Komponen | Teknologi yang Digunakan |
|---|---|
| **Framework** | **Angular** (Standalone Components Architecture) |
| **Bahasa Pemrograman** | **TypeScript** (Strict Type-Checking) |
| **Package Manager** | **Bun** |
| **Styling & CSS** | **Tailwind CSS v4** + PostCSS |
| **State Management** | **Angular Signals** (`signal`, `computed`, `effect`) |
| **Routing** | **Angular Router** (Lazy-loading per feature page) |
| **Design Pattern** | **Repository Pattern & Dependency Injection** |

---

## 👨‍💻 Profil Pengembang

Dibuat dengan standar kualitas kode, efisiensi performa, dan arsitektur modern untuk seleksi rekrutmen pengembang web profesional.
