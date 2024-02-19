<script lang="ts">
  import CodexCheckbox from "../../../../vue/CodexCheckbox.svelte";
  import CodexSelect from "../../../../vue/CodexSelect.svelte";
  import CodexToggleButton from "../../../../vue/CodexToggleButton.svelte";
  import type { UserFilter } from "./UserFilters";

  export let filter: UserFilter;
  export let exclude: boolean = false;
  export let filterEnabled: boolean = false;
  export let selected: string | number = filter?.menuItems[0].value;
</script>

<div class="oozeUserFilterCreatorGroup">
  <div class="oozeUserFilterCreatorItem">
    <!--
          Good faith filter result examples:
          - Include users with good faith score over 90%: +goodfaith:90
          - Exclude users with good faith score over 90%: -goodfaith:90
  
          An example that would show only users with low good faith and high vandalism scores:
          -goodfaith:90,+vandalism:90
      -->
    <CodexCheckbox bind:toggled={filterEnabled} />
    <span>{filter.title}</span>
  </div>
  {#if filterEnabled}
    <div class="oozeUserFilterCreatorFilter">
      <CodexToggleButton bind:toggled={exclude}>
        {exclude ? "Exclude" : "Include"}
      </CodexToggleButton>
      <CodexSelect menuItems={filter.menuItems} bind:selected props={{
        menuConfig : {
            visibleItemCount: 1
        }
      }} />
    </div>
  {/if}
</div>