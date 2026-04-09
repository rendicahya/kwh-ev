<script>
  import { clamp } from '../lib/validation.js';
  import { EV_PRESETS, CHARGER_PRESETS, HOME_TARIFFS, SPKLU_TARIFF } from '../lib/constants.js';
  import { persisted, persist } from '../lib/persist.js';

  export let batteryCapacity, currentBattery, tariffPerKwh, chargerPower;
  export let batteryCapacityError, chargerPowerError, currentBatteryError;
  export let location;
  export let selectedEV;
  export let efficiency;
  export let T;

  let selectedCharger = persisted('selectedCharger', CHARGER_PRESETS.find(p => p.power === chargerPower)?.label ?? 'custom');
  export let homeDaya = persisted('homeDaya', HOME_TARIFFS[2].label);

  $: persist('selectedEV', selectedEV);
  $: persist('selectedCharger', selectedCharger);
  $: persist('homeDaya', homeDaya);

  function onLocationChange(val) {
    location = val;
    if (val === 'spklu') {
      tariffPerKwh = SPKLU_TARIFF;
    } else {
      const preset = HOME_TARIFFS.find(t => t.label === homeDaya);
      if (preset) tariffPerKwh = preset.tariff;
    }
  }

  function onHomeDayaChange(e) {
    homeDaya = e.target.value;
    const preset = HOME_TARIFFS.find(t => t.label === homeDaya);
    if (preset) tariffPerKwh = preset.tariff;
  }

  function onEVChange(e) {
    const preset = EV_PRESETS.find(p => p.label === e.target.value);
    if (preset) {
      selectedEV = e.target.value;
      batteryCapacity = preset.capacity;
    }
  }

  function onChargerChange(e) {
    const preset = CHARGER_PRESETS.find(p => p.label === e.target.value);
    if (preset) {
      selectedCharger = e.target.value;
      chargerPower = preset.power;
    }
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
    <h2 class="text-white font-semibold text-base tracking-wide">{T.cardVehicleTitle}</h2>
  </div>
  <div class="p-6 space-y-5">

    <!-- EV Preset -->
    <div class="flex flex-col gap-1">
      <label for="evPreset" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.evModelLabel}</label>
      <div class="relative">
        <select id="evPreset" value={selectedEV} on:change={onEVChange}
          class="w-full appearance-none px-4 py-2.5 pr-10 text-sm text-slate-700 bg-slate-50
                 border border-slate-200 rounded-xl outline-none
                 focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-colors">
          <option value="custom" disabled={selectedEV !== 'custom'}>{T.evCustom}</option>
          {#each EV_PRESETS as preset}
            <option value={preset.label}>{preset.label} — {preset.capacity} kWh</option>
          {/each}
        </select>
        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-5">

      <div class="flex flex-col gap-1">
        <label for="batteryCapacity" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.batteryCapacityLabel}</label>
        <div class="flex items-center border {batteryCapacityError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
          <input id="batteryCapacity" type="number" bind:value={batteryCapacity} min="0.1"
            on:input={() => selectedEV = 'custom'}
            on:blur={() => onBlur('batteryCapacity', 0.1, 9999)}
            class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
          <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kWh</span>
        </div>
        {#if batteryCapacityError}<p class="text-xs text-red-500 mt-0.5">{batteryCapacityError}</p>{/if}
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label for="currentBattery" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.currentBatteryLabel}</label>
          <span class="text-sm font-bold text-emerald-600">{currentBattery}%</span>
        </div>
        <input id="currentBattery" type="range" bind:value={currentBattery} min="0" max="100" step="1"
          class="w-full h-2 rounded-full appearance-none cursor-pointer
                 bg-slate-200 accent-emerald-500" />
        <div class="flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        {#if currentBatteryError}<p class="text-xs text-red-500 mt-0.5">{currentBatteryError}</p>{/if}
      </div>

    </div>

    <!-- Lokasi Charging -->
    <div class="flex flex-col gap-2">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.locationLabel}</p>
      <div class="grid grid-cols-2 gap-2">
        <button
          class="flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold
            {location === 'home'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}"
          on:click={() => onLocationChange('home')}>
          {T.locationHome}
        </button>
        <button
          class="flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold
            {location === 'spklu'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}"
          on:click={() => onLocationChange('spklu')}>
          {T.locationSpklu}
        </button>
      </div>

      <!-- Info SPKLU -->
      {#if location === 'spklu'}
        <p class="text-xs text-slate-400">{T.spkluInfo}</p>
      {/if}

      <!-- Pilihan daya rumah -->
      {#if location === 'home'}
        <div class="flex flex-col gap-1">
          <label for="homeDaya" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.homeDayaLabel}</label>
          <div class="relative">
            <select id="homeDaya" value={homeDaya} on:change={onHomeDayaChange}
              class="w-full appearance-none px-4 py-2.5 pr-10 text-sm text-slate-700 bg-slate-50
                     border border-slate-200 rounded-xl outline-none
                     focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-colors">
              {#each HOME_TARIFFS as t}
                <option value={t.label}>{t.label} — Rp{t.tariff.toLocaleString('id-ID')}/kWh</option>
              {/each}
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <p class="text-xs text-slate-400">{T.homeInfo(HOME_TARIFFS.find(h => h.label === homeDaya)?.tariff.toLocaleString('id-ID'))}</p>
        </div>
      {/if}
    </div>

    <!-- Charger Preset -->
    <div class="flex flex-col gap-1">
      <label for="chargerPreset" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.chargerTypeLabel}</label>
      <div class="relative">
        <select id="chargerPreset" value={selectedCharger} on:change={onChargerChange}
          class="w-full appearance-none px-4 py-2.5 pr-10 text-sm text-slate-700 bg-slate-50
                 border border-slate-200 rounded-xl outline-none
                 focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-colors">
          <option value="custom" disabled={selectedCharger !== 'custom'}>✏️ Custom</option>
          {#each CHARGER_PRESETS as preset}
            <option value={preset.label}>{preset.label}</option>
          {/each}
        </select>
        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label for="chargerPower" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.chargerPowerLabel}</label>
      <div class="flex items-center border {chargerPowerError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
        <input id="chargerPower" type="number" bind:value={chargerPower} min="0.1" step="0.1"
  on:input={() => {
    const preset = CHARGER_PRESETS.find(p => p.power === chargerPower);
    selectedCharger = preset ? preset.label : 'custom';
  }}
  on:blur={() => onBlur('chargerPower', 0.1, 9999)}
  class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
        <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">kW</span>
      </div>
      {#if chargerPowerError}<p class="text-xs text-red-500 mt-0.5">{chargerPowerError}</p>{/if}
    </div>

    <!-- Efisiensi Pengisian -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <label for="efficiency" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.efficiencyLabel}</label>
        <span class="text-sm font-bold text-emerald-600">{Math.round(efficiency * 100)}%</span>
      </div>
      <input id="efficiency" type="range" bind:value={efficiency} min="0.85" max="0.95" step="0.01"
      class="w-full h-2 rounded-full appearance-none cursor-pointer
      bg-slate-200 accent-emerald-500" />
      <div class="flex justify-between text-xs text-slate-400">
        <span>{T.efficiencyConservative}</span>
        <span>{T.efficiencyOptimal}</span>
      </div>
    </div>
  </div>
</div>