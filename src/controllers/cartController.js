const Cart = require('../models/cartModel');

exports.addItem = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        if (!req.body) {
          return res.status(400).json({
            success: false,
            error: "Request body is missing",
          });
        }

        const { item_id, quantity } = req.body;

        if (!item_id || !quantity) {
          return res.status(400).json({
            success: false,
            error: "Missing required fields",
            details: {
              item_id: !item_id ? "item_id is required" : null,
              quantity: !quantity ? "quantity is required" : null,
            },
          });
        }

        const newItem = await Cart.addToCart(item_id, quantity);
        res.status(201).json({
          success: true,
          data: newItem,
        });
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(400).json({
          success: false,
          error: err.message,
        });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await Cart.getCartItems();
        res.json({
          success: true,
          data: items.map((item) => ({
            id: item.id,
            item_id: item.item_id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            stock_quantity: item.stock_quantity,
            added_at: item.added_at,
          })),
        });
    } catch (err) {
        console.error("Error getting cart items:", err);
        res.status(500).json({
          success: false,
          error: err.message,
        });
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