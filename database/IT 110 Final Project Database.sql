-- Disable SQL lint
-- sql-lint disable
-- Type the urgent SQL here
SELECT username, password FROM users WHERE username = 'kyssfuentes';
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

-- USERS TABLE (Technicians, Plumbers, Clients)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Water Line Technician', 'Plumber', 'Client')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SERVICE REQUESTS TABLE (Reports of Water Leaks)
CREATE TABLE service_requests (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES users(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) CHECK (severity IN ('Emergency', 'Major Leak', 'Minor Leak', 'Rejected')),
    status VARCHAR(50) CHECK (status IN ('Completed', 'In Progress', 'Rejected', 'On Hold')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- IMAGES TABLE (Leak Images for Service Requests)
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    service_request_id INT REFERENCES service_requests(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- COMMENTS TABLE (Technicians/Plumbers Adding Notes to Requests)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    service_request_id INT REFERENCES service_requests(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NOTIFICATIONS TABLE (Sending Updates to Clients & Technicians)
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- WORK_ORDERS TABLE (Assigning Technicians & Scheduling Visits)
CREATE TABLE work_orders (
    id SERIAL PRIMARY KEY,
    service_request_id INT REFERENCES service_requests(id) ON DELETE CASCADE,
    technician_id INT REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP DEFAULT NOW(),  -- When technician is assigned
    scheduled_date TIMESTAMP NOT NULL,  -- Scheduled visit date
    completed_at TIMESTAMP,  -- When job is completed
    status VARCHAR(50) CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'In Progress', 'Completed')) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- SYSTEM LOGS TABLE (Tracks All Activities)
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- SELECT TABLES
select * from users;
select * from service_requests;
select * from images;
select * from comments;
select * from notifications;
select * from work_orders;
select * from system_logs;

-- DROP TABLES
drop table users;
drop table service_requests;
drop table images;
drop table comments;
drop table notifications;
drop table work_orders;
drop table system_logs;