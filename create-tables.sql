-- Create your database tables here. Alternatively you may use an ORM
-- or whatever approach you prefer to initialize your database.
CREATE TABLE example_table (id SERIAL PRIMARY KEY, some_int INT, some_text TEXT);
INSERT INTO example_table (some_int, some_text) VALUES (123, 'hello');

CREATE TABLE IF NOT EXISTS spacing_table (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,

    margin_top VARCHAR(10) NOT NULL DEFAULT 'auto',
    margin_right VARCHAR(10) NOT NULL DEFAULT 'auto',
    margin_bottom VARCHAR(10) NOT NULL DEFAULT 'auto',
    margin_left VARCHAR(10) NOT NULL DEFAULT 'auto',

    padding_top VARCHAR(10) NOT NULL DEFAULT 'auto',
    padding_right VARCHAR(10) NOT NULL DEFAULT 'auto',
    padding_bottom VARCHAR(10) NOT NULL DEFAULT 'auto',
    padding_left VARCHAR(10) NOT NULL DEFAULT 'auto'
);


INSERT INTO spacing_table (
    user_id,
    margin_top,
    margin_right,
    margin_bottom,
    margin_left,
    padding_top,
    padding_right,
    padding_bottom,
    padding_left
)
VALUES (
    'd8ff1328-ff05-4bd8-9b86-a9ff470dd2b4',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto'
)