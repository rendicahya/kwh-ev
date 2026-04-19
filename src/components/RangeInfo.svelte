<script>
  export let T;
  export let evPreset;
  export let batteryStart;
  export let batteryEnd;

  $: rangeBefore = evPreset ? Math.round(evPreset.range * batteryStart / 100) : null;
  $: rangeAfter  = evPreset ? Math.round(evPreset.range * batteryEnd  / 100) : null;
  $: rangeGained = (rangeBefore !== null && rangeAfter !== null) ? rangeAfter - rangeBefore : null;
</script>

{#if evPreset && rangeGained !== null}
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
{/if}