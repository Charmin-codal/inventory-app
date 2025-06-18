const pool = require("../config/db");
const client = require("../config/db");
const db = require("../config/db");
const upload = require("../middleware/upload");

// Get all items
exports.getItems = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    // Handle image upload
    let image_url = null;
    if (req.file) {
      // Create URL for the uploaded image
      image_url = `/assets/items/${req.file.filename}`;
    }

    const result = await pool.query(
      "INSERT INTO items (name, description, price, quantity, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, quantity, category, image_url]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({
      success: false,
      message: "Error creating item",
      error: error.message,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, category } = req.body;

    // Handle image upload
    let image_url = null;
    if (req.file) {
      image_url = `/assets/items/${req.file.filename}`;
    }

    // If there's a new image, update it along with other fields
    const query = image_url
      ? "UPDATE items SET name = $1, description = $2, price = $3, quantity = $4, category = $5, image_url = $6 WHERE id = $7 RETURNING *"
      : "UPDATE items SET name = $1, description = $2, price = $3, quantity = $4, category = $5 WHERE id = $6 RETURNING *";

    const values = image_url
      ? [name, description, price, quantity, category, image_url, id]
      : [name, description, price, quantity, category, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // First get the item to check if it exists and get the image URL
    const itemResult = await pool.query(
      "SELECT image_url FROM items WHERE id = $1",
      [id]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete the item
    await pool.query("DELETE FROM items WHERE id = $1", [id]);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
