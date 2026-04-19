<script>
  import { clamp } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import { calcTarget, formatRupiah } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';
  import { createEventDispatcher } from 'svelte';
  import RangeInfo from './RangeInfo.svelte';
  import BBMCompare from './BBMCompare.svelte';
  import EnergyInfo from './EnergyInfo.svelte';
  import CostBreakdown from './CostBreakdown.svelte';
  import ChargingTimeBox from './ChargingTimeBox.svelte';

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

  $: timeLabel = (() => {
    const h = result.chargingHours > 0 ? `${result.chargingHours} ${T.jamUnit}` : '';
    const m = result.chargingMinutes > 0 ? ` ${result.chargingMinutes} ${T.menitUnit}` : '';
    return (h + m).trim() || '< 1 menit';
  })();

  $: if (showResult && result) {
    dispatch('result', {
      energyFromGrid: result.energyFromGrid,
      cost: result.totalCost,
      batteryEnd: targetBattery,
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
    <EnergyInfo
      {T}
      energyFromGrid={result.energyFromGrid}
      energyToBattery={result.energyNeeded}
      {efficiency}
    />

    <RangeInfo
      {T} {evPreset}
      batteryStart={currentBattery}
      batteryEnd={targetBattery}
    />

    <ChargingTimeBox {T} {timeLabel} />

    <CostBreakdown
      {T}
      energyFromGrid={result.energyFromGrid}
      {tariffPerKwh}
      energyCost={result.energyCost}
      pbjt={result.pbjt}
      {pbjt_rate}
      totalCost={result.totalCost}
    />

    <BBMCompare
      {T} {evPreset}
      batteryStart={currentBattery}
      batteryEnd={targetBattery}
      totalCost={result.totalCost}
    />

  </div>
{/if}