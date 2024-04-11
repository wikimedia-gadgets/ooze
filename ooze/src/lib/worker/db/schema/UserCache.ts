// Holds warnings given to a user in the past
// We scrape these in the background and store them here
/*
Expires by default in 7 days from record creation
*/


const dbUserCacheSchemaSQL = `--sql
CREATE TABLE IF NOT EXISTS UserData (
    username TEXT NOT NULL,
    recordKey TEXT NOT NULL,
    recordValue TEXT NOT NULL,
    lastUpdated INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    staleAfter INTEGER NOT NULL DEFAULT (strftime('%s', 'now') + 604800),
    PRIMARY KEY (username, recordKey)
);

-- Add an index for username and recordKey
CREATE INDEX IF NOT EXISTS idx_UserData_username_recordKey
ON UserData (username, recordKey);

-- If staleAfter is in the past, we should delete the record
-- This is done by a trigger
CREATE TRIGGER IF NOT EXISTS UserData_staleAfter_trigger
AFTER INSERT ON UserData
BEGIN
    DELETE FROM UserData WHERE staleAfter < strftime('%s', 'now');
END;
`;

export default dbUserCacheSchemaSQL;