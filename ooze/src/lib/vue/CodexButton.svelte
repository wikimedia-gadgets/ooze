<script>
  import { CdxButton } from "@wikimedia/codex";
  import VueBridge from "./VueBridge.svelte";
  export let props = {};
</script>

<VueBridge component={CdxButton} {props}>
    <slot />
</VueBridge>
