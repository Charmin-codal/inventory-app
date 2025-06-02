const pool = require("../config/db");

const wishlistController = {

  async getWishlist(req, res) {
    try {
      const userId = req.user.id;
      console.log("Getting wishlist for user:", userId);

      const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);
      if (userCheck.rows.length === 0) {
        console.log("User not found:", userId);
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const query = `
        SELECT w.*, i.name, i.description, i.price, i.quantity
        FROM wishlist w
        JOIN items i ON w.item_id = i.id
        WHERE w.user_id = $1
      `;
      console.log("Executing wishlist query for user:", userId);
      const result = await pool.query(query, [userId]);
      console.log("Wishlist query result:", result.rows);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error getting wishlist:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get wishlist",
        details: error.message,
      });
    }
  },

  async addToWishlist(req, res) {
    try {
      const userId = req.user.id;
      const { itemId } = req.body;
      console.log("Adding to wishlist - User:", userId, "Item:", itemId);

      const itemCheck = await pool.query("SELECT * FROM items WHERE id = $1", [
        itemId,
      ]);
      if (itemCheck.rows.length === 0) {
        console.log("Item not found:", itemId);
        return res.status(404).json({
          success: false,
          error: "Item not found",
        });
      }

      const existingItem = await pool.query(
        "SELECT * FROM wishlist WHERE user_id = $1 AND item_id = $2",
        [userId, itemId]
      );

      if (existingItem.rows.length > 0) {
        console.log("Item already in wishlist:", itemId);
        return res.status(400).json({
          success: false,
          error: "Item already in wishlist",
        });
      }

      const query = `
        INSERT INTO wishlist (user_id, item_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      console.log("Adding item to wishlist:", { userId, itemId });
      const result = await pool.query(query, [userId, itemId]);
      console.log("Add to wishlist result:", result.rows[0]);

      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({
        success: false,
        error: "Failed to add item to wishlist",
        details: error.message,
      });
    }
  },

  async removeFromWishlist(req, res) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
      console.log("Removing from wishlist - User:", userId, "Item:", itemId);

      const query = `
        DELETE FROM wishlist
        WHERE user_id = $1 AND item_id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [userId, itemId]);
      console.log("Remove from wishlist result:", result.rows[0]);

      if (result.rows.length === 0) {
        console.log("Item not found in wishlist:", itemId);
        return res.status(404).json({
          success: false,
          error: "Item not found in wishlist",
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({
        success: false,
        error: "Failed to remove item from wishlist",
        details: error.message,
      });
    }
  },
};

module.exports = wishlistController;
