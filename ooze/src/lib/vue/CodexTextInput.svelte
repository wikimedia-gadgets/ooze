<script lang="ts">
    import { CdxTextInput } from "@wikimedia/codex";
    import VueBridge from "./VueBridge.svelte";

    export let value = "";
    export let container: string | Element | undefined = undefined;
    export let props = {};

  </script>
  
  <VueBridge component={CdxTextInput} props={{
    modelValue: value,
    // @ts-ignore
    oninput: e => {
      value = e.target.value;
    },
    ...props
  }} bind:container />