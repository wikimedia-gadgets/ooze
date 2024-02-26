<script lang="ts">
  import CodexCheckbox from "../../../../vue/CodexCheckbox.svelte";
  import CodexToggleButton from "../../../../vue/CodexToggleButton.svelte";
  import MultipleChoiceSelect from "../../../ui/MultipleChoiceSelect.svelte";
  import type { UserFilter } from "./UserFilters";
  import { createEventDispatcher } from "svelte";

  export let filter: UserFilter;
  export let exclude: boolean = false;
  export let filterEnabled: boolean = false;
  export let selected: string | number = filter?.menuItems[0]?.value;

  const dispatch = createEventDispatcher();

  let customValueMode = false; // When this is true, require the filter to be edited manually

  // If selected is not in the menu items, we're in custom value mode
  // Exclusion for those with no options
  $: if (filter.menuItems.length === 0 && (selected != "" || selected != null)) {
    customValueMode = false;
  } else {
    if (selected === "" || selected == null) {
      selected = filter.menuItems[0]?.value;
    } else {
      customValueMode = !filter.menuItems.some((item) => item.value === selected);
    }
  }

  $: if (customValueMode) {
    filterEnabled = true;
  }

  // On state changing, send an event with filter enabled, excluded, and the selected value
  $: if (!customValueMode) dispatch("filterChange", {
    enabled: filterEnabled,
    exclude,
    value: selected,
  });
</script>

<div class="oozeUserFilterCreatorGroup">
  <div class="oozeUserFilterCreatorItem">
    <!--
          Good faith filter result examples:
          - Include users with good faith score over 90%: +goodfaith:90
          - Exclude users with good faith score over 90%: -goodfaith:90
  
          An example that would show only users with low good faith and high vandalism scores:
          -goodfaith:90,+vandalism:90
      -->
    <CodexCheckbox
      bind:toggled={filterEnabled}
      props={{
        disabled: customValueMode,
      }}
    />
    <span>{filter.title}</span>
  </div>
  {#if filterEnabled && !customValueMode}
    <CodexToggleButton bind:toggled={exclude}>
      {exclude ? "Exclude" : "Include"}
    </CodexToggleButton>
    <!-- This will be flex wrapped -->
    <div class="oozeUserFilterCreatorFilter">
      <MultipleChoiceSelect options={filter.menuItems} bind:selected on:select={
        ({ detail }) => {
          selected = detail;
        }
      } />
    </div>
  {/if}

  {#if customValueMode}
    <span class="oozeCustomisedValue"> custom </span>
  {/if}
</div>
