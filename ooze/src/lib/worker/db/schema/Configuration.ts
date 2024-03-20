const dbConfigurationSchemaSql = `
CREATE TABLE IF NOT EXISTS Configuration (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
);
`;

export default dbConfigurationSchemaSql;