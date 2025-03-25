-- Disable SQL lint
-- sql-lint disable

-- Create Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Insert Data
INSERT INTO users (name, email) VALUES
('Kyss Centaur Fuentes', 'kyss.fuentes2@gmail.com'),
('John Karl Garcia', 'helcurtz71@gmail.com');

INSERT INTO users (username, name, email, password, role) VALUES 
('kyssfuentes', 'Kyss Centaur Fuentes', 'kyss.fuentes2@gmail.com', 
'$2b$10$KjDht7tqR3YFQGpVIaMmsO7ypHpJCTZzz5tMwVWuYGRBrX5L/XK1W', 'superadmin');

INSERT INTO users (username, name, email, password, role) VALUES 
('kyssfuentes', 'Kyss Centaur Fuentes', 'kyss.fuentes2@gmail.com', 
'$2b$10$X5gX123abcDEFghiJkLMNOP123456789', 'superadmin');

-- Alter Table
ALTER TABLE users 
ADD COLUMN password TEXT,
ADD COLUMN role VARCHAR(20) DEFAULT 'user';

ALTER TABLE users 
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'customer';

ALTER TABLE users 
ADD COLUMN username VARCHAR(50) UNIQUE;

ALTER TABLE users 
ALTER COLUMN username SET NOT NULL;

-- Update Data
UPDATE users 
SET password = '$2b$10$yAXxkt/iTQ.L008D3vcP7uxm08V/Ku.VeQLKc/HzAozC7YoL1F1y',
    role = 'superadmin'
WHERE email = 'kyss.fuentes2@gmail.com';

UPDATE users 
SET username = CONCAT('user', id)
WHERE username IS NULL;

UPDATE users 
SET password = '$2b$10$X5gX123abcDEFghiJkLMNOP123456789'
WHERE username = 'kyssfuentes';

UPDATE users 
SET username = 'kyssfuentes'
WHERE username = 'user1';

UPDATE users 
SET password = '$2b$10$KcxnEdltrwfq2eWRTwSvsOqHesbJD8gxRsWNwplrn6QpyETYqqphK'
WHERE username = 'kyssfuentes';

UPDATE users 
SET password = '$2b$10$KcxnEdltrwfq2eWRTwSvsOqHesbJD8gxRsWNwplrn6QpyETYqqphK' 
WHERE role = 'superadmin';

UPDATE users 
SET role = 'customer' WHERE role = 'user';
UPDATE users 
SET role = 'employee' WHERE username = 'user2';
UPDATE users 
SET role = 'employee' WHERE username = 'user3';

UPDATE users 
SET password = '$2b$10$B/aNb5TVlIQAaUbFS0WBAe8a.ZPBbzN23qtyoHSVxLMPJ1HMExvTi' WHERE username = 'user2';
UPDATE users 
SET password = '$2b$10$B/aNb5TVlIQAaUbFS0WBAe8a.ZPBbzN23qtyoHSVxLMPJ1HMExvTi' WHERE username = 'user3';

-- Select Queries
SELECT * FROM users;
SELECT id, username, email, role FROM users;
SELECT username, password FROM users WHERE username = 'kyssfuentes';
SELECT username, length(password) FROM users WHERE username = 'kyssfuentes';
SELECT datname FROM pg_database;
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'users';
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
SELECT username, password FROM users WHERE username IN ('user2', 'user3');
SELECT id, username, password FROM users WHERE role = 'superadmin';

-- Grant Privileges
GRANT ALL PRIVILEGES ON DATABASE IT_110_FINAL_PROJECT TO kyss_superadmin;
GRANT ALL PRIVILEGES ON TABLE public."users" TO kyss_superadmin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE public."users_id_seq" TO kyss_superadmin;

-- Drop Table & Database
DROP TABLE users;
DROP DATABASE "IT 110 Final Project";
