BEGIN;
    CREATE TABLE IF NOT EXISTS drawings (
        uuid varchar(255) PRIMARY KEY,
        base64image TEXT NOT NULL,
        created_datetime TIMESTAMP NOT NULL,
        modified_datetime TIMESTAMP NOT NULL
    );
COMMIT;
