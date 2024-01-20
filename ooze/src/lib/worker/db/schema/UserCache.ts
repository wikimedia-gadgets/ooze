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

import type { ITable } from "jsstore";

const dbUserCacheSchema: ITable = {
    name : 'UserCache',
    columns: {
        // The user of the warning
        username: {
            primaryKey: true,
            notNull: true,
            dataType: 'string',
        },
        // Last updated to make sure the cache is not stale
        lastUpdated: {
            notNull: true,
            dataType: 'number', // the typing on this is useless
        },
        // Highest warning level
        highestWarningLevel: {
            notNull: true,
            dataType: 'number',
        },

        // Last warning timestamp
        lastWarningTimestamp: {
            notNull: true,
            dataType: 'number',
        },

        // Is reported to AIV
        isReportedToAiv: {
            notNull: true,
            dataType: 'boolean',
        },

        // Is blocked
        blocked: {
            notNull: true,
            dataType: 'boolean',
        },


        // Blocked by
        blockedBy: {
            dataType: 'string',
        },

        // Blocked timestamp
        blockedTimestamp: {
            dataType: 'number',
        },

        // Blocked reason
        blockedReason: {
            dataType: 'string',
        },

        // Has been blocked before
        hasBeenBlockedBefore: {
            notNull: true,
            dataType: 'boolean',
        },

        // User rights (json encoded string)
        userRights: {
            dataType: 'string',
        },

        // ORES average good faith
        oresAverageGoodFaith: {
            dataType: 'number',
        },

        // ORES average damaging
        oresAverageDamaging: {
            dataType: 'number',
        },
    }
};

export default dbUserCacheSchema;