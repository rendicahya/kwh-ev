<script>
  import { clamp } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import { calcTarget, calcRange, formatRupiah } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';
  import { createEventDispatcher } from 'svelte';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let targetBattery, targetBatteryError;
  export let sharedValid;
  export let pbjt_rate;
  export let selectedEV = 'custom';
  export let efficiency;
  export let T;

  const dispatch = createEventDispatcher();

  $: result = calcTarget({ batteryCapacity, currentBattery, targetBattery, chargerPower, tariffPerKwh, pbjt_rate, efficiency });
  $: showResult = sharedValid && !targetBatteryError && result.energyNeeded > 0;
  $: evPreset = selectedEV !== 'custom' ? EV_PRESETS.find(p => p.label === selectedEV) : null;
  $: rangeGained = evPreset ? calcRange(evPreset.range, targetBattery) : null;

  $: timeLabel = (() => {
    const h = result.chargingHours > 0 ? `${result.chargingHours} ${T.jamUnit}` : '';
    const m = result.chargingMinutes > 0 ? ` ${result.chargingMinutes} ${T.menitUnit}` : '';
    return (h + m).trim() || '< 1 menit';
  })();

  $: if (showResult && result) {
    dispatch('result', {
      energyFromGrid: result.energyFromGrid,
      cost: result.totalCost,
    });
  }
</script>

<!-- Slider Baterai Target -->
<div class="flex flex-col gap-2">
  <div class="flex items-center justify-between">
    <label for="targetBattery" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.targetBatteryLabel}</label>
    <span class="text-sm font-bold {targetBattery > 80 ? 'text-amber-500' : 'text-emerald-600'}">{targetBattery}%</span>
  </div>
  <input id="targetBattery" type="range" bind:value={targetBattery} min="0" max="100" step="1"
    on:blur={() => targetBattery = clamp(targetBattery, 0, 100)}
    class="w-full h-2 rounded-full appearance-none cursor-pointer
           bg-slate-200 accent-emerald-500" />
  <div class="flex justify-between text-xs text-slate-400">
    <span>0%</span>
    <span>50%</span>
    <span>100%</span>
  </div>
  {#if targetBattery > 80}
    <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>
      <p class="text-xs text-amber-700">{T.warningOver80}</p>
    </div>
  {/if}
  {#if targetBatteryError}<p class="text-xs text-red-500 mt-0.5">{targetBatteryError}</p>{/if}
</div>

<ProgressBar mode="target" {currentBattery} {targetBattery} {T} />

{#if showResult}
  <div class="space-y-3 pt-2 border-t border-slate-100">

    <!-- Baris 1: Energi dari PLN + Energi ke Baterai -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4">
        <div class="bg-emerald-100 text-emerald-600 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-slate-500 font-medium">{T.energyFromGrid}</p>
          <p class="text-xl font-bold text-slate-800">{result.energyFromGrid.toFixed(2)} <span class="text-sm font-normal text-slate-500">kWh</span></p>
        </div>
      </div>

      <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
        <div class="bg-slate-200 text-slate-600 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 7h10a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2zm-4 4h2m10-4V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-slate-500 font-medium">{T.energyToBattery}</p>
          <p class="text-xl font-bold text-slate-800">{result.energyNeeded.toFixed(2)} <span class="text-sm font-normal text-slate-500">kWh</span></p>
        </div>
      </div>
    </div>

    <!-- Baris 2: Waktu Pengisian + Estimasi Jarak (jika ada preset) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
        <div class="bg-blue-100 text-blue-600 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-slate-500 font-medium">{T.chargingTime}</p>
          <p class="text-xl font-bold text-slate-800">{timeLabel}</p>
        </div>
      </div>

      {#if evPreset}
        <div class="flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-4">
          <div class="bg-violet-100 text-violet-600 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium">{T.estimatedRange} <span class="text-slate-400 font-normal">({evPreset.standard})</span></p>
            <p class="text-xl font-bold text-slate-800">~{rangeGained} <span class="text-sm font-normal text-slate-500">km</span></p>
            <p class="text-xs text-slate-400 mt-0.5">{T.basedOnBattery(targetBattery)}</p>
          </div>
        </div>
      {:else}
        <!-- Placeholder kosong agar baris tetap rapi jika tidak ada preset -->
        <div></div>
      {/if}
    </div>

    <!-- Rincian Biaya -->
    <div class="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 space-y-3">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.costBreakdown}</p>
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-600">{T.energyCostLabel} ({result.energyFromGrid.toFixed(2)} kWh × {formatRupiah(tariffPerKwh)})</span>
        <span class="text-sm font-semibold text-slate-700">{formatRupiah(result.energyCost)}</span>
      </div>
      {#if pbjt_rate > 0}
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-600">{T.pbjtLabel} <em>({T.pbjtDesc})</em></span>
        <span class="text-sm font-semibold text-slate-700">{formatRupiah(result.pbjt)}</span>
      </div>
      {/if}
      <div class="border-t border-slate-200 pt-3 flex justify-between items-center">
        <span class="text-sm font-bold text-slate-800">{T.totalCostLabel}</span>
        <span class="text-xl font-extrabold text-emerald-600">{formatRupiah(result.totalCost)}</span>
      </div>
    </div>

  </div>
{/if}