/*
Updates the user cache with the new user data
The staleAfter parameter is optional, and if provided, will remove the cache after the specified time
*/

import OozeDb from "../DbConnection";

export default async function UpdateUserCache(
    username: string,
    recordKey: string,
    recordValue: string,
    staleAfter: number = 604800
) {
    if (!OozeDb.connection) {
        throw new Error("Connection not initialized");
    }
    console.log("[oozeWorker/db] update user cache", username, recordKey, recordValue, staleAfter, "seconds")

    // Add the current unix timestamp to staleAfter
    staleAfter += Math.floor(Date.now() / 1000);

    const sqlStatement = `--sql
    INSERT OR REPLACE INTO UserData (username, recordKey, recordValue, lastUpdated, staleAfter)
    VALUES (?, ?, ?, strftime('%s', 'now'), ?);
    `;
    const params = [username, recordKey, recordValue, staleAfter];
    OozeDb.connection.run(sqlStatement, params);
    OozeDb.persistChanges();    
}