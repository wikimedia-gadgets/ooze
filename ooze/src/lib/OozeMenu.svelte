<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    cdxIconViewCompact,
    cdxIconSettings,
    cdxIconClose,
    cdxIconFunctionArgument,
  } from "@wikimedia/codex-icons";

  import CodexToggleButton from "./vue/CodexToggleButton.svelte";
  import CodexIcon from "./vue/CodexIcon.svelte";
  import CodexButton from "./vue/CodexButton.svelte";
  import CodexTextInput from "./vue/CodexTextInput.svelte";
  import { Commands } from "./commands/enwiki/Commands";
  import CodexMessage from "./vue/CodexMessage.svelte";
  import type { Command } from "./commands/Command";
  import CodexChip from "./vue/CodexChip.svelte";
  import OozeUiWrapper from "./OozeUIWrapper.svelte";

  const oozeVer = APP_VERSION;

  let commandInputValue = "";

  let commandBeingTyped: Command | undefined = undefined;

  let firstCommandNotFound = false;

  let commandPalletInputIcon = cdxIconFunctionArgument;
  let commandPalletPlaceholder = "Type a command, or use the buttons below";

  // Argument number - used to handle input for commands and arguments. -1 means waiting for command
  let argumentNumber = -1;

  $: if (commandBeingTyped && commandBeingTyped.arguments) {
    commandPalletInputIcon =
      commandBeingTyped.arguments[argumentNumber].icon ??
      cdxIconFunctionArgument;

    commandPalletPlaceholder = commandBeingTyped.arguments[argumentNumber]
      .placeholder ?? `Enter ${commandBeingTyped.arguments[argumentNumber].name}`;
  }

  // On command input change
  $: if (commandInputValue !== "") {
    // If last character is a space and the command is found in the commands list, run the command
    const command = Commands[commandInputValue.trim()];
    if (commandInputValue[commandInputValue.length - 1] === " ") {
      switch (argumentNumber) {
        case -1:
          // If argument number is -1, we are waiting for an argument
          if (command) {
            firstCommandNotFound = false;
            commandBeingTyped = command;
            commandInputValue = "";
            argumentNumber = 0;
          } else {
            console.log("Command not found!");
            firstCommandNotFound = true;
          }
          break;
        default:
          argumentNumber++;
          commandInputValue = "";
          break;
      }
    }
  }

  // Reset first command not found when command input is cleared
  $: if (commandInputValue === "") {
    firstCommandNotFound = false;
  }

  let menuOpen = false;

  let textInput: Element | undefined = undefined;

  // Window - when / key is pressed, open the menu
  const menuKeyListener = (e: KeyboardEvent) => {
    if (e.key === "/") {
      // If the user is focused on an input, don't open the menu
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }

      e.preventDefault();
      menuOpen = true;
    }

    // If the menu is open, and the user presses escape, close the menu
    if (e.key === "Escape" && menuOpen) {
      e.preventDefault();
      menuOpen = false;
    }
  };

  // Add keydown listener when component is created
  onMount(() => window.addEventListener("keydown", menuKeyListener));

  // Remove keydown listener when component is destroyed
  onDestroy(() => window.removeEventListener("keydown", menuKeyListener));

  // Focus the text input when the menu is opened
  $: if (menuOpen) {
    // Focus on child input
    textInput?.querySelector("input")?.focus();
  }
</script>

<!-- Mod Menu is shown in bottom left - "Ooze Tools" - when tapped or clicked this opens a big menu  -->
<OozeUiWrapper>
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
          <CodexButton
            props={{
              size: "large",
              weight: "quiet",
              "aria-label": "Open settings",
            }}
          >
            <CodexIcon icon={cdxIconSettings} />
          </CodexButton>
          <!-- Close button -->
          <CodexButton
            props={{
              size: "large",
              weight: "quiet",
              "aria-label": "Close menu",
              onclick: () => {
                menuOpen = false;
              },
            }}
          >
            <CodexIcon icon={cdxIconClose} />
          </CodexButton>
        </div>
      </div>

      <!-- Content -->
      <div class="oozeMenuContent">
        {#if commandBeingTyped}
          <!-- Chips - show arguments. First one always has a command icon -->
          <div class="oozeMenuChips">
            <CodexChip
              props={{
                icon: cdxIconFunctionArgument,
                class: "done",
              }}
            >
              {commandBeingTyped.name}
            </CodexChip>

            {#if commandBeingTyped.arguments}
              {#each commandBeingTyped.arguments as arg, i}
                <CodexChip props={{
                  icon: arg.icon ?? undefined,
                  class: argumentNumber == i ? "active" : (
                    argumentNumber > i ? "done" : ""
                  ),
                }} scrollIntoView={argumentNumber == i}>
                  {arg.name}
                </CodexChip>
              {/each}
            {/if}

            <!-- If reason is needed - show reason chip -->
            {#if commandBeingTyped.hasReason}
              <CodexChip>
                {commandBeingTyped.reasonTitle ?? "Reason"}
              </CodexChip>
            {/if}
          </div>
        {/if}
        <!-- At top - command pallet - focused when opened -->
        <CodexTextInput
          bind:container={textInput}
          props={{
            startIcon: commandPalletInputIcon,
            placeholder: commandPalletPlaceholder,
            size: "large",
            "aria-label": "OOZE Command Pallet",
            class: "oozeCommandPallet",
            status: firstCommandNotFound ? "error" : "default",
            }}
          bind:value={commandInputValue}
        />
        {#if firstCommandNotFound}
          <CodexMessage
            props={{
              class: "oozeCommandPalletError",
            }}
          >
            Enter a valid command from the list below
          </CodexMessage>
        {/if}

        <!-- If there if a header component for this command, render it -->
        {#if commandBeingTyped?.headerComponent}
          <div class="oozeMenuCommandHeader">
            <svelte:component this={commandBeingTyped.headerComponent} />
          </div>
        {/if}
      </div>
    </div>
  {/if}
</OozeUiWrapper>
