// Users Search - find users beginning with prefix
// Search by title and namespace. That's it.

import ClientFetch from "../../proxies/ClientFetch";
import type { ApiQueryAllUsersParams } from "types-mediawiki/api_params";

export interface UserResult {
    username: string;
    groups: string[];
    block: Record<string, any>;
    rights: string[];
    editCount: number;
    joinedTimestamp: string;
    reportedToAIV?: boolean;
    warningLevel?: 0 | 1 | 2 | 3 | 4;
}


export default async function UsersSearch(usernamePrefix: string, limit: number = 10): Promise<UserResult[] | null> {
    // If usernamePrefix is empty, return null
    if (usernamePrefix === "") {
        return null;
    }

    const params: ApiQueryAllUsersParams = {
        action: "query",
        list: "allusers",
        auprefix: usernamePrefix,
        aulimit: limit,
        // @ts-ignore
        auprop: "groups|editcount|registration|rights|blockinfo",
        format: "json",
    };

    const queryString = new URLSearchParams(params as any).toString();

    // Fetch the data
    const json = await ClientFetch._.cFetchJson(`https://en.wikipedia.org/w/api.php?${queryString}`);

    // This is not present on error
    if (json?.batchcomplete !== "") {
        return null;
    }

    const result = json.query.allusers;
    // Map into UserResults

    const userResults: UserResult[] = result.map((user: any) => {
        // Block details - all keys that start with "block"
        const block: any = {};
        for (const key in user) {
            if (key.startsWith("block")) {
                block[key] = user[key];
            }
        }

        return {
            username: user.name,
            groups: user.groups,
            block,
            rights: user.rights,
            editCount: user.editcount,
            joinedTimestamp: user.registration,
        };
    });

    return userResults;
}