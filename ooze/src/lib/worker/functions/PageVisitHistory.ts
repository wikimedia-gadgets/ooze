// Get page visit history from DB
// NOTE: where clause is *NOT* sanitized, so only use this function where user input is not involved to prevent DB corruption
// or inadvertent injection through the UI

import OozeDb from "../db/DbConnection";

export default async function GetPageVisitHistory(limit: number = 10, offset: number = 0, where: string = "true") {
    const db = OozeDb.connection;

    if (!db) {
        // DB not initialized
        return [];
    }

    // This is a SQL injection risk but there are other ways to access this data if you can do this
    const result = db.exec(`--sql
    SELECT * FROM PageVisitHistory
    WHERE ${where}
    ORDER BY timestamp DESC LIMIT ? OFFSET ?
    `, [limit, offset]);
    if (result.length === 0) {
        return [];
    }

    return result[0].values.map(row => {
        return {
            pageName: row[0],
            pageNamespace: row[1],
            timestamp: row[2]
        };
    });
}