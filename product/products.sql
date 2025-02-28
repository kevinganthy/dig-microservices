CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    in_stock BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO 
    products (name, price, description, in_stock)
VALUES 
    ('Product 1', 10.00, 'Description of product 1', true), 
    ('Product 2', 20.00, 'Description of product 2', true), 
    ('Product 3', 30.00, 'Description of product 3', true), 
    ('Product 4', 40.00, 'Description of product 4', true), 
    ('Product 5', 50.00, 'Description of product 5', true);
