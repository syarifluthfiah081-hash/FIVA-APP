# 🚀 Panduan Deploy GitHub Pages, PWA, & Firebase Console

Panduan lengkap ini menjelaskan cara mempublikasikan **FIVIA (Virtual Lab Fisika & Game Edukasi SMA)** ke **GitHub Pages**, memasangnya sebagai **Aplikasi PWA (Progressive Web App)** di HP/Laptop, dan menghubungkan **Firebase Console** sebagai basis data cloud *real-time*.

---

## 1. 🌐 Cara Deploy ke GitHub (GitHub Pages)

Aplikasi ini sudah dilengkapi dengan *GitHub Actions Workflow* otomatis (`.github/workflows/deploy.yml`).

### Langkah-langkah:
1. **Buka Terminal / Command Prompt** di folder proyek ini:
   ```bash
   git init
   git add .
   git commit -m "feat: setup PWA, Firebase Firestore sync, and GitHub Pages deployment"
   ```
2. **Buat Repository Baru di GitHub**:
   - Buka [github.com/new](https://github.com/new)
   - Beri nama repository (misalnya: `fivia-virtual-lab`)
   - Pilih **Public**
   - Klik **Create repository**
3. **Hubungkan & Push ke GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/fivia-virtual-lab.git
   git push -u origin main
   ```
4. **Aktifkan GitHub Pages**:
   - Di halaman repository GitHub Anda, klik tab **Settings** &rarr; **Pages** (di menu sebelah kiri).
   - Pada bagian **Build and deployment** &rarr; **Source**, pilih **GitHub Actions**.
   - Tunggu 1-2 menit hingga workflow GitHub Actions selesai berjalan di tab **Actions**.
   - Website Anda akan aktif di URL: `https://USERNAME-ANDA.github.io/fivia-virtual-lab/`

---

## 2. 📱 Memasang (Install) sebagai Aplikasi PWA

Aplikasi ini telah memenuhi standar PWA modern (memiliki `manifest.json`, ikon 192x192 & 512x512, dan Service Worker `sw.js` untuk akses **offline**).

### Cara Install di Laptop / PC (Google Chrome & Microsoft Edge):
1. Buka link website Anda di browser Chrome / Edge.
2. Klik tombol **"Install App"** berwarna oranye di pojok kanan atas navbar, atau klik ikon komputer/download di bilah alamat browser (*address bar*).
3. Klik **Install**.
4. FIVIA akan terbuka di jendela aplikasi tersendiri tanpa bilah browser dan muncul di Desktop / Start Menu.

### Cara Install di Android:
1. Buka website di Google Chrome Android.
2. Ketuk tombol **"Install App"** di navbar atau ketuk menu titik tiga (⋮) &rarr; **Tambahkan ke Layar Utama** / **Install Aplikasi**.
3. Aplikasi akan terpasang di layar HP seperti aplikasi native.

### Cara Install di iPhone / iPad (iOS Safari):
1. Buka website di browser **Safari**.
2. Ketuk tombol **Share** (ikon kotak dengan panah ke atas).
3. Gulir ke bawah dan pilih **"Add to Home Screen" (Tambahkan ke Layar Utama)**.

---

## 3. 🔥 Menghubungkan Firebase Console (Cloud Storage / Firestore)

Aplikasi memiliki arsitektur *Offline-First* (bekerja otomatis secara lokal) dan dapat disinkronkan ke **Firebase Cloud Firestore** agar nilai LKPD, hasil kuis, dan data siswa dari berbagai perangkat dapat diakses secara *real-time* oleh Guru.

### Langkah Membuat Proyek Firebase:
1. Buka [Firebase Console](https://console.firebase.google.com/) dan login dengan akun Google.
2. Klik **Add project** (Tambah proyek), beri nama proyek (misalnya `fivia-fisika-lab`), lalu klik **Continue**.
3. Di dashboard Firebase, klik menu **Build** &rarr; **Firestore Database**:
   - Klik **Create database**.
   - Pilih lokasi server terdekat (misal: `asia-southeast2` Jakarta atau `asia-southeast1` Singapura).
   - Pada mode keamanan (*Security Rules*), pilih **Start in test mode** (Mode Uji Coba) agar siswa & guru dapat langsung membaca/menulis data praktikum.
   - Klik **Enable**.
4. Daftarkan Web App di Firebase:
   - Di halaman utama *Project Overview*, klik ikon **Web (`</>`)**.
   - Masukkan nama aplikasi (misal: `FIVIA Web`), lalu klik **Register app**.
   - Anda akan melihat blok konfigurasi JavaScript:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "fivia-fisika-lab.firebaseapp.com",
       projectId: "fivia-fisika-lab",
       storageBucket: "fivia-fisika-lab.appspot.com",
       messagingSenderId: "...",
       appId: "..."
     };
     ```
   - Salin seluruh kode tersebut.

### Langkah Menghubungkan di Aplikasi FIVIA:
1. Buka aplikasi FIVIA di browser Anda.
2. Di navbar pojok kanan atas, klik tombol berlabel **"Local DB"** (dengan ikon database).
3. Tempelkan (*paste*) konfigurasi JSON atau isi `API Key` dan `Project ID` yang Anda salin dari Firebase Console ke dalam kotak yang tersedia.
4. Klik tombol **"Simpan & Hubungkan"**.
5. Tombol status di navbar akan berubah menjadi **"Cloud Terhubung" (Hijau)**.
6. Semua pengiriman LKPD siswa dan nilai kuis sekarang otomatis tersinkronisasi ke Cloud Firestore secara *real-time*!

---

## 🛠️ Struktur File PWA & Firebase yang Dibuat

| Nama File | Deskripsi |
| :--- | :--- |
| [`manifest.json`](./manifest.json) | Metadata PWA (nama, ikon, warna tema, display standalone). |
| [`sw.js`](./sw.js) | Service Worker untuk *caching* aset dan menjalankan lab saat offline. |
| [`icons/`](./icons/) | Ikon resmi FIVIA beresolusi tinggi (192px dan 512px). |
| [`js/firebase-config.js`](./js/firebase-config.js) | Inisialisasi Firebase SDK dan manajemen konfigurasi. |
| [`js/firebase-sync.js`](./js/firebase-sync.js) | Jembatan sinkronisasi data dua arah LocalStorage &harr; Firestore. |
| [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) | Automasi CI/CD deploy ke GitHub Pages. |
