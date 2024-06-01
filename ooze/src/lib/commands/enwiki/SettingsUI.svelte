<!-- Main settings UI -->

<script lang="ts">
  import { onMount } from "svelte";
  import ClientWorkerCommunicationProvider from "../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";
  import type GetStorageAvailToOozeWorker from "../../worker/functions/GetStorageAvailToOozeWorker";

    let workerStorage: ReturnType<typeof GetStorageAvailToOozeWorker> | undefined;

    onMount(() => {
       workerStorage = ClientWorkerCommunicationProvider._.workerFunction<typeof GetStorageAvailToOozeWorker>("getStorage");
    });
</script>

<h4>OOZE Settings</h4>
<p>Welcome to OOZe.</p>

{#await workerStorage}
    <p>Loading...</p>
{:then storage}
    <p>Storage available: {JSON.stringify(storage)} bytes</p>
    <p>Delete DB by running .db_del</p>
{:catch error}
    <p>Failed to load storage information: {error.message}</p>
{/await}
    