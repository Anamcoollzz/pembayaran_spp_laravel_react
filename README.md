# 🎓 SPP Online — Sistem Informasi Pembayaran SPP Sekolah

Aplikasi web modern untuk manajemen administrasi dan transaksi pembayaran SPP (Sumbangan Pembinaan Pendidikan) sekolah. Dibangun menggunakan **Laravel 12**, **Inertia.js React v3**, **TypeScript**, **Tailwind CSS v4**, dan komponen **shadcn/ui**.

---

## ✨ Fitur Utama

- 📊 **Dashboard Interaktif**: Rekapitulasi penerimaan SPP bulan ini, total tahun berjalan, jumlah siswa, kelas, dan riwayat transaksi terkini.
- 🏫 **Master Data Kelas**: Manajemen rombongan belajar (Tingkat X, XI, XII), jurusan/kompetensi keahlian, dan statistik jumlah siswa per kelas.
- 🏷️ **Master Tarif SPP**: Pengaturan besaran nominal SPP bulanan per tahun ajaran/angkatan.
- 👥 **Master Data Siswa**: Pengelolaan data murid (NISN, NIS, Nama, Kelas, Tarif SPP, No. HP, Alamat) dan **visualisasi status pelunasan 12 bulan**.
- 💳 **Transaksi Pembayaran Fleksibel**:
  - Deteksi otomatis bulan yang belum dibayar.
  - Dukungan pembayaran satu atau banyak bulan sekaligus (*multi-month checkout*).
  - Pilihan metode bayar: **Tunai (Cash di TU)**, **Transfer Bank**, atau **QRIS**.
- 🧾 **Kwitansi Resmi Siap Cetak**: Modal bukti pembayaran SPP berformat standar yang langsung terhubung ke printer/PDF (`window.print()`).
- 🔐 **Keamanan & Autentikasi**: Terintegrasi dengan Laravel Fortify, Two-Factor Authentication (2FA), dan Passkeys (WebAuthn / Biometrik).

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Laravel 12, PHP 8.3, Laravel Fortify, Wayfinder
- **Frontend**: React 19, Inertia.js v3, TypeScript
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Lucide Icons, Sonner (Toaster)
- **Database**: SQLite (default) / MySQL / PostgreSQL
- **Testing**: Pest PHP Testing Framework (60 automated feature tests)

---

## 📋 Prasyarat Sistem

Pastikan perangkat Anda telah terpasang:
1. **PHP >= 8.2** (disarankan PHP 8.3) dengan ekstensi `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `sqlite3` / `pdo_sqlite`.
2. **Composer** (Package manager PHP).
3. **Node.js >= 18.x** dan **NPM**.

---

## 🚀 Panduan Instalasi

Ikuti langkah-langkah berikut untuk menginstal aplikasi di komputer lokal:

### 1. Masuk ke Direktori Proyek
```bash
cd laravel_react
```

### 2. Instal Dependensi Backend (Composer)
```bash
composer install
```

### 3. Instal Dependensi Frontend (NPM)
```bash
npm install
```

### 4. Konfigurasi Lingkungan (`.env`)
Salin file konfigurasi `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Lalu buat kunci aplikasi:
```bash
php artisan key:generate
```

### 5. Migrasi Database & Seeder Data Awal
Jalankan migrasi tabel beserta data demo (*dummy data* kelas, tarif SPP, siswa, dan transaksi awal):
```bash
php artisan migrate --seed
```

### 6. Build Aset Frontend
```bash
npm run build
```

---

## 💻 Cara Menjalankan Aplikasi

Anda dapat menjalankan aplikasi menggunakan salah satu cara di bawah ini:

### Cara 1: Menggunakan Script Terpadu (Direkomendasikan)
```bash
composer run dev
```
*Perintah ini akan menjalankan server PHP dan Vite frontend watcher secara bersamaan.*

### Cara 2: Menjalankan Secara Terpisah (2 Terminal)
- **Terminal 1** (Server Laravel):
  ```bash
  php artisan serve
  ```
- **Terminal 2** (Vite Dev Server):
  ```bash
  npm run dev
  ```

Buka browser dan akses aplikasi melalui: **[http://localhost:8000](http://localhost:8000)**

---

## 🔑 Akun Demo / Default Login

Gunakan akun berikut untuk masuk ke dashboard sistem:

| Peran | Email | Password |
| :--- | :--- | :--- |
| **Petugas TU / Admin** | `admin@spp.com` | `password` |
| **User Tester** | `test@example.com` | `password` |

---

## 📖 Alur Kerja & Cara Penggunaan

1. **Atur Tarif SPP**:
   Buka menu **Tarif SPP** $\rightarrow$ Tambahkan nominal tarif SPP bulanan untuk tahun ajaran aktif (misal: Tahun `2026`, Nominal `Rp 250.000`).
2. **Kelola Kelas**:
   Buka menu **Master Kelas** $\rightarrow$ Tambah kelas baru dengan tingkat (X, XI, XII) dan jurusan (misal: `X RPL 1`).
3. **Input Data Siswa**:
   Buka menu **Master Siswa** $\rightarrow$ Daftarkan siswa dengan NISN, nama, kelas, dan pilih tarif SPP angkatannya.
4. **Proses Pembayaran SPP**:
   - Buka menu **Entri Pembayaran** (atau klik ikon bayar pada baris siswa).
   - Pilih nama siswa $\rightarrow$ Sistem akan otomatis menampilkan tarif dan status 12 bulan.
   - Centang bulan-bulan yang ingin dibayar.
   - Pilih metode pembayaran (*Tunai/Transfer/QRIS*) lalu klik **Proses Pembayaran SPP**.
5. **Cetak Bukti Pembayaran (Kwitansi)**:
   - Buka menu **Transaksi SPP** $\rightarrow$ Klik ikon **Printer** pada baris transaksi.
   - Modal kwitansi resmi akan terbuka $\rightarrow$ Klik **Cetak Kwitansi** untuk mencetak langsung ke kertas atau simpan sebagai PDF.

---

## 🧪 Menjalankan Automated Testing

Proyek ini telah dilengkapi 60 test otomatis menggunakan **Pest PHP**:
```bash
php artisan test --compact
```

Untuk memeriksa tipe data TypeScript:
```bash
npm run types:check
```

---

## 📄 Lisensi

Proyek ini dikembangkan dengan lisensi [MIT](LICENSE).
