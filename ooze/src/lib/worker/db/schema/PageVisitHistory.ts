// Holds the history of visits to a page

import type { ITable } from "jsstore";

const dbPageVisitHistorySchema: ITable = {
    name : 'PageVisitHistory',
    columns: {
        // The page of the visit
        pageName: {
            primaryKey: true,
            notNull: true,
            dataType: 'string',
        },
        // The timestamp of the visit
        timestamp: {
            notNull: true,
            dataType: 'number', // the typing on this is useless
        },
    }
};

export default dbPageVisitHistorySchema;