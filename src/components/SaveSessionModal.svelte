<script>
  import { createEntry, loadHistory, saveHistory } from '../lib/history.js';
  import { formatRupiah } from '../lib/calc.js';

  export let T;
  export let sessionData;   // data dari kalkulator
  export let onClose;
  export let onSaved;

  // Format tanggal & jam sekarang sebagai default
  const now = new Date();
  const padZ = n => String(n).padStart(2, '0');
  let date = `${now.getFullYear()}-${padZ(now.getMonth() + 1)}-${padZ(now.getDate())}`;
  let time = `${padZ(now.getHours())}:${padZ(now.getMinutes())}`;
  let evModelName = sessionData.evModel ?? '';

  function save() {
    const entry = createEntry({
      evModel: evModelName || 'Custom',
      batteryCapacity: sessionData.batteryCapacity,
      batteryStart: sessionData.batteryStart,
      batteryEnd: sessionData.batteryEnd,
      energyFromGrid: sessionData.energyFromGrid,
      cost: sessionData.cost,
      location: sessionData.location,
      date,
      time,
    });
    const history = loadHistory();
    saveHistory([entry, ...history]);
    onSaved();
    onClose();
  }
</script>

<!-- Overlay -->
<div class="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
  on:click|self={onClose}>

  <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
    <h3 class="text-base font-bold text-slate-800">{T.saveSessionTitle}</h3>

    <!-- Summary readonly -->
    <div class="bg-slate-50 rounded-xl px-4 py-3 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-slate-500">{T.colBattery}</span>
        <span class="font-semibold text-slate-700">{sessionData.batteryStart}% → {sessionData.batteryEnd}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">{T.colEnergy}</span>
        <span class="font-semibold text-slate-700">{sessionData.energyFromGrid.toFixed(2)} kWh</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">{T.colCost}</span>
        <span class="font-semibold text-slate-700">{formatRupiah(sessionData.cost)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">{T.colLocation}</span>
        <span class="font-semibold text-slate-700">{sessionData.location === 'home' ? T.locationHome : T.locationSpklu}</span>
      </div>
    </div>

    <!-- Editable: nama kendaraan -->
    <div class="flex flex-col gap-1">
      <label for="evModelName" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.evModelNameLabel}</label>
      <input id="evModelName" type="text" bind:value={evModelName}
        class="px-3 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200
               rounded-xl outline-none focus:ring-2 focus:ring-emerald-400" />
    </div>

    <!-- Editable: tanggal & jam -->
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label for="sessionDate" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.sessionDate}</label>
        <input id="sessionDate" type="date" bind:value={date}
          class="px-3 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200
                 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="sessionTime" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.sessionTime}</label>
        <input id="sessionTime" type="time" bind:value={time}
          class="px-3 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200
                 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400" />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 pt-1">
      <button on:click={onClose}
        class="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200
               text-slate-600 hover:bg-slate-50 transition-colors">
        {T.saveSessionCancel}
      </button>
      <button on:click={save}
        class="flex-1 py-2.5 rounded-xl text-sm font-semibold
               bg-emerald-500 text-white hover:bg-emerald-400 transition-colors">
        {T.saveSessionConfirm}
      </button>
    </div>
  </div>
</div>