// Find the last editor on a page

import MediaWikiProxy from "../../proxies/MediaWikiProxy";

export default async function LastEditorsOnPage(page: string, limit: number = 10, userFilter?: string): Promise<string[]> {
    // Get the last editors on a page
    const currentPage = await MediaWikiProxy._.mwf<typeof mw.config.get>(["config", "get"], "wgPageName");
    return ["Test"];
}