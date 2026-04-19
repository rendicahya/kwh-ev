<script>
  import { clamp } from '../lib/validation.js';
  import { validateBudget } from '../lib/validation.js';
  import ProgressBar from './ProgressBar.svelte';
  import { calcBudget } from '../lib/calc.js';
  import { EV_PRESETS } from '../lib/constants.js';
  import RangeInfo from './RangeInfo.svelte';
  import BBMCompare from './BBMCompare.svelte';
  import EnergyInfo from './EnergyInfo.svelte';
  import CostBreakdown from './CostBreakdown.svelte';
  import BatteryFinalBox from './BatteryFinalBox.svelte';
  import ChargingTimeBox from './ChargingTimeBox.svelte';
  import NumberInput from './NumberInput.svelte';

  export let batteryCapacity, currentBattery, chargerPower, tariffPerKwh;
  export let budget;
  export let sharedValid;
  export let pbjt_rate;
  export let selectedEV = 'custom';
  export let efficiency;
  export let T;
  export let onResult = null;

  $: budgetError = validateBudget({ budget });
  $: result = !budgetError ? calcBudget({ budget, tariffPerKwh, chargerPower, batteryCapacity, currentBattery, pbjt_rate, efficiency }) : null;
  $: evPreset = selectedEV !== 'custom' ? EV_PRESETS.find(p => p.label === selectedEV) : null;
  $: showResult = sharedValid && !budgetError && result !== null && result.energyToBattery > 0;

  $: timeLabel = result
    ? ((result.chargingHours > 0 ? `${result.chargingHours} ${T.jamUnit}` : '') +
      (result.chargingMinutes > 0 ? ` ${result.chargingMinutes} ${T.menitUnit}` : '')).trim() || '< 1 menit'
    : '';

  $: if (showResult && result && onResult) {
    onResult('result', {
      energyFromGrid: result.energyFromGrid,
      cost: result.actualCost,
      batteryEnd: result.finalBattery,
    });
  }
</script>

<NumberInput
  id="budget"
  label={T.budgetLabel}
  bind:value={budget}
  min={0} step={1000} prefix="Rp"
  error={budgetError}
  on:blur={() => budget = clamp(budget, 0, 99999999)}
/>
{#if !budgetError && pbjt_rate > 0}
  <p class="text-xs text-slate-400 -mt-1">{T.budgetPbjtInfo}</p>
{/if}

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

    <ChargingTimeBox {T} {timeLabel} />

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