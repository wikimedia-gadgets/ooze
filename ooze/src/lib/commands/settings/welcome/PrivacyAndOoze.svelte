<script>
    import CodexMessage from "../../../vue/CodexMessage.svelte";
  </script>

<CodexMessage
  props={{
    class: "oozeNotConfigured",
  }}
>
  <strong>OOZE Database</strong>
    <span class="oozeTextStack">
        <span>
        OOZE stores your page visit history, search queries, and other data in a database held in your browser.
        </span>
        <span>
        This data is sensitive, so it is encrypted prior to being written to your OOZE configuration page.
        </span>
        <span>
        You can disable collection of page history and search queries in the settings.
        </span>
    </span>
</CodexMessage>