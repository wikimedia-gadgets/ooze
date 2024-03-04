<script lang="ts">
  import UserFilterCreatorItem from "./UserFilterCreatorItem.svelte";
  import UserFilters from "./UserFilters";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let changesWillReset = false;
  let changesWillResetReason = "";

  export let argString = ""; // We take this in from UserSearchIntel

  let filterMods: Record<
    string,
    { filterEnabled: boolean; exclude: boolean; selected: string }
  > = {};

  // Parse filter string - if active we need to pass the filter string to the item
  $: if (argString.length === 0) {
    filterMods = {};
    changesWillReset = false;
    changesWillResetReason = "";
  }

  $: if (argString.length > 0) {
    const filterArray = argString.split(",");
    filterMods = {};
    changesWillReset = false;
    changesWillResetReason = "";

    filterArray.forEach((filter) => {
      // Filter first character MUST be + or - (include or exclude)
      if (!filter.startsWith("+") && !filter.startsWith("-")) {
        changesWillReset = true;
        changesWillResetReason = `Syntax Error: Filter ${filter} requires a + or - to indicate inclusion or exclusion`;
        return;
      }

      const filterParts = filter.split(":");
      // If length of filter parts is not 2, the filter is invalid
      if (filterParts.length !== 2) {
        changesWillReset = true;
        changesWillResetReason = `Syntax Error: Filter ${filter} requires a value`;
        return;
      }

      const filterName = filterParts[0].replace(/[+-]/, "");

      // If filter name is not in the UserFilters, the filter is invalid
      if (!Object.keys(UserFilters).includes(filterName)) {
        changesWillReset = true;
        changesWillResetReason = `Syntax Error: Filter ${filterName} is not present in this version of OOZE.`;
        return;
      }

      // If filter already in the record, filter may be valid but can't be used with the filter creator
      if (filterMods[filterName]) {
        changesWillReset = true;
        changesWillResetReason = `
        Incompatible: Multiple matches for filter ${filterName} in the query.
        This may be valid, but can't be used with the filter creator.`;
        return;
      }

      const filterValue = filterParts[1];
      const filterExclude = filterParts[0].startsWith("-");
      filterMods[filterName] = {
        filterEnabled: true,
        exclude: filterExclude,
        selected: filterValue,
      };
    });
  }
</script>

{#if changesWillReset}
  <span class="oozeUserFilterCreatorTip">
    ℹ️ The filter creator cannot parse the current query, as it may be too
    unique or complex. To see the filter creator, reset the query or remove the
    unique filter. <br />
    <strong>{changesWillResetReason}</strong>
  </span>
{:else}
  {#each Object.keys(UserFilters) as filter}
    <UserFilterCreatorItem
      filter={UserFilters[filter]}
      {...filterMods[filter]}
      on:filterChange={({ detail }) => {
        // If the filter was disabled, remove it from the filter string (including comma at start if it exists)
        if (!detail.enabled) {
          // Stop overwriting the filter if it's already been removed
          delete filterMods[filter];

          argString = argString.replace(
            new RegExp(`,?[+-]?${filter}:[^,]*`, "g"),
            ""
          );
          // If start of filter string is a comma, remove it
          if (argString.startsWith(",")) argString = argString.slice(1);

          // Tell the parent component to update the arg string to reflect our changes
          dispatch("updateArgString", argString);
          return;
        }

        const filterPrefix = detail.exclude ? "-" : "+";
        const filterValue = detail.value ? detail.value : "true";
        const newFilter = `${filterPrefix}${filter}:${filterValue}`;

        // Regex: find the filter in the string and replace it with the new filter
        const regex = new RegExp(`[+-]?${filter}:[^,]*`, "g");
        const regexMatches = argString.match(regex) ?? [];

        switch (regexMatches.length) {
          case 0:
            // Add the filter to the string if it doesn't exist
            if (argString.length > 0) argString += `,${newFilter}`;
            else argString = newFilter;

            // Tell the parent component to update the arg string to reflect our changes
            dispatch("updateArgString", argString);

            break;
          case 1:
            // Replace the filter in the string if it exists
            argString = argString.replace(regex, newFilter);

            // Tell the parent component to update the arg string to reflect our changes
            dispatch("updateArgString", argString);

            break;
          default:
            
            // If more than one match in the string, turn on changesWillReset and do not update the filter string
            changesWillReset = true;
            changesWillResetReason = `
            Multiple matches for filter ${filter} in the query.
            This may be valid, but can't be used with the filter creator.
            `;

            return;
        }
      }}
    />
  {/each}

  <span class="oozeUserFilterCreatorTip">
    Check an item to filter results to users who meet the criteria. You can
    choose to include or exclude users who meet any given criteria. Your filters
    will automatically be transformed into a query you can use to filter users
    again.
    <strong
      >AI features are for guideline use only - use your own discretion.</strong
    >
  </span>
{/if}

<h2>User filters are coming soon and are not working in this version of OOZE.</h2>