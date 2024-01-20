import { Connection } from "jsstore";
import jsStoreWorker from 'jsstore/dist/jsstore.worker.min.js?worker';
import dbConfigurationSchema from "./schema/Configuration";
import dbPageVisitHistorySchema from "./schema/PageVisitHistory";
import dbUserActionHistorySchema from "./schema/UserActionHistory";
import dbUserCacheSchema from "./schema/UserCache";

export default class OozeDb {
    static connection: Connection | null = null;

    // Create the global connection
    public async setGlobalConnection() {
        OozeDb.connection = new Connection(new jsStoreWorker());
        OozeDb.connection.logStatus = true;

        console.log("[OozeDb] Initializing database");
        try {
            await OozeDb.connection.initDb({
                name: "OozeDB",
                tables: [
                    dbConfigurationSchema,
                    dbPageVisitHistorySchema,
                    dbUserActionHistorySchema,
                    dbUserCacheSchema,
                ],
            });
        } catch (error) {
            console.error("Failed to initialize database", error);
        }
        console.log("[OozeDb] Database initialized");
    }
}