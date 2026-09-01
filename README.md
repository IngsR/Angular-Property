# HouseING Property

HouseING Property adalah proyek portofolio **Ikhwan Ramadhan**, Frontend
Engineer, yang berfokus pada pencarian dan pengambilan keputusan properti.

Proyek ini bukan marketplace produksi. Data yang digunakan adalah data mock,
namun alur yang dibangun sengaja mendekati kebutuhan aplikasi nyata: mencari
listing, membaca detail, menyimpan pilihan, membandingkan unit, dan menghitung
kemampuan cicilan.

## Tentang Pengembang

Saya Ikhwan Ramadhan, Frontend Engineer dengan latar belakang S1 Teknik
Informatika UPI "YPTK" Padang. Fokus saya adalah membangun antarmuka web yang
terstruktur, mudah dirawat, responsif, dan memiliki alasan teknis yang jelas.

Teknologi yang digunakan dalam proyek ini antara lain Angular, TypeScript,
RxJS, Angular Signals, Tailwind CSS, dan Vitest.

- GitHub: <https://github.com/IngsR>
- LinkedIn: <https://www.linkedin.com/in/ikhwn-rdn>
- Website: <https://ikhwann.my.id>

## Masalah yang Diangkat

Informasi properti sering tersebar dan sulit dibandingkan. Harga, luas, kamar,
legalitas, fasilitas, dan estimasi cicilan biasanya berada di tempat yang
berbeda. Akibatnya, calon pembeli dapat mengambil keputusan hanya berdasarkan
foto atau harga awal tanpa memahami konsekuensi finansialnya.

Dari sisi antarmuka, masalahnya juga tidak sederhana:

- katalog harus tetap mudah dipindai ketika jumlah listing bertambah;
- filter harus memberi hasil yang bisa dipahami, bukan hanya mengubah angka;
- detail properti membutuhkan banyak informasi tanpa membuat halaman terasa
  penuh;
- perbandingan harus membantu keputusan, bukan sekadar menampilkan dua kartu;
- simulator KPR harus memberi estimasi yang transparan, bukan angka tanpa
  konteks;
- tampilan mobile harus tetap nyaman pada layar kecil dan perangkat yang lebih
  lambat.

## Solusi yang Dikembangkan

HouseING Property menyatukan alur tersebut dalam satu aplikasi:

1. Pengguna dapat mencari properti berdasarkan kata kunci dan filter.
2. Kartu properti menampilkan informasi penting untuk pemindaian cepat.
3. Halaman detail menyajikan foto, spesifikasi, denah, fasilitas, dan legalitas.
4. Properti dapat disimpan sebagai favorit menggunakan `localStorage`.
5. Dua properti dapat dibandingkan dengan metrik yang sama.
6. Simulator KPR menghitung cicilan, kebutuhan penghasilan, dan amortisasi.

Fokus proyek ini adalah kualitas pengalaman frontend dan struktur kode. Data
mock dipakai agar perhatian dapat diarahkan pada alur produk, state, layout,
aksesibilitas, performa, dan maintainability.

## Mengapa Angular

Angular dipilih karena cocok untuk aplikasi dengan banyak halaman, state, dan
batas tanggung jawab yang jelas. Keunggulan Angular yang benar-benar dipakai di
proyek ini adalah:

### Standalone Components

Setiap halaman dan UI component berdiri sendiri melalui `standalone: true`.
Dependensi terlihat langsung pada metadata `imports`, sehingga tidak ada
`NgModule` besar yang harus dilacak ketika fitur berubah.

### Dependency Injection

Service global seperti data properti, favorit, perbandingan, dan notifikasi
menggunakan `providedIn: 'root'`. Logic tersebut tidak diletakkan di dalam
komponen sehingga dapat digunakan ulang dan diuji secara terpisah.

### Signals

State yang bersifat lokal atau interaktif menggunakan signals dan computed
values. Contohnya jumlah favorit, daftar perbandingan, status loading, filter,
dan hasil simulator. Nilai turunan dihitung dari state sumber, bukan disalin
ke banyak variabel yang mudah tidak sinkron.

### Zoneless Change Detection dan OnPush

Aplikasi menggunakan `provideZonelessChangeDetection()`. Komponen halaman dan
kartu properti juga menggunakan `ChangeDetectionStrategy.OnPush`. Ini penting
karena kartu dirender berulang kali dan tidak seharusnya diperiksa ulang untuk
perubahan yang tidak berkaitan.

### Lazy Loading pada Route

Halaman home, discovery, detail, comparison, favorites, dan simulator dimuat
melalui `loadComponent`. Pengguna tidak perlu mengunduh seluruh fitur ketika
baru membuka halaman awal.

### Template Control Flow

Perulangan menggunakan `@for` dengan `track property.id`. Angular dapat
mempertahankan DOM card yang tidak berubah ketika hasil filter diperbarui.

### TypeScript dan Type Safety

Model properti, KPR, notifikasi, lokasi, fasilitas, dan partner dipisahkan dari
komponen. Ini membantu mencegah data dengan bentuk yang salah masuk ke UI.

## Performa dan Responsivitas

Performa tidak diselesaikan dengan menambahkan semua fitur Angular sekaligus.
Optimasi diterapkan pada bagian yang paling sering dirender atau paling terasa
pada perangkat mobile:

- card properti memakai `OnPush`;
- gambar memakai `loading="lazy"` dan `decoding="async"`;
- setiap list memakai `track`;
- route fitur memakai lazy loading;
- efek blur dan transform dikurangi pada perangkat touch;
- animasi menghormati `prefers-reduced-motion`;
- ukuran gambar diberi dimensi tetap untuk mengurangi layout shift;
- data mock diolah sekali oleh `PropertyService` sebelum digunakan halaman.

Target 60 FPS tetap harus diuji pada perangkat dan kondisi jaringan yang nyata.
Build yang kecil saja tidak membuktikan FPS. Chrome DevTools Performance,
Lighthouse, dan pengujian pada perangkat Android kelas menengah tetap diperlukan
sebelum menyimpulkan performa produksi.

## SEO dan Identitas Portofolio

Identitas pengembang tidak disembunyikan dari halaman proyek. Metadata HTML
mencantumkan Ikhwan Ramadhan sebagai Frontend Engineer dan structured data
menghubungkan pengembang dengan aplikasi HouseING Property.

Halaman juga memiliki:

- title dan description yang relevan;
- canonical URL;
- Open Graph metadata;
- data `Person` untuk profil pengembang;
- data `WebApplication` untuk proyek;
- alt text pada gambar utama;
- heading dan elemen HTML yang bermakna.

Meta tag tidak menjamin posisi pencarian. Indexing, kualitas konten, performa
hosting, backlink, sitemap, Search Console, dan reputasi domain tetap berperan.
Karena aplikasi ini adalah SPA, route title sudah tersedia, tetapi SEO tingkat
lanjut per halaman akan lebih kuat jika ditambah prerendering atau SSR.

## FAQ Kritis

### Apakah data properti ini data produksi?

Belum. Data berasal dari file JSON mock. Keputusan ini disengaja agar prototipe
frontend dapat diuji tanpa membuat klaim terhadap listing atau harga nyata.
Untuk produksi, service dapat diganti dengan API tanpa mengubah komponen yang
menggunakan kontrak modelnya.

### Apakah simulator KPR adalah keputusan finansial?

Bukan. Simulator memberikan estimasi berdasarkan input seperti harga, uang muka,
bunga, dan tenor. Bunga bank, biaya administrasi, asuransi, pajak, dan kebijakan
kredit dapat mengubah hasil. Pengguna tetap perlu meminta simulasi resmi dari
bank atau konsultan yang berwenang.

### Mengapa tidak memakai state management library?

State aplikasi masih terbatas dan dapat dijelaskan dengan signals serta service.
Menambahkan library store pada tahap ini akan menambah abstraksi, boilerplate,
dan biaya pemeliharaan tanpa manfaat yang sebanding. Library tersebut baru
layak dipertimbangkan jika state lintas fitur menjadi jauh lebih kompleks.

### Mengapa service asynchronous belum memakai HTTP API?

Repository ini memakai latency simulasi untuk meniru alur asynchronous dengan
data lokal. Saat API nyata ditambahkan, service dapat menggunakan `HttpClient`
dan Observable. Komponen sebaiknya tetap menggunakan state yang sama agar
perubahan sumber data tidak memaksa perubahan besar pada UI.

### Apakah semua template sudah dipisahkan ke file HTML dan CSS?

Belum. Template masih inline karena proyek ini sedang memprioritaskan eksperimen
alur dan performa. Untuk tim yang mengembangkan fitur besar, pemisahan ke file
`.html` dan `.css` akan lebih nyaman untuk review, linting, dan kolaborasi.

### Mengapa nama komponen tidak mengikuti nama halaman yang panjang?

Nama file dibuat singkat agar mudah dicari dan dirawat. Contohnya
`features/home/home.component.ts` dan `features/property/property.component.ts`.
Nama class dan selector tetap deskriptif agar konteks Angular tidak hilang.

### Apakah OnPush otomatis membuat aplikasi selalu cepat?

Tidak. OnPush hanya mengurangi pemeriksaan perubahan yang tidak perlu. Template
berat, gambar besar, blur, animasi, event handler, dan layout yang kompleks tetap
bisa menurunkan FPS. Karena itu optimasi harus dibuktikan dengan profiling.

## Struktur Proyek

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

## Versi dan Instalasi

Prasyarat:

- Node.js 20 atau lebih baru;
- npm 10 atau lebih baru.

Pasang dependency dan jalankan server pengembangan:

```bash
npm install
npm start
```

Aplikasi tersedia di `http://localhost:4200/`.

Versi utama yang dipakai:

- Angular 22;
- TypeScript 6;
- RxJS 7;
- Tailwind CSS 4;
- Vitest 4.

## Perintah Pengembangan

```bash
npm test
npm run build
npm run watch
```

Build production berada di `dist/houseing-property`.

## Tujuan Portofolio

Proyek ini dibuat untuk menunjukkan cara saya bekerja sebagai Frontend
Engineer, bukan hanya menunjukkan tampilan akhir. Hal yang ingin ditunjukkan
kepada engineer, senior, recruiter, dan HR adalah:

- kemampuan menerjemahkan masalah produk menjadi alur antarmuka;
- pemahaman Angular modern tanpa memaksakan abstraksi;
- pemisahan komponen, service, model, dan fitur;
- perhatian pada responsive layout, aksesibilitas, SEO, dan performa;
- kemampuan menjelaskan trade-off secara jujur;
- kebiasaan memvalidasi perubahan dengan test dan production build.
