# ⚡ EV Charging Calculator

Kalkulator estimasi energi (kWh), biaya, dan waktu pengisian daya mobil listrik berdasarkan tarif listrik PLN.

🔗 **Live demo:** [https://rendicahya.github.io/kwh-ev](https://rendicahya.github.io/kwh-ev)

## Fitur

- **Mode Target Baterai** — masukkan persentase baterai yang diinginkan, dapatkan estimasi energi yang dibutuhkan, waktu pengisian, dan total biaya
- **Mode Waktu Tersedia** — masukkan waktu yang dimiliki untuk mengisi daya, dapatkan estimasi energi yang terisi dan persentase baterai akhir
- Visualisasi progress bar baterai secara real-time
- Perhitungan biaya otomatis termasuk **PBJT-TL** (Rp6.660,31 tetap)
- Tampilan responsif, ringan, dan dapat diakses dari perangkat apapun

## Cara Penggunaan

1. Isi **Data Kendaraan & Tarif** (kapasitas baterai EV, daya charger, kondisi baterai saat ini, tarif per kWh)
2. Pilih mode kalkulasi:
   - 🎯 **Target Baterai** — tentukan target persentase baterai
   - ⏱️ **Waktu Tersedia** — tentukan berapa jam/menit waktu yang tersedia
3. Hasil kalkulasi tampil otomatis secara langsung

## Asumsi & Catatan

- Daya charger dianggap konstan selama pengisian berlangsung
- Tidak memperhitungkan efisiensi pengisian (charging losses)
- Tarif default mengacu pada tarif dasar listrik PLN untuk daya di atas 3.500 VA (per 2024)
- PBJT-TL (Pajak Barang dan Jasa Tertentu atas Tenaga Listrik) sebesar **Rp6.660,31** bersifat tetap
- Hasil kalkulasi bersifat **estimasi** dan dapat berbeda dengan tagihan aktual