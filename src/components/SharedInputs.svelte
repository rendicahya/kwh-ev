<script>
  import { clamp } from '../lib/validation.js';
  import { EV_PRESETS } from '../lib/constants.js';

  export let batteryCapacity, currentBattery, tariffPerKwh, chargerPower;
  export let batteryCapacityError, chargerPowerError, currentBatteryError, tariffError;

  // Cari preset yang cocok, atau 'custom'
  $: selectedPreset = EV_PRESETS.find(p => p.capacity === batteryCapacity)?.label ?? 'custom';

  function onPresetChange(e) {
    const val = e.target.value;
    if (val === 'custom') return;
    const preset = EV_PRESETS.find(p => p.label === val);
    if (preset) batteryCapacity = preset.capacity;
  }

  function onBlur(field, min, max) {
    if (field === 'batteryCapacity')  batteryCapacity  = clamp(batteryCapacity, min, max);
    if (field === 'chargerPower')     chargerPower     = clamp(chargerPower, min, max);
    if (field === 'currentBattery')   currentBattery   = clamp(currentBattery, min, max);
    if (field === 'tariffPerKwh')     tariffPerKwh     = clamp(tariffPerKwh, min, max);
  }
</script>

<div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
  <div class="bg-emerald-500 px-6 py-4">
    <h2 class="text-white font-semibold text-base tracking-wide">🚗 Data Kendaraan & Tarif</h2>
  </div>
  <div class="p-6 space-y-5">

    <!-- Preset Dropdown -->
    <div class="flex flex-col gap-1">
      <label for="evPreset" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pilih Model EV</label>
      <div class="relative">
        <select
          id="evPreset"
          value={selectedPreset}
          on:change={onPresetChange}
          class="w-full appearance-none px-4 py-2.5 pr-10 text-sm text-slate-700 bg-slate-50
                 border border-slate-200 rounded-xl outline-none
                 focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-colors">
          <option value="custom" disabled={selectedPreset !== 'custom'}>
            ✏️ Custom
          </option>
          {#each EV_PRESETS as preset}
            <option value={preset.label}>{preset.label} — {preset.capacity} kWh</option>
          {/each}
        </select>
        <!-- Chevron icon -->
        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Input Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

      <div class="flex flex-col gap-1">
        <label for="batteryCapacity" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kapasitas Baterai EV</label>
        <div class="flex items-center border {batteryCapacityError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="batteryCapacity" type="number" bind:value={batteryCapacity} min="0.1"
            on:blur={() => onBlur('batteryCapacity', 0.1, 9999)}
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kWh</span>
        </div>
        {#if batteryCapacityError}<p class="text-xs text-red-500 mt-0.5">{batteryCapacityError}</p>{/if}
      </div>

      <div class="flex flex-col gap-1">
        <label for="chargerPower" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daya Charger</label>
        <div class="flex items-center border {chargerPowerError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="chargerPower" type="number" bind:value={chargerPower} min="0.1" step="0.1"
            on:blur={() => onBlur('chargerPower', 0.1, 9999)}
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kW</span>
        </div>
        {#if chargerPowerError}<p class="text-xs text-red-500 mt-0.5">{chargerPowerError}</p>{/if}
      </div>

      <div class="flex flex-col gap-1">
        <label for="currentBattery" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Baterai Saat Ini</label>
        <div class="flex items-center border {currentBatteryError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="currentBattery" type="number" bind:value={currentBattery} min="0" max="100"
            on:blur={() => onBlur('currentBattery', 0, 100)}
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">%</span>
        </div>
        {#if currentBatteryError}<p class="text-xs text-red-500 mt-0.5">{currentBatteryError}</p>{/if}
      </div>

      <div class="flex flex-col gap-1">
        <label for="tariffPerKwh" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarif per kWh</label>
        <div class="flex items-center border {tariffError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-r border-slate-200">Rp</span>
          <input id="tariffPerKwh" type="number" bind:value={tariffPerKwh} min="0" step="0.01"
            on:blur={() => onBlur('tariffPerKwh', 0, 99999)}
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">/kWh</span>
        </div>
        {#if tariffError}<p class="text-xs text-red-500 mt-0.5">{tariffError}</p>{/if}
      </div>

    </div>
  </div>
</div>