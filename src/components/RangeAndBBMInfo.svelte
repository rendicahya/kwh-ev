<script>
  import { calcBBMCost, formatRupiah } from '../lib/calc.js';

  export let T;
  export let evPreset;
  export let batteryStart;   // % sebelum
  export let batteryEnd;     // % sesudah
  export let totalCost;      // biaya EV

  $: rangeBefore = evPreset ? Math.round(evPreset.range * batteryStart / 100) : null;
  $: rangeAfter  = evPreset ? Math.round(evPreset.range * batteryEnd  / 100) : null;
  $: rangeGained = (rangeBefore !== null && rangeAfter !== null) ? rangeAfter - rangeBefore : null;
  $: bbm = rangeGained ? calcBBMCost(rangeGained) : null;
</script>

{#if evPreset && rangeGained !== null}

  <!-- Box Estimasi Jarak -->
  <div class="bg-violet-50 border border-violet-100 rounded-xl px-4 py-4 space-y-3">
    <div class="flex items-center gap-2">
      <div class="bg-violet-100 text-violet-600 rounded-lg p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-700">{T.estimatedRange} <span class="text-xs font-normal text-slate-400">({evPreset.standard})</span></p>
    </div>
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="bg-white rounded-lg px-2 py-2 border border-violet-100">
        <p class="text-xs text-slate-400">{T.rangeBeforeLabel}</p>
        <p class="text-base font-bold text-slate-700">~{rangeBefore} <span class="text-xs font-normal text-slate-400">km</span></p>
      </div>
      <div class="bg-white rounded-lg px-2 py-2 border border-violet-100">
        <p class="text-xs text-slate-400">{T.rangeAfterLabel}</p>
        <p class="text-base font-bold text-slate-700">~{rangeAfter} <span class="text-xs font-normal text-slate-400">km</span></p>
      </div>
      <div class="bg-violet-100 rounded-lg px-2 py-2 border border-violet-200">
        <p class="text-xs text-slate-400">+{T.rangeGainedLabel}</p>
        <p class="text-base font-bold text-violet-700">+{rangeGained} <span class="text-xs font-normal text-violet-500">km</span></p>
      </div>
    </div>
  </div>

  <!-- Box Perbandingan BBM -->
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
        <p class="text-xs text-slate-400">{T.bbmEfficiency} · {bbm.liters.toFixed(1)} liter</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-lg px-3 py-3 border border-orange-100 space-y-1">
        <p class="text-xs text-slate-400">{T.bbmPertalite}</p>
        <p class="text-lg font-bold text-orange-600">{formatRupiah(bbm.pertalite)}</p>
        {#if bbm.pertalite > totalCost}
          <p class="text-xs text-emerald-600 font-medium">{T.evSaves(formatRupiah(bbm.pertalite - totalCost))}</p>
        {:else}
          <p class="text-xs text-orange-600 font-medium">{T.bbmSaves(formatRupiah(totalCost - bbm.pertalite))}</p>
        {/if}
      </div>
      <div class="bg-white rounded-lg px-3 py-3 border border-orange-100 space-y-1">
        <p class="text-xs text-slate-400">{T.bbmPertamax}</p>
        <p class="text-lg font-bold text-orange-600">{formatRupiah(bbm.pertamax)}</p>
        {#if bbm.pertamax > totalCost}
          <p class="text-xs text-emerald-600 font-medium">{T.evSaves(formatRupiah(bbm.pertamax - totalCost))}</p>
        {:else}
          <p class="text-xs text-orange-600 font-medium">{T.bbmSaves(formatRupiah(totalCost - bbm.pertamax))}</p>
        {/if}
      </div>
    </div>
  </div>

{/if}