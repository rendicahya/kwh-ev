<script>
  import { loadHistory, saveHistory, calcStats } from '../lib/history.js';
  import { formatRupiah } from '../lib/calc.js';

  export let T;

  let entries = loadHistory();
  let editingId = null;
  let editDate = '';
  let editTime = '';
  let editEvModel = '';

  $: stats = calcStats(entries);

  function refresh() {
    entries = loadHistory();
  }

  function startEdit(entry) {
    editingId = entry.id;
    editDate = entry.date;
    editTime = entry.time;
    editEvModel = entry.evModel;
  }

  function saveEdit(entry) {
    const history = loadHistory();
    const updated = history.map(e => e.id === entry.id
      ? { ...e, date: editDate, time: editTime, evModel: editEvModel }
      : e
    );
    saveHistory(updated);
    editingId = null;
    refresh();
  }

  function cancelEdit() {
    editingId = null;
  }

  function deleteEntry(id) {
    if (!confirm(T.deleteConfirm)) return;
    const history = loadHistory();
    saveHistory(history.filter(e => e.id !== id));
    refresh();
  }

  function formatDate(date, time) {
    return `${date} ${time}`;
  }
</script>

<div class="space-y-6">

  {#if entries.length === 0}
    <!-- Empty state -->
    <div class="text-center py-12 space-y-2">
      <p class="text-4xl">📋</p>
      <p class="text-slate-600 font-medium">{T.historyEmpty}</p>
      <p class="text-sm text-slate-400">{T.historyEmptyHint}</p>
    </div>

  {:else}

    <!-- Statistik -->
    <div class="space-y-3">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.statsTitle}</p>
      <div class="grid grid-cols-2 gap-3">

        <div class="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-500">{T.statsTotalSessions}</p>
          <p class="text-xl font-bold text-slate-800">{stats.totalSessions}</p>
        </div>

        <div class="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-500">{T.statsTotalKwh}</p>
          <p class="text-xl font-bold text-slate-800">{stats.totalKwh} <span class="text-sm font-normal text-slate-500">kWh</span></p>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-500">{T.statsAvgPerDay}</p>
          <p class="text-xl font-bold text-slate-800">{stats.avgKwhPerDay} <span class="text-sm font-normal text-slate-500">kWh</span></p>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-500">{T.statsAvgPerWeek}</p>
          <p class="text-xl font-bold text-slate-800">{stats.avgKwhPerWeek} <span class="text-sm font-normal text-slate-500">kWh</span></p>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-500">{T.statsAvgPerMonth}</p>
          <p class="text-xl font-bold text-slate-800">{stats.avgKwhPerMonth} <span class="text-sm font-normal text-slate-500">kWh</span></p>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-500">{T.statsAvgCostPerSession}</p>
          <p class="text-xl font-bold text-slate-800">{formatRupiah(stats.avgCostPerSession)}</p>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 col-span-2">
          <p class="text-xs text-slate-500">{T.statsTotalCost}</p>
          <p class="text-xl font-bold text-emerald-600">{formatRupiah(stats.totalCost)}</p>
        </div>

      </div>
    </div>

    <!-- Log tabel -->
    <div class="space-y-3">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.historyTitle}</p>
      <div class="space-y-2">
        {#each entries as entry (entry.id)}
          <div class="bg-white border border-slate-100 rounded-xl px-4 py-3 space-y-2 shadow-sm">

            {#if editingId === entry.id}
              <!-- Edit mode -->
              <div class="space-y-3">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.evModelNameLabel}</label>
                  <input type="text" bind:value={editEvModel}
                    class="px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200
                           rounded-xl outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.sessionDate}</label>
                    <input type="date" bind:value={editDate}
                      class="px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200
                             rounded-xl outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.sessionTime}</label>
                    <input type="time" bind:value={editTime}
                      class="px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200
                             rounded-xl outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                </div>
                <div class="flex gap-2">
                  <button on:click={() => saveEdit(entry)}
                    class="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors">
                    {T.saveSessionConfirm}
                  </button>
                  <button on:click={cancelEdit}
                    class="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                    {T.saveSessionCancel}
                  </button>
                </div>
              </div>

            {:else}
              <!-- View mode -->
              <div class="flex items-start justify-between gap-2">
                <div class="space-y-1 flex-1">
                  <p class="text-sm font-semibold text-slate-800">{entry.evModel}</p>
                  <p class="text-xs text-slate-400">{formatDate(entry.date, entry.time)}</p>
                </div>
                <span class="text-xs font-medium px-2 py-1 rounded-lg
                  {entry.location === 'home' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}">
                  {entry.location === 'home' ? T.locationHome : T.locationSpklu}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-slate-50 rounded-lg px-2 py-2">
                  <p class="text-xs text-slate-400">{T.colBattery}</p>
                  <p class="text-sm font-bold text-slate-700">{entry.batteryStart}% → {entry.batteryEnd}%</p>
                </div>
                <div class="bg-slate-50 rounded-lg px-2 py-2">
                  <p class="text-xs text-slate-400">{T.colEnergy}</p>
                  <p class="text-sm font-bold text-slate-700">{entry.energyFromGrid.toFixed(2)} kWh</p>
                </div>
                <div class="bg-slate-50 rounded-lg px-2 py-2">
                  <p class="text-xs text-slate-400">{T.colCost}</p>
                  <p class="text-sm font-bold text-slate-700">{formatRupiah(entry.cost)}</p>
                </div>
              </div>

              <div class="flex justify-end gap-2 pt-1">
                <button on:click={() => startEdit(entry)}
                  class="text-xs text-slate-500 hover:text-emerald-600 font-medium transition-colors px-2 py-1">
                  ✏️ {T.editEntry}
                </button>
                <button on:click={() => deleteEntry(entry.id)}
                  class="text-xs text-slate-500 hover:text-red-500 font-medium transition-colors px-2 py-1">
                  🗑️ {T.deleteEntry}
                </button>
              </div>
            {/if}

          </div>
        {/each}
      </div>
    </div>

  {/if}
</div>