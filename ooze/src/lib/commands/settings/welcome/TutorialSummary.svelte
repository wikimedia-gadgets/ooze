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
        That's the basics! Let's go over what you've learned.
      </strong>

      <span
        >You've learned how to run a command, and how to enter arguments. You've
        also learned how to move between arguments, and how to skip them.</span>

      <span>
        You've learnt about shortcuts and edit filters, and how to read user search results.
      </span>
    
      <span>
        For a full list of commands, start typing what you want to do into the command bar. If you're looking for details on shortcuts,
        click the help icon at any time to find the relevant documentation.
      </span>

      <span>
        If you ever need any more help, the OOZE talk page has a strong and active community that can help you with any questions you may have.
      </span>

      <strong>
        OOZE works across mobile and desktop. Now the basic tutorial is complete, you will continue to set up 
        database encryption. To continue, <AdvanceTutorialText />
      </strong>
    </span>
  </CodexMessage>
  