CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO users (name, email) VALUES
('Kyss Centaur Fuentes', 'kyss.fuentes2@gmail.com'),
('John Karl Garcia', 'johnkarl2@gmail.com');

SELECT * FROM users;
DROP TABLE users;

SELECT datname FROM pg_database;

SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'users';

SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'users';

GRANT ALL PRIVILEGES ON DATABASE IT_110_FINAL_PROJECT TO kyss_superadmin;

GRANT ALL PRIVILEGES ON TABLE users TO kyss_superadmin;

DROP DATABASE "IT 110 Final Project";  

\c postgres;