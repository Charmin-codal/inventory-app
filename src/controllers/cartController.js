const Cart = require('../models/cartModel');

exports.addItem = async (req, res) => {
    try {
        const { item_id, quantity } = req.body;
        if (!item_id || !quantity) {
            return res.status(400).json({ error: 'Missing item_id or quantity' });
        }
        const newItem = await Cart.addToCart(item_id, quantity);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await Cart.getCartItems();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.removeItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Cart.removeCartItem(id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity) return res.status(400).json({ error: 'Missing quantity' });

        const result = await Cart.updateCartItem(id, quantity);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};