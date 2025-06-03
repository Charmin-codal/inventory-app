const pool = require("../config/db");

// Get all items
exports.getItems = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, quantity, description , price } = req.body;
    const result = await pool.query(
      "INSERT INTO items (name, quantity, description , price) VALUES ($1, $2, $3 , $4) RETURNING *",
      [name, quantity, description , price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, description , price } = req.body;
    await pool.query(
      "UPDATE items SET name = $1, quantity = $2, description = $3 , price = $4 WHERE id = $5",
      [name, quantity, description, price, id]
    );
    res.json({ message: "Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
