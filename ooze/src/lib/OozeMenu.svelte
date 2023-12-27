<script lang="ts">
  import {
    cdxIconViewCompact,
    cdxIconSettings,
    cdxIconClose,
    cdxIconLock,
  } from "@wikimedia/codex-icons";
  import VueBridge from "./vue/VueBridge.svelte";
  import CodexButton from "./vue/CodexButton.svelte";
  import CodexToggleButton from "./vue/CodexToggleButton.svelte";
  import CodexIcon from "./vue/CodexIcon.svelte";

  let count = 0;
</script>

<!-- Mod Menu is shown in bottom left - "Ooze Tools" - when tapped or clicked this opens a big menu  -->
<div class="oozeMenuContainer">
  <CodexToggleButton props={{
    class: "oozeMenuButton",
    "aria-label": "OOZE Tool Menu"
  }}>
    <CodexIcon icon={cdxIconViewCompact} />
  </CodexToggleButton>

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

<CodexButton props={{
  onclick: () => {
    count++;
  },
}}>
  Hey there! I'm a button! I've been clicked {count} times!
</CodexButton>
