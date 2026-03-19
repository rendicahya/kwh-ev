# ⚡ EV Charging Calculator

Kalkulator estimasi energi (kWh), biaya, dan waktu pengisian daya mobil listrik berdasarkan tarif listrik PLN.

🔗 **Live demo:** [https://rendicahya.github.io/kwh-ev](https://rendicahya.github.io/kwh-ev)

## Fitur

- **3 mode kalkulasi** sesuai kebutuhan pengguna
- **Preset model EV** populer di Indonesia — pilih model, kapasitas baterai terisi otomatis
- Visualisasi progress bar baterai secara real-time
- Perhitungan biaya otomatis termasuk **PBJT-TL** (Rp6.660,31 tetap)
- Validasi input otomatis dengan koreksi nilai di luar batas
- Tampilan responsif, ringan, dan dapat diakses dari perangkat apapun

## Mode Kalkulasi

| Mode | Input | Output |
|------|-------|--------|
| 🎯 **Target Baterai** | Target % baterai | Energi (kWh), waktu pengisian, total biaya |
| ⏱️ **Waktu Tersedia** | Jam & menit tersedia | Energi terisi, % baterai akhir, total biaya |
| 💰 **Anggaran** | Budget (Rp) | Energi terisi, waktu pengisian, % baterai akhir, biaya aktual |

## Cara Penggunaan

1. Pilih model EV dari dropdown, atau isi **Kapasitas Baterai EV** secara manual
2. Isi **Data Kendaraan & Tarif** (daya charger, kondisi baterai saat ini, tarif per kWh)
3. Pilih mode kalkulasi dan isi input yang diperlukan
4. Hasil kalkulasi tampil otomatis secara langsung

## Asumsi & Catatan

- Daya _charger_ dianggap konstan selama pengisian berlangsung
- Tidak memperhitungkan efisiensi pengisian (_charging losses_)
- PBJT-TL (Pajak Barang dan Jasa Tertentu atas Tenaga Listrik) sebesar **Rp6.660,31** bersifat tetap
- Pada mode Anggaran, energi dibulatkan ke bawah (_floor_) dan biaya aktual dihitung ulang dari energi tersebut
- Hasil kalkulasi bersifat **estimasi** dan dapat berbeda dengan tagihan aktual