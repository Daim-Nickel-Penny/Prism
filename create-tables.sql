-- Create your database tables here. Alternatively you may use an ORM
-- or whatever approach you prefer to initialize your database.
CREATE TABLE example_table (id SERIAL PRIMARY KEY, some_int INT, some_text TEXT);
INSERT INTO example_table (some_int, some_text) VALUES (123, 'hello');

CREATE TABLE IF NOT EXISTS spacing_table (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    component_id VARCHAR(36) NOT NULL,

    margin_top_value VARCHAR(5) NOT NULL DEFAULT 0,
    margin_top_unit VARCHAR(5) NOT NULL DEFAULT 'px',
    
    margin_right_value VARCHAR(5) NOT NULL DEFAULT 0,
    margin_right_unit VARCHAR(5) NOT NULL DEFAULT 'px',
    
    margin_bottom_value VARCHAR(5) NOT NULL DEFAULT 0,
    margin_bottom_unit VARCHAR(5) NOT NULL DEFAULT 'px',
    
    margin_left_value VARCHAR(5) NOT NULL DEFAULT 0,
    margin_left_unit VARCHAR(5) NOT NULL DEFAULT 'px',

    padding_top_value VARCHAR(5) NOT NULL DEFAULT 0,
    padding_top_unit VARCHAR(5) NOT NULL DEFAULT 'px',
    
    padding_right_value VARCHAR(5) NOT NULL DEFAULT 0,
    padding_right_unit VARCHAR(5) NOT NULL DEFAULT 'px',
    
    padding_bottom_value VARCHAR(5) NOT NULL DEFAULT 0,
    padding_bottom_unit VARCHAR(5) NOT NULL DEFAULT 'px',
    
    padding_left_value VARCHAR(5) NOT NULL DEFAULT 0,
    padding_left_unit VARCHAR(5) NOT NULL DEFAULT 'px'

);


-- INSERT INTO spacing_table (
--     user_id,
--     project_id,
--     component_id,
--     margin_top_value, margin_top_unit,
--     margin_right_value, margin_right_unit,
--     margin_bottom_value, margin_bottom_unit,
--     margin_left_value, margin_left_unit,
--     padding_top_value, padding_top_unit,
--     padding_right_value, padding_right_unit,
--     padding_bottom_value, padding_bottom_unit,
--     padding_left_value, padding_left_unit
-- )
-- VALUES (
--     'd8ff1328-ff05-4bd8-9b86-a9ff470dd2b4',
--     0, 'auto',
--     0, 'auto',
--     0, 'auto',
--     0, 'auto',
--     0, 'auto',
--     0, 'auto',
--     0, 'auto',
--     0, 'auto'
-- );
