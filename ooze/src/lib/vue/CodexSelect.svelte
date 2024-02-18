<script lang="ts">
  import { CdxSelect, type MenuItemData } from "@wikimedia/codex";
  import VueBridge from "./VueBridge.svelte";

  export let menuItems: MenuItemData[] = [];
  export let container: string | Element | undefined = undefined;
  export let props = {};
</script>

<VueBridge
  component={CdxSelect}
  props={{
    menuItems,
    ...props,
  }}
  bind:container
/>
