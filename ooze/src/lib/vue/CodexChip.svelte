<script>
  import { CdxInfoChip } from "@wikimedia/codex";
  import VueBridge from "./VueBridge.svelte";
  export let props = {};
</script>

<VueBridge component={CdxInfoChip} {props}>
    <slot />
</VueBridge>
