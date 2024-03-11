<!--
    Auto advances warning level if this is a non-tiered warning
    Otherwise, shows available warning levels for the selected warning
-->
<!-- Todo: Decide how this will work on the easy UI - if the UI calls force advance maybe hide it? -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import enwikiWarnings, { type Warning } from "../data/Warnings";

  export let argumentValues: string[];
  export let commandInputValue: string; // Do not remove, required for proper change detection

  let warningTemplate: string = argumentValues[1];
  let currentWarning: Warning | null = null;

  const { warnings } = enwikiWarnings;
  const dispatch = createEventDispatcher();

  $: if (argumentValues.length > 1) {
    warningTemplate = argumentValues[1];

    // Find the warning template
    currentWarning =
      Object.values(warnings).find(
        (warning) => warning.template === warningTemplate
      ) ?? null;

    if (currentWarning) {
      if (currentWarning.type !== "tiered") {
        // If the warning is not tiered, advance the warning level
        dispatch("forceAdvanceParam");
      } else if (currentWarning.levels?.length === 1) {
        // If the warning is tiered and only has one level, advance the warning level. We can pick our only option later.
        dispatch("forceAdvanceParam");
      }
    }
  }
</script>

{#if currentWarning != null}
  <!-- Available warning levels for this -->
  <span class="oozeSearchResultMoreInfo noClamp">
    {#if currentWarning.type === "tiered" && currentWarning.levels}
      {#each ["", ...currentWarning.levels] as tier}
        <button
          class="oozeSearchResultWarningLevel {{
            "": 'warningLevelAuto',
            1: 'warningLevelNotice',
            2: 'warningLevelCaution',
            3: 'warningLevelWarning',
            4: 'warningLevelFinalWarning',
            5: 'warningLevelFinalWarning',
          }[tier]} {commandInputValue === tier.toString() ? 'active' : ''}"
          on:click={() => {
            dispatch("setInputValue", tier);
            commandInputValue = tier.toString(); // Required for change detection
          }}
        >
          &bull; <strong
            >{tier}
            {({
              "": "Auto",
              1: "Notice",
              2: "Caution",
              3: "Warning",
              4: "Final warning",
              5: "Only warning",
            })[tier]}
          </strong></button
        >
      {/each}
    {/if}
  </span>
{/if}
