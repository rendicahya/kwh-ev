<script>
  import { clamp } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import { calcTime, formatRupiah } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';
  import { createEventDispatcher } from 'svelte';
  import RangeInfo from './RangeInfo.svelte';
  import BBMCompare from './BBMCompare.svelte';
  import EnergyInfo from './EnergyInfo.svelte';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let availableHours, availableMinutes;
  export let availableHoursError, availableMinutesError, timeError;
  export let sharedValid;
  export let pbjt_rate;
  export let selectedEV = 'custom';
  export let efficiency;
  export let T;

  const dispatch = createEventDispatcher();

  $: result = calcTime({ batteryCapacity, currentBattery, chargerPower, availableHours, availableMinutes, tariffPerKwh, pbjt_rate, efficiency });
  $: showResult = sharedValid && !timeError && !availableHoursError && !availableMinutesError && (availableHours > 0 || availableMinutes > 0);
  $: evPreset = selectedEV !== 'custom' ? EV_PRESETS.find(p => p.label === selectedEV) : null;

  $: timeLabel = result
    ? ((result.actualHours > 0 ? `${result.actualHours} ${T.jamUnit}` : '') +
      (result.actualMinutes > 0 ? ` ${result.actualMinutes} ${T.menitUnit}` : '')).trim() || '< 1 menit'
    : '';

  // Apakah pengisian selesai sebelum waktu tersedia habis
  $: chargeComplete = result && (result.actualHours < availableHours ||
    (result.actualHours === availableHours && result.actualMinutes < availableMinutes));

  $: if (showResult && result) {
    dispatch('result', {
      energyFromGrid: result.energyFromGrid,
      cost: result.totalCost,
      batteryEnd: result.finalBattery,
    });
  }
</script>

<div class="flex flex-col gap-1">
  <label for="availableHours" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.chargingTimeLabel}</label>
  <div class="flex gap-3">
    <div class="flex-1 flex flex-col gap-1">
      <div class="flex items-center border {availableHoursError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
        <input id="availableHours" type="number" bind:value={availableHours} min="0" max="24"
          on:blur={() => availableHours = clamp(availableHours, 0, 24)}
          class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
        <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">{T.jamUnit}</span>
      </div>
      {#if availableHoursError}<p class="text-xs text-red-500 mt-0.5">{availableHoursError}</p>{/if}
    </div>
    <div class="flex-1 flex flex-col gap-1">
      <div class="flex items-center border {availableMinutesError ? 'border-red-300' : 'border-slate-200'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
        <input id="availableMinutes" type="number" bind:value={availableMinutes} min="0" max="59"
          on:blur={() => availableMinutes = clamp(availableMinutes, 0, 59)}
          class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
        <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">{T.menitUnit}</span>
      </div>
      {#if availableMinutesError}<p class="text-xs text-red-500 mt-0.5">{availableMinutesError}</p>{/if}
    </div>
  </div>
  {#if timeError}<p class="text-xs text-red-500 mt-0.5">{timeError}</p>{/if}
</div>

<ProgressBar mode="time" {currentBattery} finalBattery={result.finalBattery} batteryGained={result.batteryGained} {T} />

{#if showResult}
  <div class="space-y-3 pt-2 border-t border-slate-100">

    <!-- Baris 1: Energi dari PLN + Energi ke Baterai -->
    <EnergyInfo
      {T}
      energyFromGrid={result.energyFromGrid}
      energyToBattery={result.energyToBattery}
      {efficiency}
    />

    <!-- Baris 2: Baterai Akhir + Estimasi Jarak -->
    <RangeInfo
      {T} {evPreset}
      batteryStart={currentBattery}
      batteryEnd={result.finalBattery}
    />

    <!-- Notifikasi selesai lebih cepat -->
    {#if chargeComplete}
      <div class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
        </svg>
        <p class="text-xs text-emerald-700">{T.chargeCompleteMsg(timeLabel)}</p>
      </div>
    {/if}

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

    <BBMCompare
      {T} {evPreset}
      batteryStart={currentBattery}
      batteryEnd={result.finalBattery}
      totalCost={result.totalCost}
    />

  </div>
{/if}