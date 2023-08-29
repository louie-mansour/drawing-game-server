BEGIN;
    CREATE TABLE IF NOT EXISTS drawings (
        id varchar(255) PRIMARY KEY,
        drawing BYTEA NOT NULL,
        created_datetime TIMESTAMP NOT NULL,
        modified_datetime TIMESTAMP NOT NULL
    );
COMMIT;
