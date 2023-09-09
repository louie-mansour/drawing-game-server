BEGIN;
    CREATE TABLE IF NOT EXISTS drawing_parts (
        uuid varchar(255) PRIMARY KEY,
        base_64_image TEXT NOT NULL,
        owner_uuid VARCHAR(50) NOT NULL,
        contributor_uuid VARCHAR(50) NOT NULL,
        game_uuid VARCHAR(50) NOT NULL,
        created_datetime TIMESTAMP NOT NULL,
        modified_datetime TIMESTAMP NOT NULL
    );
    CREATE INDEX IF NOT EXISTS game_uuid_idx ON drawing_parts (game_uuid);
COMMIT;
