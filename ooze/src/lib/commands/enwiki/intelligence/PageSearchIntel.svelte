<!-- Page search intel -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ClientWorkerCommunicationProvider from "../../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";
  import type GetPageVisitHistory from "../../../worker/functions/PageVisitHistory";

  const dispatch = createEventDispatcher();

  export let commandInputValue: string;

  let pendingChange: string | null = null;
  let shortcutTitle: string | null = null;

  let lastPage: Promise<ReturnType<typeof GetPageVisitHistory>> | Promise<never> = new Promise(() => {});

  $: if (commandInputValue == ".l") {
    lastPage = ClientWorkerCommunicationProvider._.workerFunction<typeof GetPageVisitHistory>('pageVisitHistory', 1, 1);
    pendingChange = "test";
    shortcutTitle = "Last page I visited";
  } else {
    pendingChange = null;
    shortcutTitle = null;
  }
</script>

{#if pendingChange !== null}
  <div class="oozeShortCutHint">
    <span class="oozeShortCutDesc">{shortcutTitle}:</span>

    {#await lastPage}
      <span class="oozeLoading">...</span>
    {:then page}
      {#if page.length > 0}
        <span class="oozeShortCutTitle">{page[0].pageName?.toString().replace(/_/g, " ")}</span>
      {:else}
        <span class="oozeShortCutHintError">Visit more pages before using this shortcut</span>
      {/if}
    {:catch error}
      <span class="oozeShortCutHintError">Error: {error.message}</span>
    {/await}
  </div>
{/if}
