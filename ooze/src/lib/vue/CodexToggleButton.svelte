<script>
    import { CdxToggleButton } from "@wikimedia/codex";
    import VueBridge from "./VueBridge.svelte";
    export let toggled = false;
    export let props = {};
  </script>
  
  <VueBridge component={CdxToggleButton} props={{
    modelValue: toggled,
    onclick: () => {
      toggled = !toggled;
    },
    ...props
  }}>
      <slot />
  </VueBridge>
  