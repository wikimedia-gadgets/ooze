// Holds warnings given to a user in the past
// We scrape these in the background and store them here
/*
recordId: for tracking of cache values
Username: string
lastUpdated: 
*/


const dbUserCacheSchemaSQL = `--sql
CREATE TABLE IF NOT EXISTS UserData (
    username TEXT NOT NULL,
    recordKey TEXT NOT NULL,
    recordValue TEXT NOT NULL,
    lastUpdated INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    PRIMARY KEY (username, recordKey)
);

-- Add an index for username and recordKey
CREATE INDEX IF NOT EXISTS idx_UserData_username_recordKey
ON UserData (username, recordKey);
`;

export default dbUserCacheSchemaSQL;