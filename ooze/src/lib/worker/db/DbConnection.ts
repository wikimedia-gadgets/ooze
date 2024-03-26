import initSqlJs, { type Database } from "sql.js";
import dbConfigurationSchema from "./schema/Configuration";
import dbPageVisitHistorySchema from "./schema/PageVisitHistory";
import dbUserActionHistorySchema from "./schema/UserActionHistory";
import dbUserCacheSchema from "./schema/UserCache";

export default class OozeDb {
    static connection: Database | null = null;

    // Todo: add a global connection for idb

    static idbConnection: IDBDatabase | null = null;

    static getIDBConnection() {
        if (OozeDb.idbConnection) {
            return OozeDb.idbConnection;
        }

        return new Promise<IDBDatabase>((resolve, reject) => {
            const idbSession = indexedDB.open("oozeDb", Date.now());

            idbSession.onupgradeneeded = function () {
                // The database did not previously exist, so create object stores and indexes.
                const db = idbSession.result;
                if (!db.objectStoreNames.contains('OozeStore')) {
                    console.log("[OozeDb] Creating object store in indexedDB");
                    db.createObjectStore("OozeStore");
                }
            };

            idbSession.onsuccess = function () {
                OozeDb.idbConnection = idbSession.result;
                console.log("[OozeDb] Opened indexedDB connection");
                resolve(OozeDb.idbConnection);
            };

            idbSession.onerror = function (event) {
                // Handle errors!
                console.error("[OozeDb] Error opening indexedDB", event);
                reject(event);
            };

            idbSession.onblocked = function (event) {
                // Handle errors!
                console.error("[OozeDb] IndexedDB connection blocked", event);
                reject(event);
            }
        });
    }

    static async persistChanges() {
        if (!OozeDb.connection) {
            throw new Error("Connection not initialized");
        }

        console.log("[OozeDb] Persisting changes");

        const data = OozeDb.connection.export();

        console.log("[OozeDb] Got data from database");

        // Open a database connection
        const idbConnection = await OozeDb.getIDBConnection();
        console.log("[OozeDb] Got IDB connection");

       const tx = idbConnection.transaction("OozeStore", "readwrite");

        // Save the buffer to the object store
        tx.objectStore("OozeStore").put(data, "oozeDbData");

        tx.oncomplete = function () {
            console.log("[OozeDb] Data saved to indexedDB");
        };

        tx.onerror = function (event) {
            // Handle errors!
            console.error("[OozeDb] Error saving data to indexedDB", event);
        }

        tx.oncomplete = function () {
            idbConnection.close();
        }
    }

    static getPersistedData(): Promise<Uint8Array | null> {
        return new Promise(async (resolve, reject) => {
            const idbSession = await OozeDb.getIDBConnection();

            try {
                
                // Get the data from the object store
                const tx = idbSession.transaction("OozeStore", "readonly");
                const getRequest = tx.objectStore("OozeStore").get("oozeDbData");

                getRequest.onsuccess = function () {
                    console.log("[OozeDb] Persisted data found in indexedDB");
                    resolve(getRequest.result);
                };
            } catch (error) {
                // @ts-ignore
                if (error.name === "NotFoundError") {
                    // No data found
                    console.log("[OozeDb] No persisted data found in indexedDB");
                    resolve(null);
                    return;
                }

                console.error("[OozeDb] Error reading indexedDB", error);
                reject(error);
            }

            idbSession.onerror = function (event) {
                // Handle errors!
                console.error("[OozeDb] Error opening indexedDB", event);
                reject(event);
            };
        });
    }

    // Create the global connection
    public async setGlobalConnection() {
        console.log("[OozeDb] Initializing database");

        const sql = await initSqlJs({
            locateFile: (url, dir) => {
                console.log(url, dir);
                return '/sql-wasm.wasm';
            },
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
        db.run(dbConfigurationSchema);
        db.run(dbPageVisitHistorySchema);
        db.run(dbUserActionHistorySchema);
        db.run(dbUserCacheSchema);

        db.run("INSERT INTO Configuration (key, value) VALUES ('version', ?)", [APP_VERSION]);

        console.log(db.exec("SELECT * FROM Configuration"));

        OozeDb.persistChanges();

        console.log("[OozeDb] Database initialized");
    }
}