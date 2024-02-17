<!-- 
Makes suggestions. Also rewrites value based on following shortcut (see UserSearchIntelShortucts.ts for example)

Just typing a space will enter the "recommended" value from the suggestions, which are as follows.
If on a userpage: .u - the last userpage visited will be this one
-->

<script lang="ts">
  import type LastEditorsOnPage from "../../../worker/functions/enwiki/LastEditorsOnPage";
  import { createEventDispatcher } from "svelte";
  import type { UserSearchIntelShortcut } from "./UserSearchIntelShortcuts";
  import UserSearchIntelShortcuts from "./UserSearchIntelShortcuts";
  import ClientWorkerCommunicationProvider from "../../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";

  const dispatch = createEventDispatcher();

  export let commandInputValue: string;

  let shortCutBeingTyped: UserSearchIntelShortcut | null = null;
  let shortCutReplacement: string | null = null;

  let isLoadingResultOfShortcut = false;
  let shortCutResultError: string | null = null;

  // If commandInputValue = ".me", then replace with current user
  async function update() {
    switch (commandInputValue.split(" ")[0]) {
      case ".me":
        shortCutBeingTyped = UserSearchIntelShortcuts.me;
        // Unlikely to be null, but if it is, use empty string
        // Note all helper functions must override the value via an event - it's the
        // parent component's job to handle the override
        // This won't be immediately shown but the change is made
        shortCutReplacement = mw.config.get("wgUserName") ?? "";
        dispatch("overrideInputValue", shortCutReplacement);
        break;
      case ".u":
        shortCutBeingTyped = UserSearchIntelShortcuts.u;
        isLoadingResultOfShortcut = true;
        break;
      case ".e":
        shortCutBeingTyped = UserSearchIntelShortcuts.e;
        isLoadingResultOfShortcut = true;

        const userResults = await ClientWorkerCommunicationProvider._.workerFunction<
          typeof LastEditorsOnPage
        >(
          "enwikiLastEditorsOnPage",
          mw.config.get("wgPageName"),
          1 // We only need the latest editor for this
        );

        if (userResults.length === 0) {
          shortCutResultError = "Page inaccessible";
          isLoadingResultOfShortcut = false;
          return;
        }

        isLoadingResultOfShortcut = false;
        shortCutReplacement = userResults[0];
        break;

      default:
        shortCutBeingTyped = null;
        shortCutReplacement = null;
        shortCutResultError = null;
        isLoadingResultOfShortcut = false;
    }
  }

  $: if (commandInputValue) update();
</script>

{#if shortCutBeingTyped}
  <div class="oozeShortCutHint">
    <span class="oozeShortCutDesc">{shortCutBeingTyped.description}:</span>

    {#if isLoadingResultOfShortcut}
      <span class="oozeShortCutHintLoading">...</span>
    {:else if shortCutResultError}
      <span class="oozeShortCutHintError">{shortCutResultError}</span>
    {:else}
      <span class="oozeShortCutHintPrefix">{shortCutReplacement}</span>
    {/if}
  </div>
{/if}
