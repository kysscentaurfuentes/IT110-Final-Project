-- Disable SQL lint
-- sql-lint disable
SELECT * FROM users;     --Select users     --Select users     --Select users     --Select users     --Select users     --Select users
-- Create Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
);

-- Insert Data
INSERT INTO users (username, name, email, password, role) VALUES 
('kyssfuentes', 'Kyss Centaur Fuentes', 'kyss.fuentes2@gmail.com', 
'$2b$10$KjDht7tqR3YFQGpVIaMmsO7ypHpJCTZzz5tMwVWuYGRBrX5L/XK1W', 'superadmin'),
('user2', 'John Karl Garcia', 'helcurtz71@gmail.com', 
'$2b$10$B/aNb5TVlIQAaUbFS0WBAe8a.ZPBbzN23qtyoHSVxLMPJ1HMExvTi', 'employee'),
('user3', 'Test User', 'testuser@email.com', 
'$2b$10$B/aNb5TVlIQAaUbFS0WBAe8a.ZPBbzN23qtyoHSVxLMPJ1HMExvTi', 'employee');

-- Alter Table
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'customer';

-- Update Data
UPDATE users 
SET password = '$2b$10$KcxnEdltrwfq2eWRTwSvsOqHesbJD8gxRsWNwplrn6QpyETYqqphK' 
WHERE username = 'kyssfuentes';

UPDATE users SET role = 'customer' WHERE role = 'user';
UPDATE users SET role = 'employee' WHERE username IN ('user2', 'user3');

UPDATE users 
SET password = '$2b$10$B/aNb5TVlIQAaUbFS0WBAe8a.ZPBbzN23qtyoHSVxLMPJ1HMExvTi' 
WHERE username IN ('user2', 'user3');

-- Select Queries
SELECT * FROM users;
SELECT current_user;
SELECT id, username, email, role FROM users;
SELECT username, password FROM users WHERE username = 'kyssfuentes';
SELECT username, length(password) FROM users WHERE username = 'kyssfuentes';
SELECT datname FROM pg_database;
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'users';
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
SELECT username, password FROM users WHERE username IN ('user2', 'user3');
SELECT id, username, password FROM users WHERE role = 'superadmin';

-- Grant Privileges
GRANT ALL PRIVILEGES ON DATABASE "IT_110_FINAL_PROJECT" TO kyss_superadmin;
GRANT ALL PRIVILEGES ON TABLE public.users TO kyss_superadmin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE public.users_id_seq TO kyss_superadmin;

-- Drop Table & Database
DROP TABLE users;
DROP DATABASE "IT_110_FINAL_PROJECT";

-- Check Privileges & Roles
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public';

SELECT datname, pg_catalog.pg_get_userbyid(datdba) AS owner 
FROM pg_database
WHERE datname = 'IT_110_FINAL_PROJECT';

SELECT rolname, rolsuper, rolcreaterole, rolcreatedb 
FROM pg_roles;

-- User & Database Creation
SELECT current_user;
CREATE DATABASE kyss_superadmin OWNER kyss_superadmin;

SELECT datname FROM pg_database;

ALTER USER postgres WITH PASSWORD 'new_secure_password';
ALTER ROLE kyss_superadmin WITH SUPERUSER;

ALTER ROLE postgres WITH NOLOGIN;

CREATE ROLE normal_user WITH LOGIN PASSWORD 'password123';
GRANT CONNECT ON DATABASE it_110_final_project TO normal_user;