// History of actions taken against users
// For example, if visited talk, sent message, warned, blocked, etc.
// This allows for commands like .lw but also to step back like .lw 2

import type { ITable } from "jsstore";

const dbUserActionHistorySchema: ITable = {
    name : 'UserActionHistory',
    columns: {
        // The user of the action
        username: {
            primaryKey: true,
            notNull: true,
            dataType: 'string',
        },
        // The timestamp of the action
        timestamp: {
            notNull: true,
            dataType: 'number', // the typing on this is useless
            default: () => Date.now(),
        },
        // The action taken - warn, block, etc.
        action: {
            notNull: true,
            dataType: 'string',
        },
        // The page the action was taken on
        page: {
            dataType: 'string',
        },
        // The comment left on the action
        comment: {
            dataType: 'string',
        },
    }
};

export default dbUserActionHistorySchema;