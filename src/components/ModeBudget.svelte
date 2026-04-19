<script>
  import { clamp } from '../lib/validation.js';
  import { validateBudget } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import { calcBudget, formatRupiah } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';
  import { createEventDispatcher } from 'svelte';
  import RangeInfo from './RangeInfo.svelte';
  import BBMCompare from './BBMCompare.svelte';
  import EnergyInfo from './EnergyInfo.svelte';
  import CostBreakdown from './CostBreakdown.svelte';
  import BatteryFinalBox from './BatteryFinalBox.svelte';

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
  $: showResult = sharedValid && !budgetError && result !== null && result.energyToBattery > 0;

  $: timeLabel = result
    ? ((result.chargingHours > 0 ? `${result.chargingHours} ${T.jamUnit}` : '') +
      (result.chargingMinutes > 0 ? ` ${result.chargingMinutes} ${T.menitUnit}` : '')).trim() || '< 1 menit'
    : '';

  $: if (showResult && result) {
    dispatch('result', {
      energyFromGrid: result.energyFromGrid,
      cost: result.actualCost,
      batteryEnd: result.finalBattery,
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

    <EnergyInfo
      {T}
      energyFromGrid={result.energyFromGrid}
      energyToBattery={result.energyToBattery}
      {efficiency}
    />

    <RangeInfo
      {T} {evPreset}
      batteryStart={currentBattery}
      batteryEnd={result.finalBattery}
    />

    <BatteryFinalBox {T} finalBattery={result.finalBattery} />

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

    <CostBreakdown
      {T}
      energyFromGrid={result.energyFromGrid}
      {tariffPerKwh}
      energyCost={result.energyCost}
      pbjt={result.pbjt}
      {pbjt_rate}
      totalCost={result.actualCost}
    />

    <BBMCompare
      {T} {evPreset}
      batteryStart={currentBattery}
      batteryEnd={result.finalBattery}
      totalCost={result.actualCost}
    />

  </div>
{/if}