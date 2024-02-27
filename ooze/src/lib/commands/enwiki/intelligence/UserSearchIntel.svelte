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
  import UserFilterCreator from "./UserFilters/UserFilterCreator.svelte";
  import type UsersSearch from "../../../worker/functions/enwiki/UsersSearch";

  const dispatch = createEventDispatcher();

  export let commandInputValue: string;

  let shortCutBeingTyped: UserSearchIntelShortcut | null = null;
  let shortCutReplacement: string | null = null;

  let isLoadingResultOfShortcut = false;
  let shortCutResultError: string | null = null;

  // To render to help with parameters, i.e. creating user filters
  let helperComponent: any = null;

  // If commandInputValue = ".me", then replace with current user

  // Throttle - only update 400ms after last keypress
  let shortCutTimeout: NodeJS.Timeout | null = null;

  $: update = async () => {
    const split = commandInputValue.split(" ");
    switch (split[0]) {
      case ".sb":
        // Sandbox for User Warnings
        shortCutBeingTyped = UserSearchIntelShortcuts.sb;
        shortCutReplacement = "Sandbox for User Warnings";
        isLoadingResultOfShortcut = false;
        dispatch("overrideInputValue", shortCutReplacement);
        break;
      case ".me":
        shortCutBeingTyped = UserSearchIntelShortcuts.me;
        // Unlikely to be null, but if it is, use empty string
        // Note all helper functions must override the value via an event - it's the
        // parent component's job to handle the override
        // This won't be immediately shown but the change is made
        shortCutReplacement = mw.config.get("wgUserName") ?? "";
        dispatch("overrideInputValue", shortCutReplacement);
        isLoadingResultOfShortcut = false;
        break;
      case ".u":
        shortCutBeingTyped = UserSearchIntelShortcuts.u;
        isLoadingResultOfShortcut = true;
        break;
      case ".e":
        shortCutBeingTyped = UserSearchIntelShortcuts.e;
        isLoadingResultOfShortcut = true;

        let pageName = mw.config.get("wgPageName");

        if (split.length > 1) {
          // Page name is provided
          shortCutBeingTyped = UserSearchIntelShortcuts["e-p1"];
          pageName = split[1]; // Use _ instead of space

          if (pageName.length === 0) {
            // Default this page if no page is provided
            pageName = mw.config.get("wgPageName");
          }
        }

        // User filters
        if (split.length == 3) {
          shortCutBeingTyped = UserSearchIntelShortcuts["e-p2"];
          helperComponent = UserFilterCreator;
          shortCutResultError = "Invalid user filter";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");
          return;
        } else {
          helperComponent = null;
        }

        if (split.length > 3) {
          shortCutResultError = "Too many arguments";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");
          return;
        }

        const userResults =
          await ClientWorkerCommunicationProvider._.workerFunction<
            typeof LastEditorsOnPage
          >(
            "enwikiLastEditorsOnPage",
            pageName,
            1 // We only need the latest editor for this
          );

        if (userResults.length === 0) {
          shortCutResultError = "Page inaccessible";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");

          console.warn("No results for page", pageName);
          return;
        }

        shortCutResultError = null;
        isLoadingResultOfShortcut = false;
        shortCutReplacement = userResults[0];
        dispatch("overrideInputValue", shortCutReplacement);
        break;

      default:
        shortCutBeingTyped = null;
        shortCutReplacement = null;
        shortCutResultError = null;
        helperComponent = null;

        isLoadingResultOfShortcut = false;
        // Remove any queued overrides
        dispatch("resetInputValue");

        // Run a basic search
        console.log(
          await ClientWorkerCommunicationProvider._.workerFunction<
            typeof UsersSearch
          >("enwikiUsersSearch", commandInputValue)
        );
    }
  };

  $: if (commandInputValue.length !== -1) {
    isLoadingResultOfShortcut = true;
    // Throttle - only update 400ms after last keypress
    if (shortCutTimeout) {
      clearTimeout(shortCutTimeout);
    }
    shortCutTimeout = setTimeout(() => update(), 350);
  }

  // When arg requested
  function updateArgEvent(event: CustomEvent<string>) {
    console.log("updateArgEvent", event.detail);

    // Put together based on split at space, but replace the last part with the new value
    const split = commandInputValue.split(" ");

    split.pop();
    split.push(event.detail);

    dispatch("setInputValue", split.join(" "));
  }
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

  {#if helperComponent}
    <div class="oozeShortCutHelper">
      <svelte:component
        this={helperComponent}
        argString={// Arg string is the last part of the command input value
        commandInputValue.split(" ").pop()}
        on:updateArgString={updateArgEvent}
      />
    </div>
  {/if}
{/if}
