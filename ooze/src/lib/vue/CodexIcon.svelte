<script lang="ts">
    import { CdxIcon} from "@wikimedia/codex";
    import VueBridge from "./VueBridge.svelte";
    export let icon: string;
  </script>
  
  <VueBridge component={CdxIcon} props={{
    icon: icon
  }}>
      <slot />
  </VueBridge>