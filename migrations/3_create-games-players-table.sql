BEGIN;
    CREATE TABLE IF NOT EXISTS games_players (
        game_uuid VARCHAR(255) NOT NULL REFERENCES games (uuid),
        player_uuid VARCHAR(50) NOT NULL,
        is_ready BOOLEAN NOT NULL,
        is_active BOOLEAN NOT NULL,
        last_ping TIMESTAMP NOT NULL,
        created_datetime TIMESTAMP NOT NULL,
        modified_datetime TIMESTAMP NOT NULL,
        PRIMARY KEY(game_uuid, player_uuid)
    );
    CREATE INDEX IF NOT EXISTS game_uuid_idx ON games_players (game_uuid);
COMMIT;
