<script>
  import { CdxMessage } from "@wikimedia/codex";
  import VueBridge from "./VueBridge.svelte";
  export let props = {};
</script>

<VueBridge component={CdxMessage} {props}>
    <slot />
</VueBridge>
