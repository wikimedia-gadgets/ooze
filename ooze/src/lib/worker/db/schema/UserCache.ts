// Holds warnings given to a user in the past
// We scrape these in the background and store them here
/*
Username: string
HighestWarningLevel: number (0-5, 5 being 4im)
LastWarningTimestamp: number
IsReportedToAiv: boolean
Blocked: boolean
BlockedBy: string
BlockedTimestamp: number
BlockedReason: string
HasBeenBlockedBefore: boolean
User rights: string[] (autoconfirmed, sysop, etc)
ORES Average Good faith: number (0-1)
ORES Average Damaging: number (0-1)
*/


const dbUserCacheSchemaSQL = `
CREATE TABLE IF NOT EXISTS UserCache (
    username TEXT PRIMARY KEY NOT NULL,
    lastUpdated INTEGER NOT NULL,
    highestWarningLevel INTEGER NOT NULL,
    lastWarningTimestamp INTEGER NOT NULL,
    isReportedToAiv BOOLEAN NOT NULL,
    blocked BOOLEAN NOT NULL,
    blockedBy TEXT,
    blockedTimestamp INTEGER,
    blockedReason TEXT,
    hasBeenBlockedBefore BOOLEAN NOT NULL,
    userRights TEXT,
    oresAverageGoodFaith REAL,
    oresAverageDamaging REAL
);
`;

export default dbUserCacheSchemaSQL;