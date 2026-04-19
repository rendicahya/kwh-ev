<script>
  import { formatRupiah } from '../lib/calc.js';

  export let T;
  export let energyFromGrid;
  export let tariffPerKwh;
  export let energyCost;
  export let pbjt;
  export let pbjt_rate;
  export let totalCost;
</script>

<div class="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 space-y-3">
  <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.costBreakdown}</p>
  <div class="flex justify-between items-center">
    <span class="text-sm text-slate-600">{T.energyCostLabel} ({energyFromGrid.toFixed(2)} kWh × {formatRupiah(tariffPerKwh)})</span>
    <span class="text-sm font-semibold text-slate-700">{formatRupiah(energyCost)}</span>
  </div>
  {#if pbjt_rate > 0}
  <div class="flex justify-between items-center">
    <span class="text-sm text-slate-600">{T.pbjtLabel} <em>({T.pbjtDesc})</em></span>
    <span class="text-sm font-semibold text-slate-700">{formatRupiah(pbjt)}</span>
  </div>
  {/if}
  <div class="border-t border-slate-200 pt-3 flex justify-between items-center">
    <span class="text-sm font-bold text-slate-800">{T.totalCostLabel}</span>
    <span class="text-xl font-extrabold text-emerald-600">{formatRupiah(totalCost)}</span>
  </div>
</div>