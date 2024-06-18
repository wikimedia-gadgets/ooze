<script>
  import CodexMessage from "../../../vue/CodexMessage.svelte";
  import AdvanceTutorialText from "../../ui/AdvanceTutorialText.svelte";
</script>

<!-- The first page -->
<CodexMessage
  props={{
    class: "oozeNotConfigured",
  }}
>
  <span class="oozeTextStack">
    <strong>
      Congratulations! You just started building your first command.
    </strong>

    <span
      >Every function in OOZE is a command. You can run commands by typing them
      into the command input bar.</span
    >

    <span>You first enter a command, then enter each required argument.</span>

    <span>
      To move to the next part of a command, or to skip an argument, <AdvanceTutorialText
      />
    </span>

    <span>
      To go back, press <strong>BACKSPACE</strong> after the command input bar is empty.
    </span>

    <span>
        If you prefer, <strong>ENTER</strong> can be used instead of <strong>TAB</strong> to advance. However, some arguments that
        allow inputs over multiple lines will require <strong>TAB</strong> to be pressed instead.
    </span>

    <span>
        Arguments that don't require values can be skipped. Let's try it now.
    </span>
  </span>
</CodexMessage>
