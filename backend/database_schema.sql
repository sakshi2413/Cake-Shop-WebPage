
CREATE DATABASE IF NOT EXISTS cake_xpress_db;
USE cake_xpress_db;

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);


INSERT INTO products (name, category, price, image, description) VALUES

('Chocolate Truffle Cake', 'cake', 450.00, 'images/chocolate cake.jpeg', 'Rich and decadent chocolate truffle cake'),
('Brownie Cake', 'cake', 450.00, 'images/brownie cake.jpeg', 'Moist brownie-style chocolate cake'),
('Swiss Chocolate Cake', 'cake', 450.00, 'images/swiss chocolate cake.jpeg', 'Classic Swiss chocolate cake'),
('Vanilla Cake', 'cake', 400.00, 'images/vanilla cake.jpeg', 'Light and fluffy vanilla sponge cake'),
('Red Velvet Cake', 'cake', 500.00, 'images/red velvet.jpeg', 'Smooth red velvet with cream cheese frosting'),
('Black Forest Cake', 'cake', 480.00, 'images/black forest.jpeg', 'Classic black forest with cherries'),
('Strawberry Cake', 'cake', 420.00, 'images/strawberry cake.jpeg', 'Fresh strawberry flavored cake'),
('Butterscotch Cake', 'cake', 450.00, 'images/butterscotch.jpeg', 'Creamy butterscotch cake'),


('Chocolate Brownie', 'pastry', 80.00, 'images/brownie.jpeg', 'Fudgy chocolate brownie'),
('Blueberry Muffin', 'pastry', 60.00, 'images/muffin.jpeg', 'Fresh blueberry muffins'),
('Croissant', 'pastry', 70.00, 'images/croissant.jpeg', 'Buttery French croissant'),
('Danish Pastry', 'pastry', 90.00, 'images/danish.jpeg', 'Sweet Danish pastry'),
('Macarons', 'pastry', 120.00, 'images/macroons.jpeg', 'Colorful French macarons'),
('Eclair', 'pastry', 85.00, 'images/eclair.jpeg', 'Chocolate eclair with cream filling'),
('Fruit Tart', 'pastry', 110.00, 'images/tart.jpeg', 'Fresh fruit tart'),
('Cupcakes', 'pastry', 75.00, 'images/cupcake.jpeg', 'Assorted cupcakes'),


('Pistachio Cake', 'new-arrival', 550.00, 'images/pistachio.jpeg', 'Premium pistachio flavored cake'),
('Lotus Biscoff Cake', 'new-arrival', 520.00, 'images/lotus.jpeg', 'Trending lotus biscoff cake'),
('Mango Cake', 'new-arrival', 480.00, 'images/mango.jpeg', 'Seasonal mango delight cake'),
('Oreo Cake', 'new-arrival', 490.00, 'images/oreo.jpeg', 'Cookies and cream Oreo cake');
