<!-- UW helper - previews -->
<script lang="ts">
  import TemplatePreview from "./TemplatePreview.svelte";
  import enwikiWarnings, { type Warning } from "./data/Warnings";
  const { warnings } = enwikiWarnings;
  export let argumentValues: string[];
  export let argumentNumber: number;
  export let commandInputValue: string;

  let realValues: string[] = [];
  let templateToPreview: string | null = null;
  let warningLevel: 1 | 2 | 3 | 4 | 5 | null | "notice" = null;
  let warningLevelInvalid: "invalid" | null = null;
  let currentWarning: Warning | null = null;
  let userTalkPage: string | null = null;

  $: if (argumentValues) {
    // Real values - trim any excess from argumentValues (i.e. over argumentNumber)
    // Then set realValues[argumentNumber] to commandInputValue
    realValues = argumentValues.slice(0, argumentNumber);
    realValues[argumentNumber] = commandInputValue;

    templateToPreview = realValues[1]; // Second value is the template name

    // Check if warning levels

    // Set current warnings where preview matches the template
    currentWarning =
      Object.values(warnings).find(
        (warning) => warning.template === templateToPreview
      ) ?? null;

    if (
      currentWarning &&
      currentWarning.type === "tiered" &&
      currentWarning.levels?.length
    ) {
      userTalkPage = `User_talk:${realValues[0].replace(/ /g, "_")}`;
      if (realValues[2]) {
        // Only set if realValues[2] is a number that contains a warning level available
        const requestedLevel = Number(realValues[2]) as 1 | 2 | 3 | 4 | 5;
        if (
          currentWarning.levels?.includes(requestedLevel) ||
          currentWarning.levels?.length === 1
        ) {
          warningLevel =
            currentWarning.levels?.length === 1
              ? currentWarning.levels[0]
              : requestedLevel;
          warningLevelInvalid = null;

          templateToPreview = `${templateToPreview}${warningLevel === 5 ? "4im" : warningLevel}`;
        } else {
          warningLevelInvalid = "invalid";
          templateToPreview = null;
          userTalkPage = null;
        }
      }
    } else {
      warningLevel = "notice"; // this is so we can skip
    }
  }
</script>

<!-- Only show if argument number > 1 (template selected) -->
{#if argumentNumber >= 2}
  {#if warningLevelInvalid !== "invalid" && templateToPreview !== null && userTalkPage !== null}
  <!-- Additional args is every value after this one -->
    <TemplatePreview
      template={templateToPreview}
      pageToPreviewOn={userTalkPage}
      includeSignatures={true}
      className="oozeUwPreview"
      additionalArgs={realValues.slice(3)}
    />
  {/if}
{/if}
