// Find the last editor on a page

import type { ApiQueryRevisionsParams } from "types-mediawiki/api_params";
import ClientFetch from "../../proxies/ClientFetch";

export default async function LastEditorsOnPage(page: string, limit: number = 10, userFilter?: string): Promise<string[]> {

    // Limit to 10
    if (limit > 10) {
        throw new Error("Limit cannot be more than 10");
    }

    // Fetch /w/api.php?action=query&prop=revisions&titles=MediaWiki&rvlimit=5&rvprop=user&format=json
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
    const json = await ClientFetch._.cFetchJson(`/w/api.php?${queryString}`);

    // Get the revisions
    const firstItem = json.query.pages[Object.keys(json.query.pages)[0]];
    
    if (firstItem.revisions === undefined) {
        // Page does not exist or is not accessible to the user
        return [];
    }

    const revisions = firstItem.revisions;
    
    // Revisions is now an array that we can map over to get the users
    const users = revisions.map((rev: { user: string }) => rev.user ?? "[rev-deleted]");

    return users;
}