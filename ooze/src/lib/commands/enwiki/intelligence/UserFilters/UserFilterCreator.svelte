<script>
  import UserFilterCreatorItem from "./UserFilterCreatorItem.svelte";
  import UserFilters from "./UserFilters";
  let toggledV = false;
  let checkToggle = false;
</script>

<!-- Toggle button changes between include and exclude -->

{#each Object.keys(UserFilters) as filter}
  <UserFilterCreatorItem filter={UserFilters[filter]} />
{/each}



<span class="oozeUserFilterCreatorTip">
  Check an item to filter results to users who meet the criteria. You can choose
  to include or exclude users who meet any given criteria. Your filters will
  automatically be transformed into a query you can use to filter users again.
  <strong>AI features are for guideline use only - use your own discretion.</strong>
</span>
