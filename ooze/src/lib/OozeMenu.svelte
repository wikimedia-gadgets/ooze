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
  import { CanUseOoze } from "./commands/RestrictFeatureLevel";

  const { DemoModeEnabled } = CanUseOoze._;

  const oozeVer = APP_VERSION;

  let commandInputValue = "";

  let commandBeingTyped: Command | undefined = undefined;

  let argumentValues: string[] = [];

  let firstCommandNotFound = false;

  let commandPalletInputIcon = cdxIconFunctionArgument;
  let commandPalletPlaceholder = "Type a command, or use the buttons below";

  // Argument number - used to handle input for commands and arguments. -1 means waiting for command
  let argumentNumber = -1;

  // Arguments are filled in order, so we only need to get the validation error for the current argument
  let currentArgumentValidationError = "";

  let shouldRefetchArgumentValues = false;

  let menuOpen = false;

  let textInput: Element | undefined = undefined;

  // If this is set, it will override the input value when tab is pressed
  let queuedOverrideInputValue: string | null = "";

  // Has just gone back? This means when force advance, we go back instead of forward
  let justWentBack = false;

  $: if (commandBeingTyped && commandBeingTyped.arguments) {
    commandPalletInputIcon =
      commandBeingTyped.arguments[argumentNumber].icon ??
      cdxIconFunctionArgument;

    commandPalletPlaceholder =
      commandBeingTyped.arguments[argumentNumber].placeholder ??
      `Enter ${commandBeingTyped.arguments[argumentNumber].name}`;
  }

  // On argument change, if argument value already set set commandInputValue to it
  $: if (shouldRefetchArgumentValues && argumentNumber > -1) {
    commandInputValue = argumentValues[argumentNumber] ?? "";
    shouldRefetchArgumentValues = false;
  }

  // On command input change
  $: if (commandInputValue !== "") {
    // Reset error
    currentArgumentValidationError = "";
  }

  // When argument number changes, clear currentArgumentValidationError
  $: if (argumentNumber !== -2) {
    currentArgumentValidationError = "";
  }

  // Reset first command not found when command input is cleared
  $: if (commandInputValue === "") {
    firstCommandNotFound = false;
  }

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

  // Advanced mode only
  function advanceParam() {
    justWentBack = false;

    // If there are is a queued override, use it (i.e. shortcuts)
    if (queuedOverrideInputValue) {
      commandInputValue = queuedOverrideInputValue;
      queuedOverrideInputValue = null;
    }

    switch (argumentNumber) {
      case -1:
        const command = Commands[commandInputValue.trim().toLowerCase()];
        // If argument number is -1, we are waiting for an argument
        if (command) {
          firstCommandNotFound = false;
          commandBeingTyped = command;
          commandInputValue = "";
          argumentNumber = 0;
        } else {
          firstCommandNotFound = true;
        }
        break;
      default:
        // Move on - before doing so, ensure the argument is valid
        if (commandBeingTyped?.arguments) {
          const validation =
            commandBeingTyped.arguments[argumentNumber].validate(
              commandInputValue
            );

          // Validation error? Set the error and return
          if (validation !== true) {
            currentArgumentValidationError = validation;
            return;
          }
        }

        // Set the argument value
        argumentValues[argumentNumber] = commandInputValue.trim();
        if (
          argumentNumber + 1 <
          (commandBeingTyped?.arguments?.length as number)
        )
          argumentNumber++;
        commandInputValue = "";
        break;
    }
  }

  function goBackParam() {
    // If the current argument number is 0, set the argument number to -1
    // and clear the command being typed
    queuedOverrideInputValue = null;
    if (argumentNumber < 1) {
      argumentNumber = -1;
      argumentValues = [];
      commandBeingTyped = undefined;
      commandPalletInputIcon = cdxIconFunctionArgument;
      commandPalletPlaceholder = "Type a command, or use the buttons below";
      return;
    }
    justWentBack = true;
    argumentNumber--;
    shouldRefetchArgumentValues = true;
  }

  // Handle when backspace, tab or enter is pressed on the text input
  const handleCommandInputKey = (e: KeyboardEvent) => {
    // If backspace pressed, ensure the input is already empty
    // Then subtract 1 from the argument number
    if (e.key === "Backspace") {
      if (commandInputValue === "") {
        e.preventDefault();
        goBackParam();
      }
    }

    // If tab pressed we move onto the next arg
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      advanceParam();
    }
  };

  function helperOverrideInputValue(e: CustomEvent<string>) {
    queuedOverrideInputValue = e.detail;
  }

  // Set vs override - set is when the user types, override is when the helper component sets the value
  function helperSetInputValue(e: CustomEvent<string>) {
    commandInputValue = e.detail;
  }

  function helperResetInputValue() {
    queuedOverrideInputValue = null;
  }

  function helperForceAdvanceParam() {
    if (justWentBack) {
      justWentBack = false;
      goBackParam(); // Don't let an immediate advance happen after going back
      return;
    }

    advanceParam();
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

            <!-- Todo: clean up nesting hell -->
            {#if commandBeingTyped.arguments}
              {#each commandBeingTyped.arguments as arg, i}
                <CodexChip
                  props={{
                    icon: arg.icon ?? undefined,
                    class:
                      argumentNumber == i
                        ? "active"
                        : argumentNumber > i
                          ? "done"
                          : "",
                    status:
                      argumentNumber == i &&
                      currentArgumentValidationError !== ""
                        ? "error"
                        : undefined,
                  }}
                  scrollIntoView={argumentNumber == i}
                >
                  {currentArgumentValidationError !== "" && argumentNumber == i
                    ? currentArgumentValidationError
                    : arg.name}
                </CodexChip>
              {/each}
            {/if}
          </div>
        {:else}
          <p class="oozeMenuTitle">
            v{oozeVer}
            {#if DemoModeEnabled}
              <span class="oozeDemoMode">Demo Mode</span>
            {/if}
          </p>
        {/if}

        <div class="oozeButtons">
          <!-- Settings button -->
          <CodexButton
            props={{
              weight: "quiet",
              "aria-label": "Open settings",
              onclick: () => {
                // If settings already open, close it
                if (commandBeingTyped?.name === "Settings") {
                  commandBeingTyped = undefined;
                  argumentNumber = -1;
                  return;
                }

                commandBeingTyped = Commands.settings;
                argumentNumber = 0;
              },
            }}
          >
            <CodexIcon icon={cdxIconSettings} />
          </CodexButton>
          <!-- Close button -->
          <CodexButton
            props={{
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
        <!-- If there if a header component for this command, render it -->
        {#if commandBeingTyped?.headerComponent}
          <div class="oozeMenuCommandHeader">
            <svelte:component
              this={commandBeingTyped.headerComponent}
              bind:argumentValues
              bind:argumentNumber
              bind:commandInputValue
            />
          </div>
        {/if}

        <!-- If there is a helper component for this argument, render it -->
        {#if commandBeingTyped?.arguments && commandBeingTyped.arguments[argumentNumber]?.helperElement}
          <div class="oozeMenuCommandHelper">
            <svelte:component
              this={commandBeingTyped.arguments[argumentNumber].helperElement}
              bind:commandInputValue
              {argumentValues}
              on:overrideInputValue={helperOverrideInputValue}
              on:setInputValue={helperSetInputValue}
              on:resetInputValue={helperResetInputValue}
              on:forceAdvanceParam={helperForceAdvanceParam}
            />
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
            onkeydown: handleCommandInputKey,
          }}
          bind:value={commandInputValue}
        />

        {#if firstCommandNotFound}
          <CodexMessage
            props={{
              class: "oozeCommandPalletError",
            }}
          >
            Enter a valid command
          </CodexMessage>
        {/if}
      </div>

      {#if DemoModeEnabled}
        <span class="oozeShortCutHint">
          <strong>Test OOZE! Your changes won't be saved.</strong>
        </span>
      {/if}
    </div>
  {/if}
</OozeUiWrapper>
