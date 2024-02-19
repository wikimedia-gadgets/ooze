<script lang="ts">
  import { CdxSelect, type MenuItemData } from "@wikimedia/codex";
  import VueBridge from "./VueBridge.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let menuItems: MenuItemData[] = [];
  export let selected: string | number | null = null;
  export let container: string | Element | undefined = undefined;
  export let props = {};

  function updateSelected(e: Event) {
    alert("updateSelected");
    dispatch("select", (e.target as HTMLSelectElement).value);
  }
</script>

<VueBridge
  component={CdxSelect}
  props={{
    menuItems,
    selected,
    on: {
      'update:selected': updateSelected,
    },
    ...props,
  }}
  bind:container
/>
