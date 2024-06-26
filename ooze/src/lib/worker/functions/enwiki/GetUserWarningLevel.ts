// Get user warning level - 0 to 4 (4 is 4 and 4im)
// Pretty similar to how RedWarn does it - most of this algorithm is derived from RedWarn
// Apache-2.0 License, see https://github.com/wikimedia-gadgets/redwarn/blob/master/src/js/info.js#L374

import QueryUserCache from "../../db/helpers/QueryUserCache";
import UpdateUserCache from "../../db/helpers/UpdateUserCache";
import ClientFetch from "../../proxies/ClientFetch";
import type { ApiParseParams } from "types-mediawiki/api_params";

export default async function GetUserWarningLevel(username: string): Promise<0 | 1 | 2 | 3 | 4> {
    if (username === "") {
        return 0;
    }

    // Check cache for the user's talk page
    const warningLevel = await QueryUserCache(username, "warningLevel");

    if (warningLevel !== false) {
        return parseInt(warningLevel) as 0 | 1 | 2 | 3 | 4;
    }

    const params: ApiParseParams = {
        action: "parse",
        page: `User_talk:${username.replace(/ /g, "_")}`,
        prop: "wikitext",
        format: "json",
    };

    // Fetch the page
    const json = await ClientFetch._.cFetchJson(`/w/api.php?${new URLSearchParams(params as any).toString()}`);

    if (json.error) {
        // Usually means the user talk page doesn't exist
        return 0;
    }

    const pageText: string = json.parse.wikitext["*"];

    // By default, we check the date headings for this month, but if the last month is less than 5 days ago, we also check that
    const headingsToCheck = [];

    // Get the current date in format "Month Year" (e.g. "January 2024")
    const currentDateHeader = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    headingsToCheck.push(currentDateHeader);

    // Was the last month less than 5 days ago?
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    if (lastMonth.getTime() > (Date.now() - (5 * 24 * 60 * 60 * 1000))) {
        headingsToCheck.push(lastMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    }

    let maxWarningLevel = 0;

    for (const heading of headingsToCheck) {
        // Check if the heading exists
        let matchedHeading = "";
        if (pageText.includes(`==${heading}==`)) {
            matchedHeading = `==${heading}==`;
        }

        if (pageText.includes(`== ${heading} ==`)) {
            matchedHeading = `== ${heading} ==`;
        }

        if (matchedHeading === "") {
            continue;
        }

        // Get the section text
        const sectionText = pageText.split(matchedHeading)[1].split("==")[0];

        // Test for warnings
        /*
            Level 4: /(File:|Image:)Stop hand nuvola.svg/gi
            Level 3: /(File:|Image:)(Nuvola apps important.svg|Ambox warning pn.svg)/gi
            Level 2: /(File:|Image:)Information orange.svg/gi
            Level 1: /(File:|Image:)Ambox notice.png/gi
        */
        // ! Must be done in order of level

        if (sectionText.match(/(File:|Image:)Stop hand nuvola.svg/gi)) {
            maxWarningLevel = 4;
            break;
        }

        if (sectionText.match(/(File:|Image:)(Nuvola apps important.svg|Ambox warning pn.svg)/gi)) {
            if (maxWarningLevel < 3) {
                maxWarningLevel = 3;
            }
            continue;
        }

        if (sectionText.match(/(File:|Image:)Information orange.svg/gi)) {
            if (maxWarningLevel < 2) {
                maxWarningLevel = 2;
            }
            continue;
        }

        if (sectionText.match(/(File:|Image:)Ambox notice.png|Information.svg/gi)) {
            if (maxWarningLevel < 1) {
                maxWarningLevel = 1;
            }
            continue;
        }

    }

    // Cache for 15 seconds
    await UpdateUserCache(username, "warningLevel", maxWarningLevel.toString(), 15);

    return maxWarningLevel as 0 | 1 | 2 | 3 | 4;
}