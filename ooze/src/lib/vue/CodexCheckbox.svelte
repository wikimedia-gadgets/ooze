<script>
    import { CdxCheckbox } from "@wikimedia/codex";
    import VueBridge from "./VueBridge.svelte";
    export let toggled = false;
    export let props = {};
  </script>
  
  <VueBridge component={CdxCheckbox} props={{
    modelValue: toggled,
    onclick: () => {
      toggled = !toggled;
    },
    ...props
  }}>
      <slot />
  </VueBridge>
  