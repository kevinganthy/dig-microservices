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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matrix (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    route VARCHAR(255) NOT NULL,
    r VARCHAR(255) NOT NULL,
    w VARCHAR(255) NOT NULL,
    u VARCHAR(255) NOT NULL,
    d VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





INSERT INTO roles (name) VALUES ('admin'), ('user');

INSERT INTO 
    users (firstname, lastname, password, email, role_id)
VALUES 
    ('admin', 'admin', 'dfff2e7a5322e4f629109986359ce0bafc6061a68030aba1685ac2a7f6ac1efbb753c6a8cbfac8b73374b63b6e48bacbd7712e5bf58a18473968508f6e27a539.0671a48f9c7849c9ecc02c86713b5636', 'admin@oclock.io', 1), 
    ('user', 'user', '17ce4330029bd1ffe242c27c90489c83e7fcceb96b9e53a8eaba45a1e5d5b7918e3bc9e8d7e3107aaf5ce65c8bd9e5bbdbfdbe1690c50be5d4ee7556963c1020.6de33b7a73eae765499d2dd8fdb93261', 'user@oclock.io', 2);

INSERT INTO 
    matrix (role_id, route, r, w, u, d) 
VALUES 
    (1, '^/products$', 'yes', 'yes', 'yes', 'no'),
    (1, '^/carts/clients/\d+$', 'yes', 'no', 'no', 'no'),
    (1, '^/carts/clients/\d+/products/\d+$', 'yes', 'yes', 'yes', 'yes'),
    (2, '^/carts/clients/\d+$', 'self', 'no', 'no', 'no'),
    (2, '^/carts/clients/\d+/products/\d+$', 'no', 'no', 'self', 'no');