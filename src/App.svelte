<script>
  import { DEFAULTS } from './lib/constants.js';
  import { validateShared, validateTarget, validateTime } from './lib/validation.js';
  import SharedInputs from './components/SharedInputs.svelte';
  import ModeTarget from './components/ModeTarget.svelte';
  import ModeTime from './components/ModeTime.svelte';
  import ModeBudget from './components/ModeBudget.svelte';
  import Tooltip from './components/Tooltip.svelte';
  import { SPKLU_TARIFF, PBJT_TL_RATE, HOME_TARIFFS } from './lib/constants.js';
  import { persisted, persist } from './lib/persist.js';

  let batteryCapacity  = persisted('batteryCapacity', DEFAULTS.batteryCapacity);
  let currentBattery   = persisted('currentBattery', DEFAULTS.currentBattery);
  let tariffPerKwh     = persisted('tariffPerKwh', DEFAULTS.tariffPerKwh);
  let chargerPower     = persisted('chargerPower', DEFAULTS.chargerPower);
  let targetBattery    = persisted('targetBattery', DEFAULTS.targetBattery);
  let availableHours   = persisted('availableHours', DEFAULTS.availableHours);
  let availableMinutes = persisted('availableMinutes', DEFAULTS.availableMinutes);
  let budget           = persisted('budget', DEFAULTS.budget);
  let location         = persisted('location', 'spklu');
  let activeTab        = persisted('activeTab', 'target');
  let selectedEV       = persisted('selectedEV', 'custom');

  $: shared      = validateShared({ batteryCapacity, chargerPower, currentBattery });
  $: sharedValid = Object.values(shared).every(e => e === '');
  $: targetBatteryError = validateTarget({ targetBattery, currentBattery });
  $: timeErrors  = validateTime({ availableHours, availableMinutes });
  $: activePBJTRate = location === 'spklu' ? PBJT_TL_RATE : 0;

  $: persist('batteryCapacity', batteryCapacity);
  $: persist('currentBattery', currentBattery);
  $: persist('tariffPerKwh', tariffPerKwh);
  $: persist('chargerPower', chargerPower);
  $: persist('targetBattery', targetBattery);
  $: persist('availableHours', availableHours);
  $: persist('availableMinutes', availableMinutes);
  $: persist('budget', budget);
  $: persist('location', location);
  $: persist('activeTab', activeTab);
  $: persist('selectedEV', selectedEV);

  const tabs = [
    {
      id: 'target',
      label: '🎯 Target Baterai',
      tooltip: 'Tentukan target % baterai yang ingin dicapai. App akan menghitung energi, waktu, dan biaya yang dibutuhkan.',
    },
    {
      id: 'time',
      label: '⏱️ Waktu Pengisian',
      tooltip: 'Masukkan berapa lama waktu yang tersedia untuk mengisi daya. App akan menghitung seberapa penuh baterai dan biayanya.',
    },
    {
      id: 'budget',
      label: '💰 Anggaran',
      tooltip: 'Masukkan anggaran biaya yang dimiliki. App akan menghitung energi dan % baterai yang bisa didapat.',
    },
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
      bind:location bind:selectedEV
      batteryCapacityError={shared.batteryCapacityError}
      chargerPowerError={shared.chargerPowerError}
      currentBatteryError={shared.currentBatteryError}
    />

  <!-- Tab Switcher -->
    <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-2 flex gap-2">
      {#each tabs as tab}
        <div class="flex-1 flex flex-col items-center gap-1">
          <button
            class="w-full py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200
              {activeTab === tab.id ? 'bg-emerald-500 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}"
            on:click={() => activeTab = tab.id}>
            {tab.label}
          </button>
          <Tooltip text={tab.tooltip} />
        </div>
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
            pbjt_rate={activePBJTRate}
            {selectedEV}
          />
        {:else if activeTab === 'time'}
          <ModeTime
            {batteryCapacity} {currentBattery} {chargerPower} {tariffPerKwh} {selectedEV}
            bind:availableHours bind:availableMinutes
            availableHoursError={timeErrors.availableHoursError}
            availableMinutesError={timeErrors.availableMinutesError}
            timeError={timeErrors.timeError}
            {sharedValid}
            pbjt_rate={activePBJTRate}
          />
        {:else if activeTab === 'budget'}
          <ModeBudget
            {batteryCapacity} {currentBattery} {chargerPower} {tariffPerKwh} {selectedEV}
            bind:budget
            {sharedValid}
            pbjt_rate={activePBJTRate}
          />
        {/if}
      </div>
    </div>

  </main>
</div>