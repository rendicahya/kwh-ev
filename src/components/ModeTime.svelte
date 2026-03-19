<script>
  import { clamp } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import ResultCard from './ResultCard.svelte';
  import { PBJT_TL } from '../lib/constants.js';
  import { calcTime } from '../lib/calc.js';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let availableHours, availableMinutes;
  export let availableHoursError, availableMinutesError, timeError;
  export let sharedValid;

  $: result = calcTime({ batteryCapacity, currentBattery, chargerPower, availableHours, availableMinutes, tariffPerKwh, PBJT_TL });
  $: showResult = sharedValid && !timeError && !availableHoursError && !availableMinutesError && (availableHours > 0 || availableMinutes > 0);
</script>

<div class="flex flex-col gap-1">
  <label for="availableHours" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu Tersedia</label>
  <div class="flex gap-3">
    <div class="flex-1 flex flex-col gap-1">
      <div class="flex items-center border {availableHoursError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
        <input id="availableHours" type="number" bind:value={availableHours} min="0" max="24"
          on:blur={() => availableHours = clamp(availableHours, 0, 24)}
          class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
        <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">jam</span>
      </div>
      {#if availableHoursError}<p class="text-xs text-red-500 mt-0.5">{availableHoursError}</p>{/if}
    </div>
    <div class="flex-1 flex flex-col gap-1">
      <div class="flex items-center border {availableMinutesError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
        <input id="availableMinutes" type="number" bind:value={availableMinutes} min="0" max="59"
          on:blur={() => availableMinutes = clamp(availableMinutes, 0, 59)}
          class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
        <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">menit</span>
      </div>
      {#if availableMinutesError}<p class="text-xs text-red-500 mt-0.5">{availableMinutesError}</p>{/if}
    </div>
  </div>
  {#if timeError}<p class="text-xs text-red-500 mt-0.5">{timeError}</p>{/if}
</div>

<ProgressBar mode="time" {currentBattery} finalBattery={result.finalBattery} batteryGained={result.batteryGained} />

{#if showResult}
  <ResultCard
    energyLabel="Energi Terisi"
    energyValue={result.energyFromTime.toFixed(2)}
    secondLabel="Baterai Akhir"
    secondValue={result.finalBattery.toFixed(1)}
    secondUnit="%"
    energyCost={result.energyCost}
    totalCost={result.totalCost}
    {tariffPerKwh}
    {PBJT_TL}
  >
    <svelte:fragment slot="second-icon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
      </svg>
    </svelte:fragment>
  </ResultCard>
{/if}