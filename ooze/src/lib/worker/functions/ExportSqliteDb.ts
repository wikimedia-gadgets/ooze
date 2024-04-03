// Export the sqlite database to a file. Returns a blob URL

import OozeDb from "../db/DbConnection";

export default async function ExportSqliteDb(): Promise<Uint8Array> {
    if (!OozeDb.connection) {
        throw new Error("Connection not initialized");
    }

    console.log("[OozeDb] Exporting database");

    const data = OozeDb.connection.export();

    console.log("[OozeDb] Got data from database");

    return data;
}