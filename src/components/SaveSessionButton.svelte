<script>
  import SaveSessionModal from './SaveSessionModal.svelte';

  export let T;
  export let sessionData;
  export let disabled = false;

  let showModal = false;
  let showSuccess = false;

  function onSaved() {
    showSuccess = true;
    setTimeout(() => showSuccess = false, 3000);
  }
</script>

{#if showSuccess}
  <div class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    <p class="text-xs text-emerald-700 font-medium">{T.saveSessionSuccess}</p>
  </div>
{:else}
  <button
    on:click={() => showModal = true}
    {disabled}
    class="w-full py-3 rounded-xl text-sm font-semibold border-2 border-emerald-500
           text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
    </svg>
    {T.saveSession}
  </button>
{/if}

{#if showModal}
  <SaveSessionModal
    {T}
    {sessionData}
    onClose={() => showModal = false}
    {onSaved}
  />
{/if}