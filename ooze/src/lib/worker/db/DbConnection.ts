import initSqlJs, { type Database } from "sql.js";
import dbConfigurationSchema from "./schema/Configuration";
import dbPageVisitHistorySchema from "./schema/PageVisitHistory";
import dbUserActionHistorySchema from "./schema/UserActionHistory";
import dbUserCacheSchema from "./schema/UserCache";

export default class OozeDb {
    static connection: Database | null = null;

    // Create the global connection
    public async setGlobalConnection() {
        console.log("[OozeDb] Initializing database");
        
        const sql = await initSqlJs({
            locateFile: (url, dir) => {
                console.log(url, dir);
                return '/sql-wasm.wasm';
            },
        });
        const db = new sql.Database();
        OozeDb.connection = db;
        // Create the tables
        db.run(dbConfigurationSchema);
        db.run(dbPageVisitHistorySchema);
        db.run(dbUserActionHistorySchema);
        db.run(dbUserCacheSchema);

        db.run("INSERT INTO Configuration (key, value) VALUES ('version', ?)", [APP_VERSION]);

        console.log(db.exec("SELECT * FROM Configuration"));

        console.log("[OozeDb] Database initialized");
    }
}