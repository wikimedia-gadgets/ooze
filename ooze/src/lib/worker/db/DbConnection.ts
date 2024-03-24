import initSqlJs, { type Database } from "sql.js";
import dbConfigurationSchema from "./schema/Configuration";
import dbPageVisitHistorySchema from "./schema/PageVisitHistory";
import dbUserActionHistorySchema from "./schema/UserActionHistory";
import dbUserCacheSchema from "./schema/UserCache";

export default class OozeDb {
    static connection: Database | null = null;

    // Todo: add a global connection for idb

    static async persistChanges() {
        if (!OozeDb.connection) {
            throw new Error("Connection not initialized");
        }

        console.log("[OozeDb] Persisting changes");

        const data = OozeDb.connection.export();

        // Convert the data to a binary string
        const buffer = Buffer.from(data);

        // Make buffer into a base64 string
        const binary = buffer.toString("binary");

        // Open a database connection
        let openRequest = indexedDB.open("OozeDb", 1);

        openRequest.onupgradeneeded = function () {
            // The database did not previously exist, so create object stores and indexes.
            let db = openRequest.result;
            db.createObjectStore("OozeStore", { autoIncrement: true });
        };

        openRequest.onsuccess = function () {
            console.log("[OozeDb] Database dumped - idb opened");

            let db = openRequest.result;
            let tx = db.transaction("OozeStore", "readwrite");
            let store = tx.objectStore("OozeStore");

            // Save the buffer to the object store
            store.put(binary);

            tx.oncomplete = function () {
                console.log("[OozeDb] Data saved to indexedDB");
                db.close();
            };

            tx.onerror = function (event) {
                // Handle errors!
                console.error("[OozeDb] Error saving data to indexedDB", event);
            }
        };

        openRequest.onerror = function (event) {
            // Handle errors!
            console.error("[OozeDb] IDB Database error", event);
        };
    }

    static async getPersistedData(): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const idbSession = indexedDB.open("oozeDb", 1);

            idbSession.onupgradeneeded = function () {
                // The database did not previously exist, so create object stores and indexes.
                let db = idbSession.result;
                db.createObjectStore("OozeStore", { autoIncrement: true });
            };

            idbSession.onsuccess = function () {
                try {
                    let db = idbSession.result;
                    let tx = db.transaction("OozeStore", "readonly");
                    let store = tx.objectStore("OozeStore");

                    // Retrieve the binary data from the object store
                    let getRequest = store.get(1); // Assuming the id of the data is 1

                    getRequest.onsuccess = function () {
                        console.log("[OozeDb] Persisted data found in indexedDB");
                        resolve(getRequest.result);
                    };

                    tx.oncomplete = function () {
                        db.close();
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
            };

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
            const buffer = Buffer.from(persistedData, "binary");
            const arr = new Uint8Array(buffer);
            db = new sql.Database(arr);
        } else {
            db = new sql.Database();
        }

        OozeDb.connection = db;
        // Create the tables
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