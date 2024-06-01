<script lang="ts">
  import { onMount } from "svelte";
  import ClientWorkerCommunicationProvider from "../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";
  import CodexMessage from "../../vue/CodexMessage.svelte";
  import type DeleteIndexedDb from "../../worker/functions/DeleteIndexedDb";

  async function deleteDb() {
    await ClientWorkerCommunicationProvider._.workerFunction<
        typeof DeleteIndexedDb
      >("deleteIndexedDB", true);
    
    alert("Database deleted. Page will reload.");
    location.reload();
  }

  // On mount exportDb
  onMount(() => {
    deleteDb();
  });
</script>

<CodexMessage
  props={{
    type: "warning",
  }}
>
  Once deleted, the page will reload.
</CodexMessage>
