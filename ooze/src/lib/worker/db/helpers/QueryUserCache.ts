/*
Queries the user cache for the specified user and record key.

It will return false if the record is not found or is stale or the string value of the record if it is found and not stale.
*/

import OozeDb from "../DbConnection";

export default async function QueryUserCache(
    username: string,
    recordKey: string
): Promise<string | false> {
    if (!OozeDb.connection) {
        throw new Error("Connection not initialized");
    }
    const sqlStatement = `--sql
    SELECT recordValue FROM UserData
    WHERE username = ? AND recordKey = ?
    AND staleAfter > strftime('%s', 'now')
    LIMIT 1;
    `;
    console.log("[oozeWorker/db] query user cache", username, recordKey);
    const params = [username, recordKey];
    const result = OozeDb.connection.exec(sqlStatement, params);

    if (result && result.length > 0) {
        return result[0].values[0][0] as string ?? false;
    }

    return false;
}