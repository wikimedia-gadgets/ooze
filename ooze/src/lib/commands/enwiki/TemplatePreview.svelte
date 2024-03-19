<!-- Preview a template -->
<script lang="ts">
  import type { ApiParseParams } from "types-mediawiki/api_params";

  export let template: string;
  export let pageToPreviewOn: string = "";
  export let includeSignatures: boolean = false;
  export let className: string = "";
  export let additionalArgs: string[] = [];

  let latestFetchPromiseTimestamp = Date.now();
  let fetchPromise = getFromMediaWikiAPI();

  async function getFromMediaWikiAPI() {
    const myFetchPromiseTimestamp = Date.now();
    if (latestFetchPromiseTimestamp) latestFetchPromiseTimestamp = myFetchPromiseTimestamp;

    // Wait 350ms, then fetch. This is to prevent the API from being spammed
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (myFetchPromiseTimestamp !== latestFetchPromiseTimestamp) {
      return;
    }

    let wikiText = `{{subst:${template}`;

    if (additionalArgs.length > 0) {
      wikiText += `|${additionalArgs.join("|")}`;
    }

    wikiText += "}}";

    if (includeSignatures) {
      wikiText += ` ~~~~`;
    }

    const trueTitle = pageToPreviewOn.replace(/_/g, " ");

    // One of the few requests we do on the client side
    const params: ApiParseParams = {
      action: "parse",
      text: wikiText,
      title: trueTitle,
      prop: "text",
      contentmodel: "wikitext",
      pst: true,
      assert: "user",
      format: "json",
    };

    const response = await fetch(
      "/w/api.php?" +
        new URLSearchParams(params as Record<string, string>)
    );
    const data = await response.json();
    if (!data.parse.text["*"]) {
      throw new Error("No text returned from the API");
    }
    return data.parse.text["*"];
  }

  // On any props changing, fetch the new data
  $: if (template) {
    fetchPromise = getFromMediaWikiAPI();
  }

  $: if (pageToPreviewOn) {
    fetchPromise = getFromMediaWikiAPI();
  }

  $: if (includeSignatures) {
    fetchPromise = getFromMediaWikiAPI();
  }

  $: if (additionalArgs) {
    fetchPromise = getFromMediaWikiAPI();
  }
</script>

{#await fetchPromise}
  <div class="oozeTemplatePreviewLoading {className}">
    <p>Generating preview...</p>

    <div class="cdx-progress-bar cdx-progress-bar--inline" role="progressbar">
      <div class="cdx-progress-bar__bar" />
    </div>
  </div>
{:then data}
  <!-- Safely display the HTML returned -->
  <div class="oozeTemplatePreview {className}">
    {@html data}
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
