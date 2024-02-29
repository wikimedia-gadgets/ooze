// Check if user(s) have been reported to AIV

import ClientFetch from "../../proxies/ClientFetch";
import type { ApiParseParams } from "types-mediawiki/api_params";

export default async function CheckIfReportedToAIV(users: string[]): Promise<Record<string, boolean>> {
    // If users is empty, return an empty object
    if (users.length === 0) {
        return {};
    }

    const params: ApiParseParams = {
        action: "parse",
        page: "Wikipedia:Administrator_intervention_against_vandalism",
        prop: "wikitext",
        format: "json",
    };

    // Fetch the page
    const json = await ClientFetch._.cFetchJson(`https://en.wikipedia.org/w/api.php?${new URLSearchParams(params as any).toString()}`);

    const pageText: string = json.parse.wikitext["*"];

    // Regex - find {{vandal|username}} or {{vandal|username|reason}} to extract all usernames
    const regex = /\{\{vandal\|([^}|]+)/g;
    const matches = pageText.matchAll(regex);

    const reported: Record<string, boolean> = {};
    for (const [_, username] of matches) {
        if (users.includes(username)) {
            reported[username] = true;
            delete users[users.indexOf(username)];
        }
    }

    // Do the same for {{IPvandal|ip}} or {{IPvandal|ip|reason}}
    const ipRegex = /\{\{IPvandal\|([^}|]+)/g;
    const ipMatches = pageText.matchAll(ipRegex);
    for (const [_, ip] of ipMatches) {
        if (users.includes(ip)) {
            reported[ip] = true;
            delete users[users.indexOf(ip)];
        }
    }

    // Any users that weren't reported need to be added to the object
    for (const user of users) {
        reported[user] = false;
    }

    return reported;
}