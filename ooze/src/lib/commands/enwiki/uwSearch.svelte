<!-- Search user warnings -->
<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import enwikiWarnings from "./data/Warnings";
  const { warnings } = enwikiWarnings;
  const dispatch = createEventDispatcher();

  export let commandInputValue: string;
  let searchResults = warnings;

  function setValue() {
    // If no results, reset input value
    if (Object.keys(searchResults).length === 0) {
      dispatch("resetInputValue");
    } else {
      // Else, make the template of the first result the input value
      dispatch("overrideInputValue", Object.values(searchResults)[0].template);
    }
  }

  $: if (commandInputValue.length > 0) {
    // Only return if either template or name includes the input value
    searchResults = Object.fromEntries(
      Object.entries(warnings).filter(
        ([, warning]) =>
          warning.template.includes(commandInputValue) ||
          warning.name.includes(commandInputValue)
      )
    );
    setValue();
  }

  $: if (commandInputValue.length === 0) {
    searchResults = warnings;
  }

  // On mount, always set the input value to the first result
  onMount(()=>{
    // Todo: default top item needs to be the recommended for the user, i.e. if last reverted
    setValue();
  });
</script>

<div class="oozeSearchResults">
  {#each Object.values(searchResults) as warning}
    <div class="oozeSearchResult searchResultCol">
      {warning.name}
      <span class="oozeSearchResultMoreInfo">
        Template: {warning.template} <br />
        Available templates:
        {#if warning.type === "tiered" && warning.levels}
          {#each warning.levels as tier}
            <span
              class="oozeSearchResultWarningLevel {{
                1: 'warningLevelNotice',
                2: 'warningLevelCaution',
                3: 'warningLevelWarning',
                4: 'warningLevelFinalWarning',
                5: 'warningLevelFinalWarning',
              }[tier]}"
            >
              &bull;
              {warning.template}{tier == 5 ? "4im" : tier}
            </span>
          {/each}
        {/if}
      </span>
    </div>
  {:else}
  <!-- No Results - only shown if value is not empty -->
    {#if commandInputValue.length > 0}
    <div class="oozeSearchError">
      No results. If you'd like a template added, please let us know.
    </div>
    {/if}
  {/each}
</div>
