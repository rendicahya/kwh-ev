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
    <svelte:fragment slot="second-icon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </svelte:fragment>
  </ResultCard>
{/if}