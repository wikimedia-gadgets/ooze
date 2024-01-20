import type { ITable } from "jsstore";

const dbConfigurationSchema: ITable = {
    name : 'Configuration',
    columns: {
        // Configuration key
        key: {
            primaryKey: true,
            notNull: true,
            dataType: 'string',
        },
        // Configuration value - can be null if not set
        value: {
            dataType: 'string',
        },
    }
};

export default dbConfigurationSchema;