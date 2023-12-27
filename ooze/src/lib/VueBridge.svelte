<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { createApp, h, type App } from "vue";
  import { CdxButton } from "@wikimedia/codex";

  let vueInstance: App<Element> | undefined;
  let container: string | Element;

  let slotContainer: Element;

  // Define the props you want to pass
  export let props = {};

  // Whenever slot or props change, re-render the Vue component
  $: if (vueInstance && (props || slotContainer.innerHTML)) {
    vueInstance.unmount();
    vueInstance = createApp({
      render: renderFunc,
    });
    vueInstance.mount(container);
  }

  function renderFunc() {
    return h(CdxButton, props, () => slotContainer.innerHTML ?? "");
  }

  onMount(() => {
    vueInstance = createApp({
      render: renderFunc,
    });
    vueInstance.mount(container);
  });

  onDestroy(() => {
    vueInstance?.unmount();
  });
</script>

<div style="display:none;visibility:hidden;" bind:this={slotContainer}>
  <slot />
</div>

<div bind:this={container}></div>
