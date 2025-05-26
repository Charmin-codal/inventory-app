const pool = require('../db');

async function addToCart(item_id, quantity) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check stock
        const stockCheck = await client.query('SELECT quantity FROM items WHERE id = $1', [item_id]);
        if (stockCheck.rows.length === 0) throw new Error('Item not found');
        if (stockCheck.rows[0].quantity < quantity) throw new Error('Not enough stock available');

        // Add to cart
        const insertCart = await client.query(
            'INSERT INTO cart_items (item_id, quantity) VALUES ($1, $2) RETURNING *',
            [item_id, quantity]
        );

        // Deduct stock
        await client.query('UPDATE items SET quantity = quantity - $1 WHERE id = $2', [quantity, item_id]);

        await client.query('COMMIT');
        return insertCart.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function getCartItems() {
    const result = await pool.query(
        'SELECT ci.id, ci.quantity, ci.added_at, i.name, i.price FROM cart_items ci JOIN items i ON ci.item_id = i.id'
    );
    return result.rows;
}

async function removeCartItem(id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get cart item details
        const cartItem = await client.query('SELECT item_id, quantity FROM cart_items WHERE id = $1', [id]);
        if (cartItem.rows.length === 0) throw new Error('Item not found in cart');

        const { item_id, quantity } = cartItem.rows[0];

        // Restore stock
        await client.query('UPDATE items SET quantity = quantity + $1 WHERE id = $2', [quantity, item_id]);

        // Delete from cart
        await client.query('DELETE FROM cart_items WHERE id = $1', [id]);

        await client.query('COMMIT');
        return { message: 'Item removed and stock restored' };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function updateCartItem(cart_id, new_quantity) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get existing cart item
        const cartItem = await client.query('SELECT item_id, quantity FROM cart_items WHERE id = $1', [cart_id]);
        if (cartItem.rows.length === 0) throw new Error('Cart item not found');

        const { item_id, quantity: old_quantity } = cartItem.rows[0];
        const quantity_diff = new_quantity - old_quantity;

        // Get current stock
        const stockCheck = await client.query('SELECT quantity FROM items WHERE id = $1', [item_id]);
        if (stockCheck.rows.length === 0) throw new Error('Item not found');

        const current_stock = stockCheck.rows[0].quantity;

        // If increasing cart quantity, check if enough stock exists
        if (quantity_diff > 0 && current_stock < quantity_diff) {
            throw new Error('Not enough stock to increase quantity');
        }

        // Update cart quantity
        await client.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [new_quantity, cart_id]);

        // Update stock in items
        await client.query(
            'UPDATE items SET quantity = quantity - $1 WHERE id = $2',
            [quantity_diff, item_id]
        );

        await client.query('COMMIT');
        return { message: 'Cart item updated' };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem,
    updateCartItem
};