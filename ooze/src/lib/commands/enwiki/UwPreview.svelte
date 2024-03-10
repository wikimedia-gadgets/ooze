<!-- UW helper - previews -->
<script lang="ts">
  import enwikiWarnings from "./data/Warnings";
  const { warnings } = enwikiWarnings;
  export let argumentValues: string[];
  export let argumentNumber: number;
  export let commandInputValue: string;

  let realValues: string[] = [];
  let templateToPreview: string = "";
  let warningLevel: 1 | 2 | 3 | 4 | 5 | null | "notice" = null;
  let warningLevelInvalid: "invalid" | null = null;
  let currentWarning = null;

  $: if (argumentValues) {
    // Real values - trim any excess from argumentValues (i.e. over argumentNumber)
    // Then set realValues[argumentNumber] to commandInputValue
    realValues = argumentValues.slice(0, argumentNumber);
    realValues[argumentNumber] = commandInputValue;

    templateToPreview = realValues[1]; // Second value is the template name

    // Check if warning levels
    if (warnings[templateToPreview]) {
      const currentWarning = warnings[templateToPreview];
      if (currentWarning.type === "tiered" && currentWarning.levels?.length) {
        if (realValues[2]) {
          // Only set if realValues[2] is a number that contains a warning level available
          const requestedLevel = Number(realValues[2]) as 1 | 2 | 3 | 4 | 5;
          if (currentWarning.levels?.includes(requestedLevel)) {
            warningLevel = requestedLevel;
            warningLevelInvalid = null;
          } else {
            warningLevelInvalid = "invalid";
          }
        }
      } else {
        warningLevel = "notice";
      }
    } else {
      warningLevel = null;
    }
  }
</script>

<!-- Only show if argument number > 1 (template selected) -->
{#if argumentNumber > 1}
  {#if argumentNumber === 2}
    <!-- Available warning lessons for this -->
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
  {/if}
  {#if warningLevelInvalid === "invalid"}
    <p>Test</p>
  {:else}
    <div class="oozeSearchResults">
      <p>{JSON.stringify(realValues)}</p>
    </div>
  {/if}
{/if}
