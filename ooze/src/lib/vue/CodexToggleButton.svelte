<script>
    import { CdxToggleButton } from "@wikimedia/codex";
    import VueBridge from "./VueBridge.svelte";
    export let props = {};
  </script>
  
  <VueBridge component={CdxToggleButton} {props}>
      <slot />
  </VueBridge>
  