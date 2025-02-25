CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE matrix (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    route VARCHAR(255) NOT NULL,
    read BOOLEAN NOT NULL,
    write BOOLEAN NOT NULL,
    update BOOLEAN NOT NULL,
    delete BOOLEAN NOT NULL
);





INSERT INTO roles (name) VALUES ('admin'), ('user');

INSERT INTO 
    users (firstname, lastname, password, email, role_id)
VALUES 
    ('admin', 'admin', 'admin', 'admin@oclock.io', 1), 
    ('user', 'user', 'user', 'user@oclock.io', 2);

INSERT INTO 
    matrix (role_id, route, read, write, update, delete) 
VALUES 
    (1, '/products', true, true, true, true), 
    (2, '/cart', true, false, false, false);