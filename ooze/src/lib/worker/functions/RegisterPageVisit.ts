// Register a page visit in the database

import OozeDb from "../db/DbConnection";

export default async function RegisterPageVisit(pageName: string): Promise<boolean> {
    const db = OozeDb.connection;

    if (!db) {
        // DB not initialized
        return false;
    }

    db.run("INSERT OR REPLACE INTO PageVisitHistory (pageName, timestamp) VALUES (?, ?)", [pageName, Math.floor(Date.now() / 1000)]);

    return true;
}