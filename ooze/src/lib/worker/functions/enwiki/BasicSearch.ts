// BasicSearch
// Search by title and namespace. That's it.

import ClientFetch from "../../proxies/ClientFetch";
import type { ApiQuerySearchParams } from "types-mediawiki/api_params";

export interface SearchResults {
    totalResults: number;
    suggestions: string[];
    didYouMean: string;
    results: string[];
}


export default async function BasicSearch(search: string, namespace: number = 0, limit: number = 10): Promise<SearchResults | null> {
    // If search is empty, return null
    if (search === "") {
        return null;
    }

    const params: ApiQuerySearchParams = {
        action: "query",
        list: "search",
        srsearch: search,
        srnamespace: namespace,
        srlimit: limit,
        srinfo: ["suggestion", "totalhits", "rewrittenquery"],
        format: "json",
    };

    const queryString = new URLSearchParams(params as any).toString();
    // Fetch the data
    const json = await ClientFetch._.cFetchJson(`https://en.wikipedia.org/w/api.php?${queryString}`);

    // This is not present on error
    if (json?.batchcomplete !== "") {
        return null;
    }

    console.log(json);

    //! temp
    return null;
}