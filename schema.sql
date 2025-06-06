-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- Wishlist table
CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_item_id ON cart_items(item_id);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_item_id ON wishlist(item_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_item_id ON order_items(item_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data (optional)
INSERT INTO items (name, description, quantity, price) VALUES
    ('Sample Item 1', 'This is a sample item', 10, 99.99),
    ('Sample Item 2', 'Another sample item', 5, 149.99),
    ('Sample Item 3', 'Yet another sample item', 15, 199.99);

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE items IS 'Stores inventory items';
COMMENT ON TABLE cart_items IS 'Stores user shopping cart items';
COMMENT ON TABLE wishlist IS 'Stores user wishlist items';
COMMENT ON TABLE orders IS 'Stores user orders';
COMMENT ON TABLE order_items IS 'Stores items within each order';

COMMENT ON COLUMN users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN users.username IS 'Unique username for the user';
COMMENT ON COLUMN users.email IS 'Unique email address for the user';
COMMENT ON COLUMN users.password IS 'Hashed password for the user';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last updated';

COMMENT ON COLUMN items.id IS 'Unique identifier for the item';
COMMENT ON COLUMN items.name IS 'Name of the item';
COMMENT ON COLUMN items.description IS 'Description of the item';
COMMENT ON COLUMN items.quantity IS 'Available quantity of the item';
COMMENT ON COLUMN items.price IS 'Price of the item';
COMMENT ON COLUMN items.created_at IS 'Timestamp when the item was created';
COMMENT ON COLUMN items.updated_at IS 'Timestamp when the item was last updated';

COMMENT ON COLUMN cart_items.id IS 'Unique identifier for the cart item';
COMMENT ON COLUMN cart_items.user_id IS 'Reference to the user who owns the cart';
COMMENT ON COLUMN cart_items.item_id IS 'Reference to the item in the cart';
COMMENT ON COLUMN cart_items.quantity IS 'Quantity of the item in the cart';
COMMENT ON COLUMN cart_items.added_at IS 'Timestamp when the item was added to cart';
COMMENT ON COLUMN cart_items.updated_at IS 'Timestamp when the cart item was last updated';

COMMENT ON COLUMN wishlist.id IS 'Unique identifier for the wishlist item';
COMMENT ON COLUMN wishlist.user_id IS 'Reference to the user who owns the wishlist';
COMMENT ON COLUMN wishlist.item_id IS 'Reference to the item in the wishlist';
COMMENT ON COLUMN wishlist.created_at IS 'Timestamp when the item was added to wishlist';

COMMENT ON COLUMN orders.id IS 'Unique identifier for the order';
COMMENT ON COLUMN orders.user_id IS 'Reference to the user who placed the order';
COMMENT ON COLUMN orders.total_amount IS 'Total amount of the order';
COMMENT ON COLUMN orders.status IS 'Current status of the order (pending, completed, cancelled)';
COMMENT ON COLUMN orders.created_at IS 'Timestamp when the order was created';
COMMENT ON COLUMN orders.updated_at IS 'Timestamp when the order was last updated';

COMMENT ON COLUMN order_items.id IS 'Unique identifier for the order item';
COMMENT ON COLUMN order_items.order_id IS 'Reference to the order';
COMMENT ON COLUMN order_items.item_id IS 'Reference to the item';
COMMENT ON COLUMN order_items.quantity IS 'Quantity of the item in the order';
COMMENT ON COLUMN order_items.price_at_time IS 'Price of the item at the time of order';
COMMENT ON COLUMN order_items.created_at IS 'Timestamp when the order item was created'; 