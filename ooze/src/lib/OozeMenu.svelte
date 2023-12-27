<script lang="ts">
  import {
    cdxIconViewCompact,
    cdxIconSettings,
    cdxIconClose,
  } from "@wikimedia/codex-icons";

  import CodexToggleButton from "./vue/CodexToggleButton.svelte";
  import CodexIcon from "./vue/CodexIcon.svelte";
  import CodexButton from "./vue/CodexButton.svelte";

  let menuOpen = false;
</script>

<!-- Mod Menu is shown in bottom left - "Ooze Tools" - when tapped or clicked this opens a big menu  -->
<div class="oozeMenuContainer">
  <CodexToggleButton
    props={{
      class: "oozeMenuButton",
      "aria-label": "OOZE Tool Menu",
    }}
    bind:toggled={menuOpen}
  >
    <CodexIcon icon={cdxIconViewCompact} />
  </CodexToggleButton>

  {#if menuOpen}
    <div class="cdx-card oozeMenu">
      <!-- Header/footer (at bottom, or on top on mobile) -->
      <div class="oozeMenuFooter">
        <p class="oozeMenuTitle">ooze v1.1.1</p>
        <div class="oozeButtons">
          <!-- Settings button -->
          <CodexButton props={{
            size: "large",
            weight: "quiet",
            "aria-label": "Open settings",
          }}>
            <CodexIcon icon={cdxIconSettings} />
          </CodexButton>
          <!-- Close button -->
          <CodexButton props={{
            size: "large",
            weight: "quiet",
            "aria-label": "Close menu",
            onclick: () => {
              menuOpen = false;
            },
          }}>
            <CodexIcon icon={cdxIconClose} />
          </CodexButton>
        </div>
      </div>

      <!-- Content -->
    </div>
  {/if}
</div>
