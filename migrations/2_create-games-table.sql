BEGIN;
    CREATE TABLE IF NOT EXISTS games (
        uuid VARCHAR(255) PRIMARY KEY,
        owner_uuid VARCHAR(50) NOT NULL,
        invite VARCHAR(50) NOT NULL,
        players JSONB NOT NULL,
        state VARCHAR(50) NOT NULL,
        created_datetime TIMESTAMP NOT NULL,
        modified_datetime TIMESTAMP NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS invite_idx ON games (invite);
COMMIT;
