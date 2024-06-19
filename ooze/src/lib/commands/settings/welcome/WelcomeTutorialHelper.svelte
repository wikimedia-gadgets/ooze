<script lang="ts">
  import CodexMessage from "../../../vue/CodexMessage.svelte";
  import AdvanceTutorialText from "../../ui/AdvanceTutorialText.svelte";
  export let argumentValues: string[];
  export let argumentNumber: number;
  export let commandInputValue: string;
</script>

<!-- This is separate from the helpers as user search is a bound helper. Tunneling the bindings is overcomplex. -->
{#if argumentNumber === 1}
  <CodexMessage
    props={{
      class: "oozeNotConfigured",
    }}
  >
    <!-- We display a different message whilst searching, then another when the result matches the username -->

    <span class="oozeTextStack">
      <strong> Previews and results are displayed as you type them.</strong>

      <span
        >Many commands and arguments feature previews and search functionality
        from a wide range of data sources.</span
      >

      <span
        >Below is a user search box. Let's search for and select your username, <code
          >{window.mw.config.get("wgUserName")}</code
        ></span
      >

      <span
        >The result highlighted in blue will be selected when you <AdvanceTutorialText
        /></span
      >
    </span>
  </CodexMessage>
{/if}

{#if argumentNumber === 2}
  <CodexMessage
    props={{
      class: "oozeNotConfigured",
    }}
  >
    <!-- We display a different message whilst searching, then another when the result matches the username -->

    <!-- Tutorial pt 2 - focus on  -->
    <span class="oozeTextStack">
      <strong>Great! You've found your username.</strong>

      <span
        >Shown alongside it were OOZE Insights. By default, you can see current
        warning level, block status AIV report status and a algorithmic
        prediction of the risk of a user being disruptive.
      </span>

      <span>But wasn't that annoying to type out?</span>

      <span
        >Luckily OOZE has a timesaving <strong>shortcuts</strong> feature.</span
      >

      <span
        >There are a large number of shortcuts for a variety of uses, including
        getting your own username.</span
      >

      <span
        >Try it out! Type <code>.me</code> into the search box, then <AdvanceTutorialText
        /></span
      >
    </span>
  </CodexMessage>
{/if}

<!-- Shortcuts, pt2 -->

{#if argumentNumber === 3}
  <CodexMessage
    props={{
      class: "oozeNotConfigured",
    }}
  >
    <!-- We display a different message whilst searching, then another when the result matches the username -->

    <!-- Tutorial pt 2 - focus on  -->
    <span class="oozeTextStack">
      <strong>Nice job 😎</strong>

      <span
        >Let's try a more advanced one. Type <code>.e</code> to find the last editor
        of this page.</span
      >
    </span>
  </CodexMessage>
{/if}

{#if argumentNumber === 4}
  <CodexMessage
    props={{
      class: "oozeNotConfigured",
    }}
  >
    <span class="oozeTextStack">
      <strong>Epic! 😎</strong>

      <span
        >Did you know shortcuts can take arguments too? As they're part of a
        command argument, you need to separate them with spaces instead of
        pressing TAB. As such, pages with spaces in their name will need to be
        replaced with underscores.
      </span>

      <span
        >Let's find the last person to edit the main page. Type <code
          >.e Main_Page</code
        ></span
      >
    </span>
  </CodexMessage>
{/if}

{#if argumentNumber === 5}
  <CodexMessage
    props={{
      class: "oozeNotConfigured",
    }}
  >
    <span class="oozeTextStack">
      <strong>Wasn't that cool?</strong>

      <span
        >Did you notice that <code>.e</code> accepts two arguments? The first is
        the page name, but the second is a user filter.
      </span>

      <span>
        User filters are a powerful feature that allow you to filter the results
        of a command based on a user. For example, you can find the last editor
        of a page, but only if they have a warning level of 3 or higher.
      </span>

      <strong>
        Edit filters will be made available in a future update.
        For now, let's move on to the next part of the tutorial.
        To continue, <AdvanceTutorialText />
      </strong>
    </span>
  </CodexMessage>
{/if}
