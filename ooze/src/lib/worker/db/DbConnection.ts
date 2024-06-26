import initSqlJs, { type Database } from "sql.js";
import dbConfigurationSchema from "./schema/Configuration";
import dbPageVisitHistorySchema from "./schema/PageVisitHistory";
import dbUserActionHistorySchema from "./schema/UserActionHistory";
import dbUserCacheSchema from "./schema/UserCache";
import { OozeDexieDB } from "./DexieDb";

export default class OozeDb {
    static connection: Database | null = null;

    static async persistChanges() {
        if (!OozeDb.connection) {
            throw new Error("Connection not initialized");
        }

        console.log("[OozeDb] Persisting changes");

        const data = OozeDb.connection.export();

        console.log("[OozeDb] Got data from database");

        const id = await OozeDexieDB.dumps.put({ data, id: 1 });

        console.log("[OozeDb] Persisted data to indexedDB", id);
    }

    static async getPersistedData(): Promise<Uint8Array | null> {
        // Get the data from indexedDB
        const data = await OozeDexieDB.dumps.get(1);
        if (!data) return null;
        return data.data;
    }

    // Create the global connection
    public async setGlobalConnection() {
        console.log("[OozeDb] Initializing database");

        const sql = await initSqlJs({
            locateFile: () => '/sql-wasm.wasm',
        });

        // Check for persisted data
        const idbSession = indexedDB.open("oozeDb", 1);
        let binary: string | null = null;

        idbSession.onerror = (event) => {
            console.error("[OozeDb] Error opening indexedDB", event);
        }


        let db: Database;

        const persistedData = await OozeDb.getPersistedData();

        if (persistedData) {
            // Load the database
            const arr = new Uint8Array(persistedData);
            db = new sql.Database(arr);
        } else {
            db = new sql.Database();
        }

        OozeDb.connection = db;

        // Create/migrate the tables
        console.log("[OozeDb] Creating/migrating tables");
        console.log("[OozeDb] Configuration");
        db.run(dbConfigurationSchema);
        console.log("[OozeDb] PageVisitHistory");
        db.run(dbPageVisitHistorySchema);
        console.log("[OozeDb] UserActionHistory");
        db.run(dbUserActionHistorySchema);
        console.log("[OozeDb] UserCache");
        db.run(dbUserCacheSchema);
        console.log("[OozeDb] Done creating/migrating tables");

        db.run(`--sql
        INSERT OR REPLACE INTO Configuration (key, value) VALUES ('version', ?)
        `, [APP_VERSION]);
        
        OozeDb.persistChanges();

        console.log("[OozeDb] Database initialized");
    }
}