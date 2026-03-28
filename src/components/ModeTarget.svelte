<script>
  import { clamp } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import ResultCard from './ResultCard.svelte';
  import { calcTarget, calcRange } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let targetBattery, targetBatteryError;
  export let sharedValid;
  export let pbjt_rate;
  export let selectedEV = 'custom';

  $: result = calcTarget({ batteryCapacity, currentBattery, targetBattery, chargerPower, tariffPerKwh, pbjt_rate });
  $: showResult = sharedValid && !targetBatteryError && result.energyNeeded > 0;
  $: evPreset = selectedEV !== 'custom' ? EV_PRESETS.find(p => p.label === selectedEV) : null;
  $: estimatedRange = evPreset ? calcRange({ targetBattery, currentBattery: 0, fullRange: evPreset.range }) : null;
  $: rangeGained = evPreset ? Math.round(evPreset.range * (result.energyNeeded / evPreset.capacity)) : null;

  $: timeLabel = (() => {
    const h = result.chargingHours > 0 ? `${result.chargingHours} jam` : '';
    const m = result.chargingMinutes > 0 ? ` ${result.chargingMinutes} menit` : '';
    return (h + m).trim() || '< 1 menit';
  })();
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center justify-between">
    <label for="targetBattery" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Baterai Target</label>
    <span class="text-sm font-bold text-emerald-600">{targetBattery}%</span>
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
  {#if targetBatteryError}<p class="text-xs text-red-500 mt-0.5">{targetBatteryError}</p>{/if}
</div>

<ProgressBar mode="target" {currentBattery} {targetBattery} />

{#if showResult}
  <ResultCard
    energyLabel="Energi Dibutuhkan"
    energyValue={result.energyNeeded.toFixed(2)}
    secondLabel="Waktu Pengisian"
    secondValue={timeLabel}
    secondUnit=""
    energyCost={result.energyCost}
    totalCost={result.totalCost}
    {tariffPerKwh}
    pbjt={result.pbjt}
  >
    <svelte:fragment slot="extra">
      {#if evPreset}
        <div class="flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-4">
          <div class="bg-violet-100 text-violet-600 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium">
              Estimasi Jarak Tempuh
              <span class="text-slate-400 font-normal">({evPreset.standard})</span>
            </p>
            <p class="text-xl font-bold text-slate-800">
              ~{rangeGained} <span class="text-sm font-normal text-slate-500">km</span>
            </p>
            <p class="text-xs text-slate-400 mt-0.5">dari {targetBattery}% baterai ≈ ~{estimatedRange} km total</p>
          </div>
        </div>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="second-icon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </svelte:fragment>
  </ResultCard>
{/if}