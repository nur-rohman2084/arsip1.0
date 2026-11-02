# 🏛️ Archive Academy — Full-Stack Gamified Learning Platform

**Archive Academy** adalah website pembelajaran gamifikasi kearsipan untuk siswa SMK Manajemen Perkantoran dan Layanan Bisnis (MPLB). Aplikasi ini dirancang full-stack dengan frontend modern berbasis React, backend Express.js REST API yang tangguh, serta basis data SQLite terintegrasi yang menyimpan data secara persisten.

---

## 🚀 Fitur Utama

### 🎓 1. Portal Siswa (*Student Portal*)
- **Landing Page Interaktif**: Pengenalan platform, hero section, kartu fitur, modal Tentang, dan FAQ interaktif.
- **Autentikasi Siswa**: Masuk menggunakan Nama Siswa dan Kode Kelas (`ARSIP-7A26` / `071089`).
- **Avatar Studio**: Kustomisasi avatar modular (warna kulit, pakaian, rambut, aksesoris) dengan penyimpanan persisten ke database.
- **Beranda Siswa**: Kartu statistik XP, badge, progres belajar, target harian, dan ringkasan misi kearsipan.
- **Peta Belajar & Peta Lane (8 Turret)**:
  - Peta visual lane dengan kurva jalur dinamis dan 8 menara turret kearsipan.
  - Pengontrol arah D-pad interaktif (Atas, Bawah, Kiri, Kanan).
  - Indikator status turret aktif vs terkunci.
- **Modul Pembelajaran Kearsipan**:
  - Rangkuman materi komprehensif Hakikat Kearsipan (UU No. 43/2009, warkat, dokumen, arsip dinamis, arsip statis).
- **Kuis Berwaktu & Studi Kasus Real-World**:
  - Pilihan ganda dengan *countdown timer* per soal dan *real-time feedback*.
  - Studi kasus esai (analisis tata kelola surat PT Maju Bersama) dengan validasi minimal 30 karakter.
- **Kelulusan, Leaderboard & Sertifikat Digital**:
  - Rekap perolehan skor, EXP, dan penganugerahan lencana baru (*Penjelajah Arsip*).
  - Papan peringkat kelas dinamis (*Leaderboard*).
  - Sertifikat resmi dengan nomor seri unik, nama siswa, skor, dan validasi guru yang siap dicetak langsung atau disimpan sebagai PDF.
- **Koleksi Badge & Pencapaian**:
  - Galeri badge (*Rising Star, Top Student, Knowledge Seeker, Speed Learner, Ultimate Winner*).
  - Grafik lingkaran SVG progres ketuntasan (72%).

---

### 👩‍🏫 2. Dashboard Guru (*Teacher Portal*)
- **Autentikasi Guru**: Masuk menggunakan akun pengajar (`rina.guru` / `123456`).
- **Beranda Guru**:
  - Statistik kelas: Total Siswa (32), Selesai Belajar (28), Rata-rata Nilai (87.5), Tingkat Penyelesaian (87%).
  - Grafik garis interaktif performa mingguan (Rata-rata Nilai vs Penyelesaian).
  - Daftar kelas aktif (*XI MPLB 1, XI MPLB 2, XI MPLB 3*).
  - Agenda kegiatan mengajar & aksi cepat.
- **Kelola Turret (8 Turret Kearsipan)**:
  - Pencarian dan filter status aktif/nonaktif.
  - Toggle aktivasi turret secara langsung yang sinkron dengan akses siswa di peta lane.
  - Modal pengeditan deskripsi materi, durasi pengerjaan, dan tingkat kesulitan turret.
- **Data Siswa & Manajemen Kelas**:
  - Tabel siswa lengkap dengan pencarian nama/NIS, filter status, dan pagination.
  - Tambah Siswa Baru secara manual.
  - Edit & Hapus Siswa secara langsung di database.
  - **Impor Siswa Massal via CSV** (mendukung unggah file `.csv` dengan header: `nis,nama,kelas,nilai,progres,status`).
  - **Ekspor Data Siswa ke CSV / Excel**.
  - Panel detail siswa dengan inisial avatar, lencana yang diperoleh, dan riwayat aktivitas.
- **Laporan & Rekapitulasi Nilai**:
  - Filter periode, kelas, jenis laporan, dan turret.
  - Grafik perkembangan 7 hari terakhir.
  - **Unduh Laporan Nyata (CSV / Excel)**:
    - *Laporan Nilai Siswa*
    - *Laporan Progres Kelas*
    - *Laporan Aktivitas Turret*
    - *Rekap Hasil Belajar*
- **Pengaturan Akun & Preferensi**:
  - Profil guru: Nama lengkap, username, email, instansi sekolah.
  - Preferensi mengajar: Kelas utama, mata pelajaran, Nilai Ketuntasan Minimum (KKM: 75), dan opsi *auto-unlock turret*.
  - Preferensi notifikasi & keamanan akun (2FA).

---

## 🛠️ Arsitektur & Teknologi

- **Frontend**:
  - React 18 + Vite
  - Tailwind CSS 3 (Kustomisasi tema warna `#07122f`, `#ffc82c`, `#14449a`)
  - Tipografi Google Fonts: *Lilita One* & *Plus Jakarta Sans*
  - Context API (`AuthContext`, `ToastContext`)
  - Single Page Application (SPA) responsif (Desktop, Tablet, Mobile)
- **Backend**:
  - Node.js + Express.js
  - RESTful API Architecture (Routes, Controllers, Middleware, Services)
  - JWT Authentication & RBAC (`siswa` dan `guru`)
  - Multer + CSV-Parser (File Upload & Import CSV)
- **Basis Data**:
  - SQLite (Native `node:sqlite`, *zero-config*, persisten di `server/data/archive_academy.db`)
  - Skema relasional lengkap dengan *Foreign Keys* dan *Cascade Delete*
  - Seeder otomatis mencakup 8 turret, soal kearsipan, studi kasus, siswa awal, kelas, jadwal, dan badge

---

## 📂 Struktur Direktori Proyek

```
Folder Baru (4)/
├── client/                     # Frontend React + Vite
│   ├── public/
│   │   └── avatar-assets/      # Asset gambar avatar modular
│   ├── src/
│   │   ├── assets/             # Gambar base64, icon SVG, konstanta
│   │   ├── components/         # Komponen reusable (Header, Sidebar, Button, dll)
│   │   ├── context/            # AuthContext & ToastContext
│   │   ├── pages/
│   │   │   ├── student/        # Halaman-halaman Siswa (Home, Map, Lane, Quiz, dll)
│   │   │   ├── teacher/        # Halaman-halaman Guru (Home, Turrets, Students, dll)
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   └── AvatarStudio.jsx
│   │   ├── services/           # API Client Service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                     # Backend Express REST API
│   ├── data/
│   │   ├── archive_academy.db  # Database SQLite persisten
│   │   └── students_seed.csv   # Template CSV data siswa
│   ├── src/
│   │   ├── db/                 # Database schema & seeder
│   │   ├── middleware/         # JWT Auth & Role-based Access Control
│   │   ├── routes/             # Endpoint Auth, Turrets, Students, Teacher
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── package.json                # Root scripts
├── test_integration.js         # Suite pengujian integrasi end-to-end
└── README.md                   # Dokumentasi proyek
```

---

## 💻 Panduan Menjalankan Aplikasi Secara Lokal

### Prasyarat
- **Node.js**: Versi 20+ (Direkomendasikan Node.js 22 atau 24)
- **NPM**: Versi 10+

### 1. Instalasi Dependensi
Jalankan perintah berikut di root folder proyek:
```bash
# Instal dependensi backend server
npm --prefix server install

# Instal dependensi frontend client
npm --prefix client install
```

### 2. Inisialisasi & Seeding Database
Untuk mengisi database SQLite dengan data awal (8 turret, bank soal, studi kasus, siswa, kelas, jadwal):
```bash
node server/src/db/seed.js
```

### 3. Menjalankan Aplikasi

#### Opsi A: Mode Produksi Terintegrasi (Direkomendasikan)
Bangun frontend dan jalankan server Express yang langsung menyajikan antarmuka web dan API di port 5000:
```bash
# 1. Build frontend client
npm --prefix client run build

# 2. Jalankan server
node server/src/server.js
```
Akses aplikasi melalui browser di: **`http://localhost:5000`**

#### Opsi B: Mode Pengembangan (Live Reload / HMR)
Jalankan backend dan frontend dev server secara bersamaan:
```bash
# Terminal 1: Backend API (Port 5000)
npm --prefix server run dev

# Terminal 2: Frontend Vite (Port 3000 dengan API Proxy otomatis)
npm --prefix client run dev
```
Akses aplikasi melalui browser di: **`http://localhost:3000`**

---

## 🔑 Kredensial Akun Contoh

| Peran (*Role*) | Username / Nama | Password / Kode Kelas | Keterangan |
|---|---|---|---|
| **Siswa** | `Roselia Paras Wangi` | `071089` atau `ARSIP-7A26` | Siswa aktif Kelas XI MPLB 1 |
| **Siswa Baru** | Nama Siswa Bebas | `ARSIP-7A26` | Otomatis terdaftar ke kelas |
| **Guru** | `rina.guru` | `123456` | Pengajar & Wali Kelas XI MPLB |

---

## 🧪 Menjalankan Pengujian (Integration Testing)

Tersedia file uji otomatis yang menguji seluruh endpoint REST API dan operasi database secara nyata:
```bash
node test_integration.js
```
Hasil pengujian mencakup 17 pengujian end-to-end (Autentikasi Siswa/Guru, Kustomisasi Avatar, Modul Kuis, Kalkulasi Nilai, Leaderboard, Sertifikat, Manajemen Turret, CRUD Siswa, Ekspor CSV, dan Pengaturan Guru).

---

## 🌐 Panduan Publikasi / Deployment

1. **Environment Variables**:
   Salin file `server/.env.example` ke `server/.env` dan atur:
   ```env
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=rahasia_jwt_produksi_anda
   ```
2. **Build Frontend**:
   ```bash
   npm --prefix client run build
   ```
   Folder `client/dist` akan dibuat secara otomatis dan langsung disajikan oleh server Express.
3. **Deploy ke VPS / Railway / Render / DigitalOcean**:
   - Jalankan `npm --prefix server install --production`
   - Pastikan direktori `server/data` memiliki izin baca/tulis (*read-write permission*) agar file SQLite `archive_academy.db` dapat menyimpan data secara persisten.
   - Jalankan `node server/src/server.js` atau gunakan process manager seperti PM2:
     ```bash
     pm2 start server/src/server.js --name "archive-academy"
     ```
"# arsip1.0" 
