<script lang="ts">
  import { CdxInfoChip } from "@wikimedia/codex";
  import VueBridge from "./VueBridge.svelte";
  export let props = {};

  export let scrollIntoView = false;

  let ref: HTMLDivElement;

  $: if (scrollIntoView && ref) {
    // Active chips are scrolled into view
    ref.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }
</script>

<VueBridge component={CdxInfoChip} {props} bind:container={ref}>
    <slot />
</VueBridge>
