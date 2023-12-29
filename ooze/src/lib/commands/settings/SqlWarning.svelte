<script>
  import CodexMessage from "../../vue/CodexMessage.svelte";

</script>
<CodexMessage props={{
    type: "warning",
}}>
    This command queries OOZE's database.
    Running untested queries may corrupt your configuration.
</CodexMessage>