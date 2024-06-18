<!-- 
Makes suggestions. Also rewrites value based on following shortcut (see UserSearchIntelShortucts.ts for example)

Just typing a space will enter the "recommended" value from the suggestions, which are as follows.
If on a userpage: .u - the last userpage visited will be this one
-->

<script lang="ts">
  import type LastEditorsOnPage from "../../../worker/functions/enwiki/LastEditorsOnPage";
  import { createEventDispatcher } from "svelte";
  import type { UserSearchIntelShortcut } from "./UserSearchIntelShortcuts";
  import UserSearchIntelShortcuts from "./UserSearchIntelShortcuts";
  import ClientWorkerCommunicationProvider from "../../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";
  import UserFilterCreator from "./UserFilters/UserFilterCreator.svelte";
  import type UsersSearch from "../../../worker/functions/enwiki/UsersSearch";
  import type { UserResult } from "../../../worker/functions/enwiki/UsersSearch";
  import type CheckIfReportedToAIV from "../../../worker/functions/enwiki/CheckIfReportedToAIV";
  import type GetUserWarningLevel from "../../../worker/functions/enwiki/GetUserWarningLevel";
  import UserLiftWingIntel from "./UserLiftWingIntel.svelte";
  import type GetPageVisitHistory from "../../../worker/functions/PageVisitHistory";

  const dispatch = createEventDispatcher();

  export let commandInputValue: string;

  let shortCutBeingTyped: UserSearchIntelShortcut | null = null;
  let shortCutReplacement: string | null = null;

  let isLoadingResultOfShortcut = false;
  let shortCutResultError: string | null = null;

  let userSearchResults: UserResult[] | null = null;

  // To render to help with parameters, i.e. creating user filters
  let helperComponent: any = null;

  // If commandInputValue = ".me", then replace with current user

  // Throttle - only update 400ms after last keypress
  let shortCutTimeout: NodeJS.Timeout | null = null;

  const update = async () => {
    const split = commandInputValue.split(" ");
    switch (split[0]) {
      case ".sb":
        // Sandbox for User Warnings
        shortCutBeingTyped = UserSearchIntelShortcuts.sb;
        shortCutReplacement = "Sandbox for User Warnings";
        isLoadingResultOfShortcut = false;
        dispatch("overrideInputValue", shortCutReplacement);
        defaultIntelSearch(shortCutReplacement, 1);
        break;
      case ".me":
        shortCutBeingTyped = UserSearchIntelShortcuts.me;
        // Unlikely to be null, but if it is, use empty string
        // Note all helper functions must override the value via an event - it's the
        // parent component's job to handle the override
        // This won't be immediately shown but the change is made
        shortCutReplacement = mw.config.get("wgUserName") ?? "";
        dispatch("overrideInputValue", shortCutReplacement);
        isLoadingResultOfShortcut = false;
        defaultIntelSearch(shortCutReplacement, 1);
        break;
      case ".u":
        // Last user page visited
        shortCutBeingTyped = UserSearchIntelShortcuts.u;
        isLoadingResultOfShortcut = true;

        // Offset (take from second argument if present)
        // Default no offset, we want whatever the last OR current page is

        let offset = 0;
        let limit = 1; // By default only 1 result

        if (split.length > 1) {
          shortCutBeingTyped = UserSearchIntelShortcuts["u-p1"];

          // Make sure we can parse the offset
          const offsetString = split[1];
          if (offsetString.length === 0) {
            shortCutResultError = "Invalid offset";
            isLoadingResultOfShortcut = false;
            dispatch("resetInputValue");
            userSearchResults = [];
            return;
          }

          offset = parseInt(offsetString);

          if (isNaN(offset)) {
            shortCutResultError = "Invalid offset";
            isLoadingResultOfShortcut = false;
            dispatch("resetInputValue");
            userSearchResults = [];
            return;
          }
        }

        // 2 arguments, we'll take the limit from the second argument
        if (split.length > 2) {
          shortCutBeingTyped = UserSearchIntelShortcuts["u-p2"];

          // Make sure we can parse the limit
          const limitString = split[2];
          if (limitString.length === 0) {
            shortCutResultError = "Invalid limit";
            isLoadingResultOfShortcut = false;
            dispatch("resetInputValue");
            userSearchResults = [];
            return;
          }

          limit = parseInt(limitString);
          if (isNaN(limit)) {
            shortCutResultError = "Invalid limit";
            isLoadingResultOfShortcut = false;
            dispatch("resetInputValue");
            userSearchResults = [];
            return;
          }

          // Max limit has to be 30
          if (limit > 30) {
            shortCutResultError = "Limit must be under 30";
            isLoadingResultOfShortcut = false;
            dispatch("resetInputValue");
            userSearchResults = [];
            return;
          }
        }

        // If more than 2 arguments, error
        if (split.length > 3) {
          shortCutResultError = "Too many arguments";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");
          userSearchResults = [];
          return;
        }

        // Browse our history
        const result = await ClientWorkerCommunicationProvider._.workerFunction<
          typeof GetPageVisitHistory
        >(
          "pageVisitHistory",
          limit,
          offset,
          // where... we're only interested in user pages
          `namespace = 'User' OR namespace = 'User_talk'`
        );

        if (result.length === 0) {
          shortCutResultError = "No results";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");
          userSearchResults = [];
          return;
        }

        // Our username follows the colon in the title, and we want to replace underscores with spaces
        const username =
          result[0].pageName?.toString().split(":")[1].replace(/_/g, " ") ?? "";

        shortCutResultError = null;
        isLoadingResultOfShortcut = false;
        shortCutReplacement = username;
        dispatch("overrideInputValue", shortCutReplacement);
        if (limit == 1) {
          defaultIntelSearch(shortCutReplacement, 1);
        } else {
          userSearchResults = result.map((r) => {
            return {
              username:
                r.pageName?.toString().split(":")[1].replace(/_/g, " ") ?? "",
              groups: [],
              rights: [],
              block: {},
              editCount: 0,
              warningLevel: 0,
              joinedTimestamp: "",
              reportedToAIV: false,
              isBasicSearchResult: true,
            };
          });
        }

        // If limit is more than one

        break;
      case ".e":
        shortCutBeingTyped = UserSearchIntelShortcuts.e;
        isLoadingResultOfShortcut = true;

        let pageName = mw.config.get("wgPageName");

        if (split.length > 1) {
          // Page name is provided
          shortCutBeingTyped = UserSearchIntelShortcuts["e-p1"];
          pageName = split[1]; // Use _ instead of space

          if (pageName.length === 0) {
            // Default this page if no page is provided
            pageName = mw.config.get("wgPageName");
          }
        }

        // User filters
        if (split.length == 3) {
          shortCutBeingTyped = UserSearchIntelShortcuts["e-p2"];
          helperComponent = UserFilterCreator;
          shortCutResultError = "Invalid user filter";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");
          userSearchResults = [];
          return;
        } else {
          helperComponent = null;
        }

        if (split.length > 3) {
          shortCutResultError = "Too many arguments";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");
          userSearchResults = [];
          return;
        }

        const userResults =
          await ClientWorkerCommunicationProvider._.workerFunction<
            typeof LastEditorsOnPage
          >(
            "enwikiLastEditorsOnPage",
            pageName,
            1 // We only need the latest editor for this
          );

        if (userResults.length === 0) {
          shortCutResultError = "Page inaccessible";
          isLoadingResultOfShortcut = false;
          dispatch("resetInputValue");
          userSearchResults = [];
          console.warn("No results for page", pageName);
          return;
        }

        shortCutResultError = null;
        isLoadingResultOfShortcut = false;
        shortCutReplacement = userResults[0];
        dispatch("overrideInputValue", shortCutReplacement);
        defaultIntelSearch(shortCutReplacement, 1);
        break;

      default:
        shortCutBeingTyped = null;
        shortCutReplacement = null;
        shortCutResultError = null;
        helperComponent = null;

        isLoadingResultOfShortcut = false;
        // Remove any queued overrides
        dispatch("resetInputValue");
        defaultIntelSearch(commandInputValue, 3, true);
    }
  };

  const defaultIntelSearch = async (
    userPrefix: string,
    limit: number = 3,
    overrideInputValue = false
  ) => {
    // Run a basic search first, then we get our deeper intel
    userSearchResults =
      (await ClientWorkerCommunicationProvider._.workerFunction<
        typeof UsersSearch
      >("enwikiUsersSearch", userPrefix, limit)) ?? []; // Todo: Limit here is 3 but make this a setting

    // If overriding input value, set the input value to the first result
    if (
      overrideInputValue &&
      userSearchResults &&
      userSearchResults.length > 0
    ) {
      dispatch("overrideInputValue", userSearchResults[0].username);
    }

    // Once that's done check AIV. Only do that if usernames in userSearchResults > 0
    // IMPORTANT: No (top level) await here, we want to run everything at once
    if (userSearchResults && userSearchResults.length > 0) {
      (async () => {
        const aivResults =
          await ClientWorkerCommunicationProvider._.workerFunction<
            typeof CheckIfReportedToAIV
          >(
            "enwikiCheckAiv",
            userSearchResults.map((u) => u.username)
          );

        userSearchResults = userSearchResults.map((u) => {
          u.reportedToAIV = aivResults[u.username];
          return u;
        });
      })();

      // Check warning level
      for (const { username } of userSearchResults) {
        (async () => {
          const warningLevel =
            await ClientWorkerCommunicationProvider._.workerFunction<
              typeof GetUserWarningLevel
            >("enwikiGetUserWarningLevel", username);

          // Update the userSearchResults
          userSearchResults = userSearchResults.map((u) => {
            if (u.username === username) {
              u.warningLevel = warningLevel;
            }
            return u;
          });
        })();
      }
    }
  };

  $: if (commandInputValue.length !== -1) {
    isLoadingResultOfShortcut = true;
    // Throttle - only update 400ms after last keypress
    if (shortCutTimeout) {
      clearTimeout(shortCutTimeout);
    }
    shortCutTimeout = setTimeout(() => update(), 350);
  }

  // When arg requested
  function updateArgEvent(event: CustomEvent<string>) {
    // console.log("updateArgEvent", event.detail);

    // Put together based on split at space, but replace the last part with the new value
    const split = commandInputValue.split(" ");

    split.pop();
    split.push(event.detail);

    dispatch("setInputValue", split.join(" "));
  }
</script>

{#if shortCutBeingTyped}
  <div class="oozeShortCutHint">
    <span class="oozeShortCutDesc">{shortCutBeingTyped.description}:</span>

    {#if isLoadingResultOfShortcut}
      <span class="oozeShortCutHintLoading">...</span>
    {:else if shortCutResultError}
      <span class="oozeShortCutHintError">{shortCutResultError}</span>
    {:else}
      <span class="oozeShortCutHintPrefix">{shortCutReplacement}</span>
    {/if}
  </div>

  {#if helperComponent}
    <div class="oozeShortCutHelper">
      <svelte:component
        this={helperComponent}
        argString={// Arg string is the last part of the command input value
        commandInputValue.split(" ").pop()}
        on:updateArgString={updateArgEvent}
      />
    </div>
  {/if}
{/if}

<!-- Search results -->
{#if userSearchResults}
  <div class="oozeSearchResults">
    {#each userSearchResults as user, i}
      <div
        class="oozeSearchResult"
        on:click={() => {
          // On click, set the input value to the username
          dispatch("setInputValue", user.username);
        }}
        on:keydown={(e) => {
          if (e.key === "Enter") {
            dispatch("setInputValue", user.username);
          }
        }}
        role="button"
        tabindex={i}
      >
        <span class="oozeSearchResultName">{user.username}</span>

        {#if !user.isBasicSearchResult}
          <span class="oozeSearchResultEditCount">{user.editCount}</span>

          <!-- Warning level -->
          {#if user.warningLevel === undefined}
            <!-- This adds a fade in fade out loading -->
            <span class="oozeSearchResultWarningLevel oozeLoading">Loading</span
            >
          {:else if user.warningLevel === 0}
            <span class="oozeSearchResultWarningLevel warningLevelNone"
              >No Warnings</span
            >
          {:else if user.warningLevel === 1}
            <span class="oozeSearchResultWarningLevel warningLevelNotice"
              >Notice</span
            >
          {:else if user.warningLevel === 2}
            <span class="oozeSearchResultWarningLevel warningLevelCaution"
              >Caution</span
            >
          {:else if user.warningLevel === 3}
            <span class="oozeSearchResultWarningLevel warningLevelWarning"
              >Warning</span
            >
          {:else if user.warningLevel === 4}
            <span class="oozeSearchResultWarningLevel warningLevelFinalWarning"
              >Final Warning</span
            >
          {/if}

          {#if user.reportedToAIV === undefined}
            <!-- This adds a fade in fade out loading -->
            <span class="oozeSearchResultReportedToAIV oozeLoading">AIV</span>
          {:else if user.reportedToAIV === true}
            <span class="oozeSearchResultReportedToAIV aivReported"
              >AIV Report</span
            >
          {:else}
            <span class="oozeSearchResultReportedToAIV aivNotReported">AIV</span
            >
          {/if}

          <!-- Quality indicator -->
          <UserLiftWingIntel
            username={user.username}
            editCount={user.editCount}
            isReportedToAIV={user.reportedToAIV}
            warningLevel={user.warningLevel}
          />

          {#if Object.keys(user.block).length > 0}
            <span class="oozeSearchResultBlock">Blocked</span>
            {#if user.block.blocknocreate === ""}
              <span class="oozeSearchResultBlockExtra"
                >Page creation blocked</span
              >
            {/if}

            {#if user.block.blockemail === ""}
              <span class="oozeSearchResultBlockExtra">Email blocked</span>
            {/if}

            <span class="oozeSearchResultMoreInfo">
              {user.block.blockreason}<br /><br />
              <span>
                <strong>Additional info:</strong> Blocked by {user.block
                  .blockedby} on {new Date(
                  user.block.blockedtimestamp
                ).toLocaleString()}<br />
                <strong>Expires:</strong>
                {user.block.blockexpiry === "infinite"
                  ? "Never"
                  : user.block.blockexpiry}
              </span>
            </span>
          {/if}
        {:else}
        <!-- We use basic when there are a large number of results - if we have to load them require a click -->
          <span class="oozeSearchResultMoreInfo">
            Click to load insights
          </span>
        {/if}
      </div>
    {:else}
    <!-- No results -->
    <div class="oozeSearchResult oozeSearchResultNoResults">
      No results
    </div>
    {/each}
  </div>
{/if}
