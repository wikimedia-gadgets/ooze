<script lang="ts">
  import {
    cdxIconViewCompact,
    cdxIconSettings,
    cdxIconClose,
  } from "@wikimedia/codex-icons";

  import CodexToggleButton from "./vue/CodexToggleButton.svelte";
  import CodexIcon from "./vue/CodexIcon.svelte";
  import CodexButton from "./vue/CodexButton.svelte";

  const oozeVer = APP_VERSION;

  const placeHolderMenuItems = [
    "Edit Protection",
    "Watch for Edits",
    "Latest Revision",
    "Quick Remove",
    "Warn",
    "Report",
    "Block",
    "History",
  ];

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
        <p class="oozeMenuTitle">ooze v{oozeVer}</p>
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
      <div class="oozeMenuContent">
        <!-- Render placeholder actions -->
        {#each placeHolderMenuItems as item}
          <div class="oozeMenuItem">
            <CodexButton props={{
              size: "large",
              weight: "quiet",
              "aria-label": item,
            }}>
              {item}
            </CodexButton>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
