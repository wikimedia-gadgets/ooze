// Holds the history of visits to a page

const dbPageVisitHistorySchemaSQL = `--sql
CREATE TABLE IF NOT EXISTS PageVisitHistory (
    pageName TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL
);
`;

export default dbPageVisitHistorySchemaSQL;