const pool = require("../config/db");

const wishlistModel = {
  async getWishlistItems(userId) {
    const query = `
      SELECT w.*, i.name, i.price, i.description 
      FROM wishlist w
      JOIN items i ON w.item_id = i.id
      WHERE w.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async addToWishlist(userId, itemId) {
    const query = `
      INSERT INTO wishlist (user_id, item_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, itemId]);
    return result.rows[0];
  },

  async removeFromWishlist(userId, itemId) {
    const query = `
      DELETE FROM wishlist
      WHERE user_id = $1 AND item_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, itemId]);
    return result.rows[0];
  },

  async isInWishlist(userId, itemId) {
    const query = `
      SELECT * FROM wishlist
      WHERE user_id = $1 AND item_id = $2
    `;
    const result = await pool.query(query, [userId, itemId]);
    return result.rows.length > 0;
  },
};

module.exports = wishlistModel;
