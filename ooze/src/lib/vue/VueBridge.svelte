<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { createApp, h, ref, watch, type App, type DefineComponent } from "vue";

  // Cursed
  export let component: DefineComponent<any, any, any, any, any, any, any, any, any, any, any, any, any>;

  let vueInstance: App<Element> | undefined;
  export let container: string | Element | undefined = undefined;

  let slotContainer: Element;

  // Define the props you want to pass
  export let props = {};

  // Create a Vue ref for the props
  let propsRef = ref(props);

  // Whenever props change, update the Vue ref
  $: propsRef.value = props;

  // Create a variable that changes every time the slot content changes
  let slotContentChangeTracker = 0;
  $: slotContentChangeTracker++;

  // Create a reactive statement that depends on slotContentChangeTracker
  $: {
    console.log(slotContainer?.innerHTML ?? "");
  }

  function renderFunc() {
    return h(component, propsRef.value, {
      default: () => h('div', { innerHTML: slotContainer.innerHTML ?? "" })
    });
  }

  onMount(() => {
    if (!container) return;
    vueInstance = createApp({
      setup() {
        // Watch for changes in the props ref and re-render when it changes
        watch(propsRef, () => {
          renderFunc();
        }, { immediate: true });

        return {};
      },
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