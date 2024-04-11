// Get the revision IDs of a user's contributions

import QueryUserCache from "../../db/helpers/QueryUserCache";
import UpdateUserCache from "../../db/helpers/UpdateUserCache";
import ClientFetch from "../../proxies/ClientFetch";
import type { ApiQueryUserContribsParams } from "types-mediawiki/api_params";

export default async function GetUserRevIDs(username: string, limit: number = 10): Promise<number[]> {
    // Check cache for the user's contributions
    const cachedContribs = await QueryUserCache(username, "contribsRevIDs");
    if (cachedContribs !== false) {
        return JSON.parse(cachedContribs);
    }

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
    const revIds = result.map((contrib: any) => contrib.revid);
    // Cache the data for 15 seconds
    await UpdateUserCache(username, "contribsRevIDs", JSON.stringify(revIds), 15);
    return revIds;
}