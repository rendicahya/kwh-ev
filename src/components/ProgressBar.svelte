<script>
  export let currentBattery;
  export let targetBattery = null;   // mode 1
  export let finalBattery = null;    // mode 2
  export let batteryGained = null;   // mode 2
  export let mode = 'target';        // 'target' | 'time'
  export let T;
</script>

<div>
  <div class="flex justify-between text-xs text-slate-400 mb-1">
    <span>0%</span>
    {#if mode === 'target'}
      <span class="font-semibold text-emerald-600">{currentBattery}% → {targetBattery}%</span>
    {:else}
      <span class="font-semibold text-blue-600">{currentBattery}% → {finalBattery?.toFixed(1)}%</span>
    {/if}
    <span>100%</span>
  </div>
  <div class="relative h-4 bg-slate-100 rounded-full overflow-hidden">
    <div class="absolute top-0 left-0 h-full bg-slate-300 rounded-full transition-all duration-300"
      style="width: {Math.min(currentBattery, 100)}%"></div>
    {#if mode === 'target'}
      <div class="absolute top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
        style="left: {Math.min(currentBattery, 100)}%; width: {Math.max(0, Math.min(targetBattery, 100) - Math.min(currentBattery, 100))}%">
      </div>
    {:else}
      <div class="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300"
        style="left: {Math.min(currentBattery, 100)}%; width: {Math.min(batteryGained, 100 - currentBattery)}%">
      </div>
    {/if}
  </div>
  <p class="text-xs text-slate-400 mt-1 text-center">{T.progressBarLabel}</p>
</div>