<!-- UW helper - previews -->
<script lang="ts">
    import enwikiWarnings from "./data/Warnings";
    const { warnings } = enwikiWarnings;
    export let argumentValues: string[];
    export let argumentNumber: number;

    let templateToPreview = argumentValues[1] ?? "";
    let warningLevel = argumentValues[2] ?? 1;

    
</script>

<!-- Only show if argument number > 1 (template selected) -->
{#if argumentNumber > 1}
    <div class="oozeSearchResults">
        <p>{JSON.stringify(argumentValues)}</p>
    </div>
{/if}