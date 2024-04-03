<script lang="ts">
  import { onMount } from "svelte";
  import ClientWorkerCommunicationProvider from "../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";
  import CodexMessage from "../../vue/CodexMessage.svelte";
  import type ExportSqliteDb from "../../worker/functions/ExportSqliteDb";

  async function exportDb() {
    console.log("getting blob");
    const dbStream =
      await ClientWorkerCommunicationProvider._.workerFunction<
        typeof ExportSqliteDb
      >("exportSqlDb");
    console.log("got blob");

    // Make blob from stream
    const blob = new Blob([dbStream], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    console.log("[ooze] Created blob URL", url);

    // Open blob in new tab
    window.location.href = url;
  }

  // On mount exportDb
  onMount(() => {
    exportDb();
  });
</script>

<CodexMessage
  props={{
    type: "warning",
  }}
>
  Database contents may be sensitive. Please be careful when sharing!
</CodexMessage>
