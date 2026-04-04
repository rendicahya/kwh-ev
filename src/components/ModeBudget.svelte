<script>
  import { clamp } from '../lib/validation.js';
  import { validateBudget } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import ResultCard from './ResultCard.svelte';
  import { calcBudget, formatRupiah } from '../lib/calc.js';
  import { calcRange } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let budget;
  export let sharedValid;
  export let pbjt_rate;
  export let selectedEV = 'custom';

  $: budgetError = validateBudget({ budget });
  $: result = !budgetError ? calcBudget({ budget, tariffPerKwh, chargerPower, batteryCapacity, currentBattery, pbjt_rate }) : null;
  $: showResult = sharedValid && !budgetError && result !== null && result.energyFromBudget > 0;
  $: evPreset = selectedEV !== 'custom' ? EV_PRESETS.find(p => p.label === selectedEV) : null;
  $: rangeGained = evPreset && result ? calcRange(evPreset.range, result.finalBattery) : null;

  $: timeLabel = result
    ? ((result.chargingHours > 0 ? `${result.chargingHours} jam` : '') +
       (result.chargingMinutes > 0 ? ` ${result.chargingMinutes} menit` : '')).trim() || '< 1 menit'
    : '';
</script>

<div class="flex flex-col gap-1">
  <label for="budget" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Biaya yang Tersedia</label>
  <div class="flex items-center border {budgetError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
    <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-r border-slate-200">Rp</span>
    <input id="budget" type="number" bind:value={budget} min="0" step="1000"
      on:blur={() => budget = clamp(budget, 0, 99999999)}
      class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
  </div>
  {#if budgetError}
    <p class="text-xs text-red-500 mt-0.5">{budgetError}</p>
  {:else if pbjt_rate > 0}
    <p class="text-xs text-slate-400 mt-0.5">Sudah termasuk PBJT-TL 10%</p>
  {/if}
</div>

{#if result}
  <ProgressBar
    mode="time"
    {currentBattery}
    finalBattery={result.finalBattery}
    batteryGained={result.batteryGained}
  />
{:else}
  <ProgressBar mode="time" {currentBattery} finalBattery={currentBattery} batteryGained={0} />
{/if}

{#if showResult}
  <ResultCard
    energyLabel="Energi Terisi"
    energyValue={result.energyFromBudget.toFixed(0)}
    secondLabel="Waktu Pengisian"
    secondValue={timeLabel}
    secondUnit=""
    energyCost={result.energyCost}
    totalCost={result.actualCost}
    {tariffPerKwh}
    pbjt={result.pbjt}
  >
    <svelte:fragment slot="second-icon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </svelte:fragment>

    <svelte:fragment slot="extra">
      <div class="flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-4">
        <div class="bg-violet-100 text-violet-600 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-slate-500 font-medium">Baterai Akhir</p>
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
            <p class="text-xs text-slate-500 font-medium">Estimasi Jarak Tempuh <span class="text-slate-400 font-normal">({evPreset.standard})</span></p>
            <p class="text-xl font-bold text-slate-800">~{rangeGained} <span class="text-sm font-normal text-slate-500">km</span></p>
            <p class="text-xs text-slate-400 mt-0.5">Berdasarkan {result.finalBattery.toFixed(1)}% baterai · standar {evPreset.standard}</p>
          </div>
        </div>
      {/if}
    </svelte:fragment>
  </ResultCard>
{/if}