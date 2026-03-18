<script>
  // --- Tab ---
  let activeTab = 'target'; // 'target' | 'time'

  // --- Shared Inputs ---
  let batteryCapacity = 60;
  let currentBattery = 40;
  let tariffPerKwh = 2466.78;
  let chargerPower = 7.7;

  // --- Mode 1: Target Baterai ---
  let targetBattery = 80;

  // --- Mode 2: Waktu Charge ---
  let availableHours = 1;
  let availableMinutes = 0;

  // --- Constants ---
  const PBJT_TL = 6660.31;

  // --- Mode 1 Derived ---
  $: energyNeeded = Math.max(0, ((targetBattery - currentBattery) / 100) * batteryCapacity);
  $: chargingTime = chargerPower > 0 ? energyNeeded / chargerPower : 0;
  $: chargingHours = Math.floor(chargingTime);
  $: chargingMinutes = Math.round((chargingTime - chargingHours) * 60);
  $: energyCost = energyNeeded * tariffPerKwh;
  $: totalCost = energyCost + PBJT_TL;

  // --- Mode 2 Derived ---
  $: availableTimeHours = availableHours + availableMinutes / 60;
  $: energyFromTime = Math.min(chargerPower * availableTimeHours, batteryCapacity * (1 - currentBattery / 100));
  $: batteryGained = batteryCapacity > 0 ? (energyFromTime / batteryCapacity) * 100 : 0;
  $: finalBattery = Math.min(100, currentBattery + batteryGained);
  $: energyCost2 = energyFromTime * tariffPerKwh;
  $: totalCost2 = energyCost2 + PBJT_TL;

  // --- Validation ---
  $: socError = targetBattery <= currentBattery ? "Target harus lebih besar dari baterai saat ini." : "";
  $: timeError = (availableHours === 0 && availableMinutes === 0) ? "Masukkan waktu yang tersedia." : "";

  function formatRupiah(val) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(val);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 font-sans">

  <!-- Header -->
  <header class="bg-white/80 backdrop-blur border-b border-emerald-100 shadow-sm sticky top-0 z-10">
    <div class="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
      <div class="bg-emerald-500 text-white rounded-xl p-2 shadow">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-slate-800 leading-tight">EV Charging Calculator</h1>
        <p class="text-xs text-slate-400">Hitung biaya & waktu pengisian daya</p>
      </div>
    </div>
  </header>

  <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">

  <!-- Card 1: Input Bersama -->
  <div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
    <div class="bg-emerald-500 px-6 py-4">
      <h2 class="text-white font-semibold text-base tracking-wide">🚗 Data Kendaraan & Tarif</h2>
    </div>
    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

      <div class="flex flex-col gap-1">
        <label for="batteryCapacity" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kapasitas Baterai EV</label>
        <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="batteryCapacity" type="number" bind:value={batteryCapacity} min="1"
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kWh</span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label for="chargerPower" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daya Charger</label>
        <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="chargerPower" type="number" bind:value={chargerPower} min="0.1" step="0.1"
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kW</span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label for="currentBattery" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Baterai Saat Ini</label>
        <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="currentBattery" type="number" bind:value={currentBattery} min="0" max="100"
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">%</span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label for="tariffPerKwh" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarif per kWh</label>
        <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-r border-slate-200">Rp</span>
          <input id="tariffPerKwh" type="number" bind:value={tariffPerKwh} min="0" step="0.01"
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">/kWh</span>
        </div>
      </div>

    </div>
  </div>

  <!-- Tab Switcher -->
  <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-2 flex gap-2">
    <button
      class="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200
        {activeTab === 'target' ? 'bg-emerald-500 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}"
      on:click={() => activeTab = 'target'}>
      🎯 Target Baterai
    </button>
    <button
      class="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200
        {activeTab === 'time' ? 'bg-emerald-500 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}"
      on:click={() => activeTab = 'time'}>
      ⏱️ Waktu Tersedia
    </button>
  </div>

  <!-- Card 2: Input Spesifik + Hasil -->
  <div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
    <div class="bg-slate-800 px-6 py-4">
      <h2 class="text-white font-semibold text-base tracking-wide">
        {activeTab === 'target' ? '🎯 Mode Target Baterai' : '⏱️ Mode Waktu Tersedia'}
      </h2>
    </div>
    <div class="p-6 space-y-5">

      <!-- Input Mode 1 -->
      {#if activeTab === 'target'}
      <div class="flex flex-col gap-1">
        <label for="targetBattery" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Baterai Target</label>
        <div class="flex items-center border {socError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="targetBattery" type="number" bind:value={targetBattery} min="0" max="100"
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">%</span>
        </div>
        {#if socError}<p class="text-xs text-red-500 mt-0.5">{socError}</p>{/if}
      </div>
      {/if}

      <!-- Input Mode 2 -->
      {#if activeTab === 'time'}
      <div class="flex flex-col gap-1">
        <label for="availableHours" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu Tersedia</label>
        <div class="flex gap-3">
          <div class="flex items-center border {timeError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50 flex-1">
            <input id="availableHours" type="number" bind:value={availableHours} min="0" max="24"
              class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">jam</span>
          </div>
          <div class="flex items-center border {timeError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50 flex-1">
            <input id="availableMinutes" type="number" bind:value={availableMinutes} min="0" max="59"
              class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
            <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">menit</span>
          </div>
        </div>
        {#if timeError}<p class="text-xs text-red-500 mt-0.5">{timeError}</p>{/if}
      </div>
      {/if}

      <!-- Progress Bar (kedua mode) -->
      <div>
        <div class="flex justify-between text-xs text-slate-400 mb-1">
          <span>0%</span>
          {#if activeTab === 'target'}
            <span class="font-semibold text-emerald-600">{currentBattery}% → {targetBattery}%</span>
          {:else}
            <span class="font-semibold text-blue-600">{currentBattery}% → {finalBattery.toFixed(1)}%</span>
          {/if}
          <span>100%</span>
        </div>
        <div class="relative h-4 bg-slate-100 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-slate-300 rounded-full transition-all duration-300"
            style="width: {Math.min(currentBattery, 100)}%"></div>
          {#if activeTab === 'target'}
            <div class="absolute top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
              style="left: {Math.min(currentBattery, 100)}%; width: {Math.max(0, Math.min(targetBattery, 100) - Math.min(currentBattery, 100))}%">
            </div>
          {:else}
            <div class="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300"
              style="left: {Math.min(currentBattery, 100)}%; width: {Math.min(batteryGained, 100 - currentBattery)}%">
            </div>
          {/if}
        </div>
        <p class="text-xs text-slate-400 mt-1 text-center">Segmen berwarna = energi yang akan diisi</p>
      </div>

      <!-- Hasil Mode 1 -->
      {#if activeTab === 'target' && !socError && energyNeeded > 0}
      <div class="space-y-3 pt-2 border-t border-slate-100">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4">
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

          <div class="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
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
      {/if}

      <!-- Hasil Mode 2 -->
      {#if activeTab === 'time' && !timeError && availableTimeHours > 0}
      <div class="space-y-3 pt-2 border-t border-slate-100">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4">
            <div class="bg-emerald-100 text-emerald-600 rounded-lg p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Energi Terisi</p>
              <p class="text-xl font-bold text-slate-800">{energyFromTime.toFixed(2)} <span class="text-sm font-normal text-slate-500">kWh</span></p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
            <div class="bg-blue-100 text-blue-600 rounded-lg p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">Baterai Akhir</p>
              <p class="text-xl font-bold text-slate-800">{finalBattery.toFixed(1)} <span class="text-sm font-normal text-slate-500">%</span></p>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 space-y-3">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rincian Biaya</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600">Biaya Energi ({energyFromTime.toFixed(2)} kWh × {formatRupiah(tariffPerKwh)})</span>
            <span class="text-sm font-semibold text-slate-700">{formatRupiah(energyCost2)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600">PBJT-TL (tetap)</span>
            <span class="text-sm font-semibold text-slate-700">{formatRupiah(PBJT_TL)}</span>
          </div>
          <div class="border-t border-slate-200 pt-3 flex justify-between items-center">
            <span class="text-sm font-bold text-slate-800">Total Biaya</span>
            <span class="text-xl font-extrabold text-emerald-600">{formatRupiah(totalCost2)}</span>
          </div>
        </div>
      </div>
      {/if}

    </div>
  </div>

  <p class="text-center text-xs text-slate-400 pb-4">
    Tarif dasar PLN · PBJT-TL Rp6.660,31 (tetap) · Data bersifat estimasi
  </p>

</main>
</div>