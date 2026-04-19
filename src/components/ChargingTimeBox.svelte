<script>
  export let T;
  export let timeLabel;
</script>

<div class="flex items-center gap-3 rounded-xl px-4 py-4 bg-blue-50 border border-blue-100">
  <div class="rounded-lg p-2 bg-blue-100 text-blue-600">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  </div>
  <div>
    <p class="text-xs text-slate-500 font-medium">{T.chargingTime}</p>
    <p class="text-xl font-bold text-slate-800">{timeLabel}</p>
  </div>
</div>