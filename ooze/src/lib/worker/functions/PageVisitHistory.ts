// Get page visit history from DB

import OozeDb from "../db/DbConnection";

export default async function GetPageVisitHistory(limit: number = 10, offset: number = 0) {
    const db = OozeDb.connection;

    if (!db) {
        // DB not initialized
        return [];
    }

    const result = db.exec(`--sql
    SELECT * FROM PageVisitHistory ORDER BY timestamp DESC LIMIT ? OFFSET ?
    `, [limit, offset]);
    if (result.length === 0) {
        return [];
    }

    return result[0].values.map(row => {
        return {
            pageName: row[0],
            timestamp: row[1]
        };
    });
}