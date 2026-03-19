<script>
  import { DEFAULTS } from './lib/constants.js';
  import { validateShared, validateTarget, validateTime } from './lib/validation.js';
  import SharedInputs from './components/SharedInputs.svelte';
  import ModeTarget from './components/ModeTarget.svelte';
  import ModeTime from './components/ModeTime.svelte';
  import ModeBudget from './components/ModeBudget.svelte';

  let activeTab = 'target';

  let batteryCapacity  = DEFAULTS.batteryCapacity;
  let currentBattery   = DEFAULTS.currentBattery;
  let tariffPerKwh     = DEFAULTS.tariffPerKwh;
  let chargerPower     = DEFAULTS.chargerPower;
  let targetBattery    = DEFAULTS.targetBattery;
  let availableHours   = DEFAULTS.availableHours;
  let availableMinutes = DEFAULTS.availableMinutes;
  let budget           = DEFAULTS.budget;

  $: shared      = validateShared({ batteryCapacity, chargerPower, currentBattery, tariffPerKwh });
  $: sharedValid = Object.values(shared).every(e => e === '');
  $: targetBatteryError = validateTarget({ targetBattery, currentBattery });
  $: timeErrors  = validateTime({ availableHours, availableMinutes });

  const tabs = [
    { id: 'target', label: '🎯 Target Baterai' },
    { id: 'time',   label: '⏱️ Waktu Tersedia' },
    { id: 'budget', label: '💰 Anggaran' },
  ];

  $: modeTitle = tabs.find(t => t.id === activeTab)?.label ?? '';
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 font-sans">

  <header class="bg-white/80 backdrop-blur border-b border-emerald-100 shadow-sm sticky top-0 z-10">
    <div class="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
      <div class="bg-emerald-500 text-white rounded-xl p-2 shadow">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-slate-800 leading-tight">EV Charging Calculator</h1>
        <p class="text-xs text-slate-400">Hitung biaya & waktu pengisian daya</p>
      </div>
    </div>
  </header>

  <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">

    <SharedInputs
      bind:batteryCapacity bind:currentBattery bind:tariffPerKwh bind:chargerPower
      batteryCapacityError={shared.batteryCapacityError}
      chargerPowerError={shared.chargerPowerError}
      currentBatteryError={shared.currentBatteryError}
      tariffError={shared.tariffError}
    />

    <!-- Tab Switcher -->
    <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-2 flex gap-2">
      {#each tabs as tab}
        <button
          class="flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200
            {activeTab === tab.id ? 'bg-emerald-500 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}"
          on:click={() => activeTab = tab.id}>
          {tab.label}
        </button>
      {/each}
    </div>

    <!-- Card Mode -->
    <div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
      <div class="bg-slate-800 px-6 py-4">
        <h2 class="text-white font-semibold text-base tracking-wide">
          {modeTitle}
        </h2>
      </div>
      <div class="p-6 space-y-5">
        {#if activeTab === 'target'}
          <ModeTarget
            {batteryCapacity} {currentBattery} {chargerPower} {tariffPerKwh}
            bind:targetBattery {targetBatteryError} {sharedValid}
          />
        {:else if activeTab === 'time'}
          <ModeTime
            {batteryCapacity} {currentBattery} {chargerPower} {tariffPerKwh}
            bind:availableHours bind:availableMinutes
            availableHoursError={timeErrors.availableHoursError}
            availableMinutesError={timeErrors.availableMinutesError}
            timeError={timeErrors.timeError}
            {sharedValid}
          />
        {:else if activeTab === 'budget'}
          <ModeBudget
            {batteryCapacity} {currentBattery} {chargerPower} {tariffPerKwh}
            bind:budget
            {sharedValid}
          />
        {/if}
      </div>
    </div>

    <p class="text-center text-xs text-slate-400 pb-4">
      Tarif dasar PLN · PBJT-TL Rp6.660,31 (tetap) · Data bersifat estimasi
    </p>

  </main>
</div>