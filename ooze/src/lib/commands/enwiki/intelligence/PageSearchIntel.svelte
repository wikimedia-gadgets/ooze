<!-- Page search intel -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ClientWorkerCommunicationProvider from "../../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";
  import type GetPageVisitHistory from "../../../worker/functions/PageVisitHistory";

  const dispatch = createEventDispatcher();

  export let commandInputValue: string;

  let pendingChange: string | null = null;
  let shortcutTitle: string | null = null;

  let lastPage = ClientWorkerCommunicationProvider._.workerFunction<typeof GetPageVisitHistory>('pageVisitHistory', 1, 1);

  $: if (commandInputValue == ".p") {
    pendingChange = "test";
    shortcutTitle = "Last page";
  }
</script>

{#if pendingChange}
  <div class="oozeShortCutHint">
    <span class="oozeShortCutDesc">{shortcutTitle}:</span>

    {#await lastPage}
      <span class="oozeLoading">...</span>
    {:then page}
      {#if page.length > 0}
        <span class="oozeShortCutTitle">{page[0].pageName}</span>
      {:else}
        <span class="oozeError">Visit more pages first</span>
      {/if}
    {:catch error}
      <span class="oozeError">Error: {error.message}</span>
    {/await}
  </div>
{/if}
