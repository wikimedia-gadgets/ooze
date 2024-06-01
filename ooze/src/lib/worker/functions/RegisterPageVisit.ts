// Register a page visit in the database

import OozeDb from "../db/DbConnection";

export default async function RegisterPageVisit(pageName: string, namespace: string): Promise<boolean> {
    const db = OozeDb.connection;

    if (!db) {
        // DB not initialized
        return false;
    }
    // Note: we add namespace as it'll allow us to easily filter by namespace (i.e. last userpage visited, last article visited, etc.)
    db.run(`--sql
    INSERT OR REPLACE INTO PageVisitHistory (pageName, namespace, timestamp) VALUES (?, ?, ?)
    `, [pageName, namespace, Math.floor(Date.now() / 1000)]);

    // Save changes
    OozeDb.persistChanges();

    return true;
}