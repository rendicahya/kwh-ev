<script>
  import { formatRupiah } from '../lib/calc.js';
  export let energyLabel = 'Energi';
  export let energyValue;
  export let secondLabel = '';
  export let secondValue = '';
  export let secondUnit = '';
  export let energyCost;
  export let totalCost;
  export let tariffPerKwh;
  export let PBJT_TL;
</script>

<div class="space-y-3 pt-2 border-t border-slate-100">
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4">
      <div class="bg-emerald-100 text-emerald-600 rounded-lg p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <div>
        <p class="text-xs text-slate-500 font-medium">{energyLabel}</p>
        <p class="text-xl font-bold text-slate-800">{energyValue} <span class="text-sm font-normal text-slate-500">kWh</span></p>
      </div>
    </div>
    <div class="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
      <div class="bg-blue-100 text-blue-600 rounded-lg p-2">
        <slot name="second-icon" />
      </div>
      <div>
        <p class="text-xs text-slate-500 font-medium">{secondLabel}</p>
        <p class="text-xl font-bold text-slate-800">{secondValue} <span class="text-sm font-normal text-slate-500">{secondUnit}</span></p>
      </div>
    </div>
  </div>

  <slot name="extra" />

  <div class="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 space-y-3">
    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rincian Biaya</p>
    <div class="flex justify-between items-center">
      <span class="text-sm text-slate-600">Biaya Energi × {formatRupiah(tariffPerKwh)}</span>
      <span class="text-sm font-semibold text-slate-700">{formatRupiah(energyCost)}</span>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-sm text-slate-600">PBJT-TL (tetap)</span>
      <span class="text-sm font-semibold text-slate-700">{formatRupiah(PBJT_TL)}</span>
    </div>
    <div class="border-t border-slate-200 pt-3 flex justify-between items-center">
      <span class="text-sm font-bold text-slate-800">Total Biaya</span>
      <span class="text-xl font-extrabold text-emerald-600">{formatRupiah(totalCost)}</span>
    </div>
  </div>
</div>