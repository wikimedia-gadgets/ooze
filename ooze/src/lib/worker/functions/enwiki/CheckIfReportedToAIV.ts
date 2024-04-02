// Check if user(s) have been reported to AIV

import OozeDb from "../../db/DbConnection";
import ClientFetch from "../../proxies/ClientFetch";
import type { ApiParseParams } from "types-mediawiki/api_params";

export default async function CheckIfReportedToAIV(users: string[]): Promise<Record<string, boolean>> {
    // If users is empty, return an empty object
    if (users.length === 0) {
        return {};
    }

    // Max users is 50
    if (users.length > 50) {
        throw new Error("Too many users to check");
    }

    const reported: Record<string, boolean> = {};

    // Check cache for any of the users. Do not use cache if more stale than 15 seconds
    /*
    SELECT username, recordValue FROM UserData WHERE username IN (users) AND recordKey = "aivReported" AND lastUpdated > (strftime('%s', 'now') - 15);
    */
    for (const user of users) {
        // If the user is in the cache, remove them from the array and add them to the object

        const cacheStatement = `--sql
        SELECT recordValue FROM UserData
        WHERE username = ? AND recordKey = "aivReported"
        AND lastUpdated > (strftime('%s', 'now') - 15)
        LIMIT 1;
        `;

        const result = OozeDb.connection?.exec(cacheStatement, [user]);

        if (result) {
            reported[user] = result[0].values[0][0] === "true";
            delete users[users.indexOf(user)];
        }
    }

    const params: ApiParseParams = {
        action: "parse",
        page: "Wikipedia:Administrator_intervention_against_vandalism",
        prop: "wikitext",
        format: "json",
    };

    // Fetch the page
    const json = await ClientFetch._.cFetchJson(`/w/api.php?${new URLSearchParams(params as any).toString()}`);

    const pageText: string = json.parse.wikitext["*"];

    // Regex - find {{vandal|username}} or {{vandal|username|reason}} to extract all usernames
    const regex = /\{\{vandal\|([^}|]+)/g;
    const matches = pageText.matchAll(regex);


    for (const [_, username] of matches) {
        if (users.includes(username)) {

            // Add to the cache
            const cacheStatement = `--sql
            INSERT OR REPLACE INTO UserData (username, recordKey, recordValue, lastUpdated)
            VALUES (?, "aivReported", "true", strftime('%s', 'now'));
            `;

            OozeDb.connection?.exec(cacheStatement, [username]);

            reported[username] = true;
            delete users[users.indexOf(username)];
        }
    }

    // Do the same for {{IPvandal|ip}} or {{IPvandal|ip|reason}}
    const ipRegex = /\{\{IPvandal\|([^}|]+)/g;
    const ipMatches = pageText.matchAll(ipRegex);
    for (const [_, ip] of ipMatches) {
        if (users.includes(ip)) {

            // Add to the cache
            const cacheStatement = `--sql
            INSERT OR REPLACE INTO UserData (username, recordKey, recordValue, lastUpdated)
            VALUES (?, "aivReported", "true", strftime('%s', 'now'));
            `;

            OozeDb.connection?.exec(cacheStatement, [ip]);

            reported[ip] = true;
            delete users[users.indexOf(ip)];
        }
    }

    // Any users that weren't reported need to be added to the object
    for (const user of users) {
        // Add to the cache as false
        const cacheStatement = `--sql
        INSERT OR REPLACE INTO UserData (username, recordKey, recordValue, lastUpdated)
        VALUES (?, "aivReported", "false", strftime('%s', 'now'));
        `;

        OozeDb.connection?.exec(cacheStatement, [user]);

        reported[user] = false;
    }

    // Persist the cache
    OozeDb.persistChanges();

    return reported;
}