<script>
  import CodexButton from "../../../vue/CodexButton.svelte";
  import CodexCheckbox from "../../../vue/CodexCheckbox.svelte";
  import CodexSelect from "../../../vue/CodexSelect.svelte";
  import CodexTextInput from "../../../vue/CodexTextInput.svelte";
  import CodexToggleButton from "../../../vue/CodexToggleButton.svelte";
  let toggledV = false;
  let checkToggle = false;
</script>

<!-- Toggle button changes between include and exclude -->

<!--
    Todo: Dropdown of preset filters. This modifies what's checked here
    For example:
    Very clearly bad faith: -goodfaith:20
    Very clearly good faith: +goodfaith:80
    Very clearly vandalism: +vandalism:80
    Very clearly not vandalism: -vandalism:20
    Only anonymous users: +anonymous


-->
<div class="oozeUserFilterCreatorGroup">
  <div class="oozeUserFilterCreatorItem">
    <!--
        Good faith filter result examples:
        - Include users with good faith score over 90%: +goodfaith:90
        - Exclude users with good faith score over 90%: -goodfaith:90

        An example that would show only users with low good faith and high vandalism scores:
        -goodfaith:90,+vandalism:90
    -->
    <CodexCheckbox bind:toggled={checkToggle} />
    <span>Good Faith Score (%)</span>
  </div>
  {#if checkToggle}
    <div class="oozeUserFilterCreatorFilter">
        <CodexToggleButton bind:toggled={toggledV}>
            {toggledV ? "Exclude" : "Include"}
          </CodexToggleButton>
          <!-- Todo: make dropdown, having fixed options makes this much easier -->
          <CodexSelect menuItems={[{ value: "90", label: "90" }]} />
    </div>
  {/if}
</div>

<span class="oozeUserFilterCreatorTip">
  Check an item to filter results to users who meet the criteria. You can choose
  to include or exclude users who meet any given criteria. Your filters will
  automatically be transformed into a query you can use to filter users again.
</span>
