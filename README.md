HouseING Property

HouseING Property adalah project frontend yang saya kembangkan untuk mencoba membuat pengalaman mencari properti dalam satu alur yang sederhana.

Saya ingin pengguna tidak hanya melihat daftar rumah, tetapi juga bisa memilih properti yang menarik, melihat detailnya, membandingkannya dengan pilihan lain, dan melihat perkiraan cicilan sebelum menentukan pilihan.

Dari ide tersebut, saya membuat beberapa bagian utama seperti property discovery, filter, detail properti, favorit, comparison, dan simulator KPR.

Project ini menggunakan data mock dan belum ditujukan sebagai marketplace properti. Fokus saya adalah membangun pengalaman pengguna dan mencoba menerapkan Angular pada aplikasi yang memiliki beberapa fitur dan state yang saling berhubungan.

Fitur

- Mencari dan memfilter properti.
- Melihat detail properti.
- Menyimpan properti favorit.
- Membandingkan beberapa properti.
- Menghitung estimasi cicilan KPR.
- Responsive untuk desktop dan mobile.

Pendekatan

Saya menggunakan Angular dan TypeScript untuk membangun aplikasi ini.

Setiap fitur dibuat sebagai bagian yang terpisah agar lebih mudah dikembangkan. Data dan logic yang digunakan bersama dikelola melalui service, sedangkan komponen menangani tampilan dan interaksi pengguna.

Teknologi utama:

- Angular
- TypeScript
- RxJS
- Angular Signals
- Tailwind CSS
- Vitest

Tentang Project

HouseING Property saya buat sebagai bagian dari portfolio untuk memperdalam Angular sekaligus mencoba menerapkan cara berpikir yang biasa saya gunakan ketika membuat aplikasi web: mulai dari menentukan alur yang ingin dibuat, membagi fitur, kemudian membangun dan menguji setiap bagiannya.

Project ini masih dapat dikembangkan lebih lanjut, terutama jika nantinya menggunakan API dan data properti nyata.

Menjalankan Project

Pastikan Node.js 20 atau versi yang lebih baru sudah terpasang.

npm install
npm start

Buka "http://localhost:4200/" pada browser.

Untuk menjalankan test:

npm test

Untuk membuat production build:

npm run build