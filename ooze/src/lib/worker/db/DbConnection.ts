import initSqlJs, { type Database } from "sql.js";
import dbConfigurationSchema from "./schema/Configuration";
import dbPageVisitHistorySchema from "./schema/PageVisitHistory";
import dbUserActionHistorySchema from "./schema/UserActionHistory";
import dbUserCacheSchema from "./schema/UserCache";

export default class OozeDb {
    static connection: Database | null = null;

    // Create the global connection
    public async setGlobalConnection() {
        const sql = await initSqlJs();
        const db = new sql.Database();
        OozeDb.connection = db;
        // Create the tables
        db.run(dbConfigurationSchema);
        db.run(dbPageVisitHistorySchema);
        db.run(dbUserActionHistorySchema);
        db.run(dbUserCacheSchema);

        console.log("[OozeDb] Database initialized");
    }
}