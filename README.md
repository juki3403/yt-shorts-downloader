# YT Shorts Downloader

Next.js app sederhana untuk download video YouTube Shorts (atau video biasa) jadi MP4.
Didesain untuk deploy ke **Vercel**.

---

## 1. Jalankan lokal (opsional)

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

---

## 2. Deploy ke Vercel

```bash
npm install -g vercel   # kalau belum ada
vercel login
vercel                  # deploy pertama kali
vercel --prod           # deploy ke production
```

Atau lebih gampang: push project ini ke GitHub, lalu import repo-nya di
https://vercel.com/new — tidak perlu setting environment variable apapun untuk fitur ini.

---

## Cara kerja

- `/download` → tempel link YouTube Shorts → server ambil videonya memakai `youtubei.js` → langsung ke-download ke browser sebagai MP4
- Tidak ada file yang disimpan di server, semua di-stream langsung ke browser

---

## Batasan & catatan penting

- **Durasi video**: serverless function Vercel punya batas waktu eksekusi (`maxDuration: 60` detik di sini). Cocok untuk video pendek seperti Shorts, video panjang berisiko timeout.
- **`youtubei.js`** kadang perlu di-update kalau YouTube mengubah sistem internalnya. Kalau tiba-tiba semua download gagal, coba update dependency.
- **Legal**: pastikan kamu punya hak untuk mengunduh video tersebut (video milik sendiri, izin eksplisit, atau lisensi yang mengizinkan). Mengunduh konten berhak cipta orang lain tanpa izin bisa melanggar Terms of Service YouTube maupun hukum hak cipta.

---

## Struktur project

```
app/
  page.js                → halaman home
  download/page.js       → UI download YouTube
  api/download/route.js  → API: download video YouTube
lib/
  youtube.js             → helper ambil info & format video YouTube
```
