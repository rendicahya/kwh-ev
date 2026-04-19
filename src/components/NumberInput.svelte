<script>
  export let id;
  export let label;
  export let value;
  export let min = 0;
  export let max = undefined;
  export let step = 1;
  export let unit = '';        // suffix kanan, misal "kWh", "kW", "%"
  export let prefix = '';      // prefix kiri, misal "Rp"
  export let error = '';
</script>

<div class="flex flex-col gap-1">
  {#if label}
    <label for={id} class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
  {/if}
  <div class="flex items-center border {error ? 'border-red-300' : 'border-slate-200'}
              rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-slate-50">
    {#if prefix}
      <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-r border-slate-200">{prefix}</span>
    {/if}
    <input {id} type="number" bind:value {min} {max} {step}
      class="flex-1 px-3 py-2.5 text-slate-800 bg-transparent outline-none text-sm" />
    {#if unit}
      <span class="px-3 text-xs text-slate-400 font-medium bg-slate-100 h-full flex items-center border-l border-slate-200">{unit}</span>
    {/if}
  </div>
  {#if error}<p class="text-xs text-red-500 mt-0.5">{error}</p>{/if}
</div>