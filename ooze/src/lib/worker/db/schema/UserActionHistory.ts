// History of actions taken against users
// For example, if visited talk, sent message, warned, blocked, etc.
// This allows for commands like .lw but also to step back like .lw 2

// By default, the expiry is 1 week.


// const dbUserActionHistorySchemaSQL = `--sql
// CREATE TABLE IF NOT EXISTS UserActionHistory (
//     username TEXT PRIMARY KEY NOT NULL,
//     timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
//     action TEXT NOT NULL,
//     page TEXT,
//     comment TEXT,
//     expiry INTEGER NOT NULL DEFAULT (strftime('%s', 'now') + 604800),
// );

// -- Add the expiry trigger
// CREATE TRIGGER IF NOT EXISTS UserActionHistoryExpiry
// BEFORE INSERT ON UserActionHistory
// BEGIN
//     DELETE FROM UserActionHistory WHERE strftime('%s', 'now') > expiry;
// END;
// `;

export default "";