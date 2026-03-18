<script>
  // --- Inputs ---
  let batteryCapacity = 60;       // kWh
  let currentSoc = 40;            // %
  let targetSoc = 80;             // %
  let tariffPerKwh = 2466.78;     // Rp/kWh
  let chargerPower = 7.7;         // kW

  // --- Constants ---
  const PBJT_TL = 6660.31;        // Rp (fixed)

  // --- Derived ---
  $: energyNeeded = ((targetSoc - currentSoc) / 100) * batteryCapacity;
  $: energyNeeded = Math.max(0, energyNeeded);

  $: chargingTime = chargerPower > 0 ? energyNeeded / chargerPower : 0;
  $: chargingHours = Math.floor(chargingTime);
  $: chargingMinutes = Math.round((chargingTime - chargingHours) * 60);

  $: energyCost = energyNeeded * tariffPerKwh;
  $: totalCost = energyCost + PBJT_TL;

  // Format Rupiah
  function formatRupiah(val) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(val);
  }

  // SOC validation
  $: socError = targetSoc <= currentSoc ? "Target harus lebih besar dari baterai saat ini." : "";
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 font-sans">

  <!-- Header -->
  <header class="bg-white/80 backdrop-blur border-b border-emerald-100 shadow-sm sticky top-0 z-10">
    <div class="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
      <div class="bg-emerald-500 text-white rounded-xl p-2 shadow">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-slate-800 leading-tight">EV Charging Calculator</h1>
        <p class="text-xs text-slate-400">Hitung biaya & waktu pengisian daya</p>
      </div>
    </div>
  </header>

  <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">

    <!-- Input Card -->
    <div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
      <div class="bg-emerald-500 px-6 py-4">
        <h2 class="text-white font-semibold text-base tracking-wide">⚙️ Parameter Pengisian</h2>
      </div>
      <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

        <!-- Kapasitas Baterai -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kapasitas Baterai</label>
          <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
            <input type="number" bind:value={batteryCapacity} min="1"
              class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kWh</span>
          </div>
        </div>

        <!-- Charger Power -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daya Charger</label>
          <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
            <input type="number" bind:value={chargerPower} min="0.1" step="0.1"
              class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kW</span>
          </div>
        </div>

        <!-- SOC Sekarang -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">SOC Saat Ini</label>
          <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
            <input type="number" bind:value={currentSoc} min="0" max="100"
              class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">%</span>
          </div>
        </div>

        <!-- SOC Target -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">SOC Target</label>
          <div class="flex items-center border {socError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
            <input type="number" bind:value={targetSoc} min="0" max="100"
              class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">%</span>
          </div>
          {#if socError}
            <p class="text-xs text-red-500 mt-0.5">{socError}</p>
          {/if}
        </div>

        <!-- Tarif per kWh -->
        <div class="flex flex-col gap-1 sm:col-span-2">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarif per kWh</label>
          <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-r border-slate-200">Rp</span>
            <input type="number" bind:value={tariffPerKwh} min="0" step="0.01"
              class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">/kWh</span>
          </div>
        </div>

      </div>

      <!-- SOC Progress Bar -->
      <div class="px-6 pb-6">
        <div class="flex justify-between text-xs text-slate-400 mb-1">
          <span>0%</span>
          <span class="font-semibold text-emerald-600">{currentSoc}% → {targetSoc}%</span>
          <span>100%</span>
        </div>
        <div class="relative h-4 bg-slate-100 rounded-full overflow-hidden">
          <!-- Current SOC -->
          <div class="absolute top-0 left-0 h-full bg-slate-300 rounded-full transition-all duration-300"
            style="width: {Math.min(currentSoc, 100)}%"></div>
          <!-- Charge range -->
          <div class="absolute top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
            style="left: {Math.min(currentSoc, 100)}%; width: {Math.max(0, Math.min(targetSoc, 100) - Math.min(currentSoc, 100))}%">
          </div>
        </div>
        <p class="text-xs text-slate-400 mt-1 text-center">Segmen hijau = energi yang akan diisi</p>
      </div>
    </div>

    {#if !socError && energyNeeded > 0}
    <!-- Result Card -->
    <div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
      <div class="bg-slate-800 px-6 py-4">
        <h2 class="text-white font-semibold text-base tracking-wide">📊 Hasil Kalkulasi</h2>
      </div>
      <div class="p-6 space-y-4">

        <!-- Energy Needed -->
        <div class="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="bg-emerald-100 text-emerald-600 rounded-lg p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Energi Dibutuhkan</p>
              <p class="text-xl font-bold text-slate-800">{energyNeeded.toFixed(2)} <span class="text-sm font-normal text-slate-500">kWh</span></p>
            </div>
          </div>
        </div>

        <!-- Charging Time -->
        <div class="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 text-blue-600 rounded-lg p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Waktu Pengisian</p>
              <p class="text-xl font-bold text-slate-800">
                {chargingHours > 0 ? `${chargingHours} jam` : ''}
                {chargingMinutes > 0 ? ` ${chargingMinutes} menit` : ''}
                {chargingHours === 0 && chargingMinutes === 0 ? '< 1 menit' : ''}
              </p>
            </div>
          </div>
        </div>

        <!-- Cost Breakdown -->
        <div class="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 space-y-3">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rincian Biaya</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600">Biaya Energi ({energyNeeded.toFixed(2)} kWh × {formatRupiah(tariffPerKwh)})</span>
            <span class="text-sm font-semibold text-slate-700">{formatRupiah(energyCost)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600">PBJT-TL (tetap)</span>
            <span class="text-sm font-semibold text-slate-700">{formatRupiah(PBJT_TL)}</span>
          </div>
          <div class="border-t border-slate-200 pt-3 flex justify-between items-center">
            <span class="text-sm font-bold text-slate-800">Total Biaya</span>
            <span class="text-xl font-extrabold text-emerald-600">{formatRupiah(totalCost)}</span>
          </div>
        </div>

      </div>
    </div>
    {/if}

    <!-- Footer -->
    <p class="text-center text-xs text-slate-400 pb-4">
      Tarif dasar PLN · PBJT-TL Rp6.660,31 (tetap) · Data bersifat estimasi
    </p>

  </main>
</div>