// Get the revision IDs of a user's contributions

import ClientFetch from "../../proxies/ClientFetch";
import type { ApiQueryUserContribsParams } from "types-mediawiki/api_params";

export default async function GetUserRevIDs(username: string, limit: number = 10): Promise<number[]> {
    // If username is empty, return an empty array
    if (username === "") {
        return [];
    }

    const params: ApiQueryUserContribsParams = {
        action: "query",
        list: "usercontribs",
        ucuser: username,
        uclimit: limit,
        ucprop: "ids",
        format: "json",
    };

    const queryString = new URLSearchParams(params as any).toString();
    // Fetch the data
    const json = await ClientFetch._.cFetchJson(`/w/api.php?${queryString}`);

    // This is not present on error
    if (json?.batchcomplete !== "") {
        return [];
    }

    const result = json.query.usercontribs;
    // Map into revision IDs
    return result.map((contrib: any) => contrib.revid);
}