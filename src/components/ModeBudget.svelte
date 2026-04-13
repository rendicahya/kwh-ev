<script>
  import { clamp } from '../lib/validation.js';
  import { validateBudget } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import { calcBudget, calcRange, formatRupiah } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';
  import { createEventDispatcher } from 'svelte';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let budget;
  export let sharedValid;
  export let pbjt_rate;
  export let selectedEV = 'custom';
  export let efficiency;
  export let T;

  const dispatch = createEventDispatcher();

  $: budgetError = validateBudget({ budget });
  $: result = !budgetError ? calcBudget({ budget, tariffPerKwh, chargerPower, batteryCapacity, currentBattery, pbjt_rate, efficiency }) : null;
  $: evPreset = selectedEV !== 'custom' ? EV_PRESETS.find(p => p.label === selectedEV) : null;
  $: rangeGained = evPreset && result ? calcRange(evPreset.range, result.finalBattery) : null;
  $: showResult = sharedValid && !budgetError && result !== null && result.energyToBattery > 0;

  $: timeLabel = result
    ? ((result.chargingHours > 0 ? `${result.chargingHours} ${T.jamUnit}` : '') +
      (result.chargingMinutes > 0 ? ` ${result.chargingMinutes} ${T.menitUnit}` : '')).trim() || '< 1 menit'
    : '';

  $: if (showResult && result) {
    dispatch('result', {
      energyFromGrid: result.energyFromGrid,
      cost: result.actualCost,
    });
  }
</script>

<div class="flex flex-col gap-1">
  <label for="budget" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.budgetLabel}</label>
  <div class="flex items-center border {budgetError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
    <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-r border-slate-200">Rp</span>
    <input id="budget" type="number" bind:value={budget} min="0" step="1000"
      on:blur={() => budget = clamp(budget, 0, 99999999)}
      class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
  </div>
  {#if budgetError}
    <p class="text-xs text-red-500 mt-0.5">{budgetError}</p>
  {:else if pbjt_rate > 0}
    <p class="text-xs text-slate-400 mt-0.5">{T.budgetPbjtInfo}</p>
  {/if}
</div>

{#if result}
  <ProgressBar
    mode="time"
    {currentBattery}
    finalBattery={result.finalBattery}
    batteryGained={result.batteryGained}
    {T}
  />
{:else}
  <ProgressBar mode="time" {currentBattery} finalBattery={currentBattery} batteryGained={0} {T} />
{/if}

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
          <p class="text-xl font-bold text-slate-800">{result.energyToBattery.toFixed(0)} <span class="text-sm font-normal text-slate-500">kWh</span></p>
        </div>
      </div>
    </div>

    <!-- Baris 2: Baterai Akhir + Estimasi Jarak -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
        <div class="bg-blue-100 text-blue-600 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-slate-500 font-medium">{T.batteryFinal}</p>
          <p class="text-xl font-bold text-slate-800">{result.finalBattery.toFixed(1)} <span class="text-sm font-normal text-slate-500">%</span></p>
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
            <p class="text-xs text-slate-400 mt-0.5">{T.basedOnBattery(result.finalBattery.toFixed(1))}</p>
          </div>
        </div>
      {:else}
        <div></div>
      {/if}
    </div>

    <!-- Waktu Pengisian -->
    <div class="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-4">
      <div class="bg-amber-100 text-amber-600 rounded-lg p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div>
        <p class="text-xs text-slate-500 font-medium">{T.chargingTimeLabel}</p>
        <p class="text-xl font-bold text-slate-800">{timeLabel}</p>
      </div>
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
        <span class="text-xl font-extrabold text-emerald-600">{formatRupiah(result.actualCost)}</span>
      </div>
    </div>

  </div>
{/if}