<script>
  export let T;
  export let finalBattery;
</script>

<div class="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
  <div class="bg-blue-100 text-blue-600 rounded-lg p-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
    </svg>
  </div>
  <div>
    <p class="text-xs text-slate-500 font-medium">{T.batteryFinal}</p>
    <p class="text-xl font-bold text-slate-800">{finalBattery.toFixed(1)} <span class="text-sm font-normal text-slate-500">%</span></p>
  </div>
</div>