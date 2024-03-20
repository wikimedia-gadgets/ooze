// History of actions taken against users
// For example, if visited talk, sent message, warned, blocked, etc.
// This allows for commands like .lw but also to step back like .lw 2


const dbUserActionHistorySchemaSQL = `--sql
CREATE TABLE IF NOT EXISTS UserActionHistory (
    username TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    action TEXT NOT NULL,
    page TEXT,
    comment TEXT
);
`;

export default dbUserActionHistorySchemaSQL;