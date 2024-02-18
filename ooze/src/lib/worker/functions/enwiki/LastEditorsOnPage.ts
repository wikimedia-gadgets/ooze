// Find the last editor on a page

import type { ApiQueryRevisionsParams } from "types-mediawiki/api_params";
import MediaWikiProxy from "../../proxies/MediaWikiProxy";

export default async function LastEditorsOnPage(page: string, limit: number = 10, userFilter?: string): Promise<string[]> {
    // Limit to 10
    if (limit > 10) {
        throw new Error("Limit cannot be more than 10");
    }

    // Get the last editors on a page
    const currentPage = await MediaWikiProxy._.mwf<typeof mw.config.get>(["config", "get"], "wgPageName") as string;

    // Fetch https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=MediaWiki&rvlimit=5&rvprop=user&format=json
    // Ensure the params are prepared first
    const params: ApiQueryRevisionsParams = {
        action: "query",
        prop: "revisions",
        titles: page,
        rvlimit: limit,
        rvprop: "user",
        format: "json",
    };

    // Convert the params to a query string
    const queryString = new URLSearchParams(params as any).toString();

    // Fetch the data
    const data = await fetch(`https://en.wikipedia.org/w/api.php?${queryString}`);
    const json = await data.json();

    // Get the revisions
    const revisions = json.query.pages[Object.keys(json.query.pages)[0]].revisions;
    console.log(revisions);

    return [currentPage];
}