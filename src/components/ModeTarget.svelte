<script>
  import { clamp } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import ResultCard from './ResultCard.svelte';
  import { calcTarget } from '../lib/calc.js';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let targetBattery, targetBatteryError;
  export let sharedValid;
  export let pbjt_rate;

  $: result = calcTarget({ batteryCapacity, currentBattery, targetBattery, chargerPower, tariffPerKwh, pbjt_rate });
  $: showResult = sharedValid && !targetBatteryError && result.energyNeeded > 0;

  $: timeLabel = (() => {
    const h = result.chargingHours > 0 ? `${result.chargingHours} jam` : '';
    const m = result.chargingMinutes > 0 ? ` ${result.chargingMinutes} menit` : '';
    return (h + m).trim() || '< 1 menit';
  })();
</script>

<div class="flex flex-col gap-1">
  <label for="targetBattery" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Baterai Target</label>
  <div class="flex items-center border {targetBatteryError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
    <input id="targetBattery" type="number" bind:value={targetBattery} min="0" max="100"
      on:blur={() => targetBattery = clamp(targetBattery, 0, 100)}
      class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
    <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">%</span>
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
    <svelte:fragment slot="second-icon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </svelte:fragment>
  </ResultCard>
{/if}