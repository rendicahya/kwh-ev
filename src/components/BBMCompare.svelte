<script>
  import { calcBBMCost, formatRupiah } from '../lib/calc.js';

  export let T;
  export let evPreset;
  export let batteryStart;
  export let batteryEnd;
  export let totalCost;

  $: rangeGained = evPreset
    ? Math.max(0, Math.round(evPreset.range * batteryEnd / 100) - Math.round(evPreset.range * batteryStart / 100))
    : null;
  $: bbm = (rangeGained !== null && rangeGained > 0) ? calcBBMCost(rangeGained) : null;
</script>

{#if evPreset && bbm}
  <div class="bg-orange-50 border border-orange-100 rounded-xl px-4 py-4 space-y-3">
    <div class="flex items-center gap-2">
      <div class="bg-orange-100 text-orange-600 rounded-lg p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-700">{T.bbmCompareTitle}</p>
        <p class="text-xs text-slate-400">{rangeGained} km ÷ {T.bbmEfficiencyValue} km/L = {bbm.liters.toFixed(2)} L</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-lg px-3 py-3 border border-orange-100 space-y-1">
        <p class="text-xs text-slate-400">{T.bbmPertalite}</p>
        <p class="text-xs text-slate-400">{bbm.liters.toFixed(2)} L × Rp10.000</p>
        <p class="text-lg font-bold text-slate-800">{formatRupiah(bbm.pertalite)}</p>
        {#if bbm.pertalite > totalCost}
          <p class="text-xs text-emerald-600 font-medium">{T.evSaves(formatRupiah(bbm.pertalite - totalCost))}</p>
        {:else}
          <p class="text-xs text-orange-600 font-medium">{T.bbmSaves(formatRupiah(totalCost - bbm.pertalite))}</p>
        {/if}
      </div>
      <div class="bg-white rounded-lg px-3 py-3 border border-orange-100 space-y-1">
        <p class="text-xs text-slate-400">{T.bbmPertamax}</p>
        <p class="text-xs text-slate-400">{bbm.liters.toFixed(2)} L × Rp12.300</p>
        <p class="text-lg font-bold text-slate-800">{formatRupiah(bbm.pertamax)}</p>
        {#if bbm.pertamax > totalCost}
          <p class="text-xs text-emerald-600 font-medium">{T.evSaves(formatRupiah(bbm.pertamax - totalCost))}</p>
        {:else}
          <p class="text-xs text-orange-600 font-medium">{T.bbmSaves(formatRupiah(totalCost - bbm.pertamax))}</p>
        {/if}
      </div>
    </div>
  </div>
{/if}