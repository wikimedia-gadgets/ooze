import { Connection } from "jsstore";
import dbConfigurationSchema from "./schema/Configuration";
import dbPageVisitHistorySchema from "./schema/PageVisitHistory";
import dbUserActionHistorySchema from "./schema/UserActionHistory";
import dbUserCacheSchema from "./schema/UserCache";
import workerInjector from "jsstore/dist/worker_injector";

export default class OozeDb {
    static connection: Connection | null = null;

    // Create the global connection
    public async setGlobalConnection() {
        OozeDb.connection = new Connection();
        OozeDb.connection.addPlugin(workerInjector);

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
    }
}