# Chargist ⚡

Kalkulator pengisian daya kendaraan listrik (EV) yang dirancang khusus untuk pasar Indonesia. Aplikasi ini membantu pengguna menghitung konsumsi energi, biaya pengisian daya, dan efisiensi pengisian dengan mempertimbangkan tarif listrik PLN dan spesifikasi kendaraan listrik lokal.

**Live demo:** [https://rendicahya.github.io/kwh-ev](https://rendicahya.github.io/kwh-ev)

## ✨ Fitur Utama

- **Kalkulasi Energi Presisi**: Hitung kebutuhan kWh berdasarkan kapasitas baterai, jarak tempuh, atau konsumsi spesifik
- **Estimasi Biaya Akurat**: Kalkulasi biaya pengisian dengan tarif listrik PLN terkini (termasuk PBJT-TL)
- **Preset Kendaraan**: Database kendaraan listrik Indonesia (Tesla, Hyundai, BYD, Daihatsu, Wuling, dsb.)
- **Preset Charger**: Profil pengisi daya standar (Type 1, Type 2, CCS, CHAdeMO, AC biasa, dsb.)
- **Multiple Lokasi Pengisian**: 
  - **Rumah** (Home): Dengan beban PBJT-TL (10% dari biaya energi)
  - **SPKLU**: Stasiun Pengisian Kendaraan Listrik Umum
- **Efisiensi Pengisian Fleksibel**: Perhitungan efisiensi 85-95% (default 90%)
- **Mode Dual**: Toggle antara mode energi grid vs. energi baterai
- **Responsif & Mobile-Friendly**: Dioptimalkan untuk semua perangkat
- **Bahasa Indonesia**: UI dan dokumentasi dalam bahasa lokal

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Svelte |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v3 |
| **Deployment** | GitHub Pages (`gh-pages`) |
| **Package Manager** | npm |

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm atau yarn

### Langkah-langkah

1. **Clone Repository**
   ```bash
   git clone https://github.com/rendicahya/kwh-ev.git
   cd kwh-ev
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Aplikasi akan tersedia di `http://localhost:5173`

4. **Build untuk Production**
   ```bash
   npm run build
   ```

5. **Deploy ke GitHub Pages**
   ```bash
   npm run deploy
   ```

## 📖 Cara Penggunaan

### Mode Kalkulasi Energi

1. **Pilih Preset Kendaraan** (opsional):
   - Setiap preset akan mengisi kapasitas baterai otomatis
   - Jika Anda input manual, preset akan berubah ke "Custom"

2. **Input Data Pengisian**:
   - **Kapasitas Baterai**: Ukuran baterai dalam kWh (50, 60, 75 kWh, dsb.)
   - **Jarak Tempuh**: Jarak yang akan ditempuh dalam km
   - **Konsumsi Spesifik**: Rata-rata konsumsi per km (kWh/km)

3. **Pilih Lokasi Pengisian**:
   - **Rumah**: Tambahan 10% untuk PBJT-TL (biaya sistem)
   - **SPKLU**: Tanpa tambahan beban sistem

4. **Atur Efisiensi Pengisian** (jika perlu):
   - Default: 90%
   - Range: 85% - 95%
   - Semakin tinggi, semakin efisien

5. **Baca Hasil**:
   - **kWh Grid**: Energi yang diambil dari jaringan listrik
   - **kWh Baterai**: Energi yang masuk ke baterai kendaraan
   - **Biaya Pengisian**: Total biaya dalam Rupiah

### Catatan Penting

- PBJT-TL hanya berlaku saat pengisian di rumah, bukan di SPKLU
- Efisiensi pengisian memengaruhi selisih antara kWh PLN dan kWh baterai
- Mode _toggle_ memungkinkan Anda melihat perspektif energi dari kedua sisi

## ⚙️ Tarif Listrik PLN

Tarif didasarkan pada **Peraturan Menteri ESDM** terkini untuk:
- Daya normal (PLN standar)
- Tarif PBJT-TL (Pajak Barang dan Jasa Tertentu atas Tenaga Listrik) = 10% dari biaya energi

> ⚠️ Tarif dapat berubah. Selalu verifikasi dengan [PLN.co.id](https://pln.co.id) untuk informasi terkini.

## 🔧 Development

### Scripts Tersedia

```bash
# Development server dengan hot reload
npm run dev

# Build production
npm run build

# Preview build lokal
npm run preview

# Deploy ke gh-pages
npm run deploy

# Lint & format (jika dikonfigurasi)
npm run lint
```

### Catatan Konfigurasi

⚠️ **Tailwind CSS**: Proyek ini menggunakan **v3**, bukan v4. Jika Anda menjalankan `npx tailwindcss init -p`, verifikasi versioning di `package.json`.

---

## 🧪 Testing

Panduan testing (jika ada automated tests):

```bash
npm run test      # Jalankan semua test
npm run test:ui   # UI test runner
```

> Saat ini, testing dilakukan secara manual. Kontribusi untuk test automation sangat diterima!

## 🌙 Fitur Mendatang (Roadmap)

- [ ] **Dark Mode**: Tema gelap untuk kenyamanan malam
- [ ] **PWA Support**: Aplikasi web progresif untuk offline access
- [ ] **Riwayat Pengisian**: Tracking history pengisian daya
- [ ] **Multiple Currency**: Dukungan mata uang lain
- [ ] **Export/Import**: Simpan dan bagikan konfigurasi
- [ ] **Flutter Mobile App**: Native app untuk Android & iOS

## 🤝 Kontribusi

Kami sangat terbuka terhadap kontribusi! Silakan:

1. **Fork** repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka **Pull Request**

### Panduan Kontribusi

- Pastikan kode mengikuti style existing
- Update dokumentasi jika menambah fitur baru
- Verifikasi data akurasi (terutama spesifikasi EV dan tarif)
- Test di berbagai ukuran layar sebelum submit PR

## 📝 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — lihat file [LICENSE](LICENSE) untuk detail.

## 💡 Tips & Tricks

### Kalkulasi Manual
Jika Anda ingin menghitung tanpa aplikasi:

```
kWh Grid = Kapasitas Baterai ÷ Efisiensi Pengisian (default 90%)
Biaya = kWh Grid × Tarif PLN + (kWh Grid × Tarif PLN × 10%) [jika di Rumah]
```

### Referensi Konsumsi EV
- **Sedan Elektrik** (Tesla Model 3, Hyundai Ioniq): ~0.12-0.15 kWh/km
- **SUV Elektrik** (Tesla Model Y, BYD Yuan Plus): ~0.15-0.18 kWh/km
- **City Car** (Wuling HongGuang Mini): ~0.08-0.10 kWh/km

## 🐛 Melaporkan Bug

Temukan bug? Buka [Issue](https://github.com/rendicahya/kwh-ev/issues) dengan:
- Deskripsi jelas tentang masalah
- Steps untuk mereproduksi
- Screenshot/video jika relevan
- Browser & OS yang digunakan

## 📧 Kontak & Support

- **Issues & Features**: [GitHub Issues](https://github.com/rendicahya/kwh-ev/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rendicahya/kwh-ev/discussions)
- **Email**: rendicahya@example.com (ganti dengan email Anda)

## 🙏 Acknowledgments

- **PLN** (Perusahaan Listrik Negara) — Data tarif listrik
- **Gaikindo** — Data penjualan dan spesifikasi kendaraan
- **Svelte & Vite Community** — Framework dan tooling terbaik
- **Tailwind CSS** — Utility-first CSS framework
- Semua kontributor yang telah membantu! 

**Dibuat dengan ❤️ untuk komunitas EV Indonesia**

Terakhir di-_update_: 9 April 2026