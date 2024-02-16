<!-- 
Makes suggestions. Also rewrites value based on following shortcut (see UserSearchIntelShortucts.ts for example)

Just typing a space will enter the "recommended" value from the suggestions, which are as follows.
If on a userpage: .u - the last userpage visited will be this one
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { UserSearchIntelShortcut } from "./UserSearchIntelShortcuts";
  import UserSearchIntelShortcuts from "./UserSearchIntelShortcuts";

  const dispatch = createEventDispatcher();

  export let commandInputValue: string;

  let shortCutBeingTyped: UserSearchIntelShortcut | null = null;
  let shortCutReplacement: string | null = null;

  // If commandInputValue = ".me", then replace with current user
  $: switch (commandInputValue.split(" ")[0]) {
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
      shortCutReplacement = "Last userpage visited";
      break;
    default:
      shortCutBeingTyped = null;
      shortCutReplacement = null;
  }
</script>

{#if shortCutBeingTyped}
  <div class="oozeShortCutHint">
    <span class="oozeShortCutDesc">{shortCutBeingTyped.description}:</span>
    <span class="oozeShortCutHintPrefix">{shortCutReplacement}</span>
  </div>
{/if}
