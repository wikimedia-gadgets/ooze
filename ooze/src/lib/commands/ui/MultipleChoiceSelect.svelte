<!--
    Multiple choice select - allows dropdown selection in a similar way to - but we use radio buttons instead of Codex select - better readability
    and usability on mobile. Descriptions are in tooltips instead
-->

<script lang="ts">
  import type { MenuItemData } from "@wikimedia/codex";
  import { createEventDispatcher } from "svelte";

  // Options is a record of key value pairs, where the key is the value and the value is the label
  export let options: MenuItemData[];
  export let selected: string | number = "";

  const dispatch = createEventDispatcher();
  $: dispatch("select", selected);
</script>

<form class="oozeMultipleChoiceSelect">
  {#each options as option}
    <span class="cdx-radio cdx-radio--inline">
      <input
        type="radio"
        class="cdx-radio__input"
        on:change={() => {
          selected = option.value;
        }}
        checked={selected === option.value}
        name="oozeMultipleChoiceSelect"
      />
      <!-- Codex styling has empty class instead of pseudo-element -->
      <span class="cdx-radio__icon"></span>

      <label class="cdx-radio__label" for="oozeMultipleChoiceSelect">{option.label}</label>
    </span>
  {/each}
</form>
