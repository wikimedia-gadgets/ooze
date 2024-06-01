// Delete the indexed DB of the worker - this also has the consequence of deleting all the data stored in the worker.
// If you choose to also remove the DB connection this also prevents 

import OozeDb from "../db/DbConnection";
import { OozeDexieDB } from "../db/DexieDb";


export default async function DeleteIndexedDb(alsoRemoveDbConnection?: boolean): Promise<boolean> {
    if (!OozeDb.connection) {
        throw new Error("Connection not initialized");
    }

    if (alsoRemoveDbConnection) {
        console.log("[OozeDb] Closing connection to sqlite db");
        OozeDb.connection.close();
        OozeDb.connection = null;
        console.log("[OozeDb] Connection closed");
    }

    console.log("[OozeDb] Clearing everything from indexedDB");

    await OozeDexieDB.dumps.clear();

    console.log("[OozeDb] Cleared indexedDB");
    
    return true;
}