<script lang="ts">
  import {
    cdxIconViewCompact,
    cdxIconSettings,
    cdxIconClose,
    cdxIconLock,
  } from "@wikimedia/codex-icons";
  import VueBridge from "./VueBridge.svelte";

  let count = 0;
</script>

<!-- Mod Menu is shown in bottom left - "Ooze Tools" - when tapped or clicked this opens a big menu  -->
<div class="oozeMenuContainer">
  <cdx-toggle-button class="oozeMenuButton" aria-label="OOZE Tool Menu">
    <cdx-icon icon={cdxIconViewCompact} />
  </cdx-toggle-button>

  <div class="cdx-card oozeMenu">
    <!-- Header/footer (at bottom, or on top on mobile) -->
    <div class="oozeMenuFooter">
      <p class="oozeMenuTitle">ooze v1.1.1</p>
      <div class="oozeButtons">
        <!-- Settings button -->
        <cdx-button size="large" weight="quiet" aria-label="OOZE Settings">
          <cdx-icon icon={cdxIconSettings} />
        </cdx-button>
        <!-- Close button -->
        <cdx-button size="large" weight="quiet" aria-label="Close menu">
          <cdx-icon icon={cdxIconClose} />
        </cdx-button>
      </div>
    </div>

    <!-- Content -->
  </div>
</div>

<VueBridge
  props={{
    "onclick": () => {
      count++;
    },
  }}
>
  Counter is {count}
</VueBridge>
