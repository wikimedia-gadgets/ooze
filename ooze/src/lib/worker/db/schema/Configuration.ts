const dbConfigurationSchemaSql = `--sql
CREATE TABLE IF NOT EXISTS Configuration (
    key TEXT PRIMARY KEY NOT NULL CHECK(length(key) > 0),
    value TEXT
);
`;

export default dbConfigurationSchemaSql;