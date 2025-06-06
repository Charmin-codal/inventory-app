const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_here";

const userController = {

  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Please provide all required fields",
        });
      }

      const userExists = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR username = $2",
        [email, username]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: "User already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email
      `;

      console.log("Executing query with values:", [
        username,
        email,
        hashedPassword,
      ]);
      const result = await pool.query(query, [username, email, hashedPassword]);
      console.log("Query result:", result.rows);

      const token = jwt.sign(
        { id: result.rows[0].id, username: result.rows[0].username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        success: true,
        data: {
          user: result.rows[0],
          token,
        },
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({
        success: false,
        error: "Failed to register user",
        details: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Please provide email and password",
        });
      }

      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const user = result.rows[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({
        success: false,
        error: "Failed to login",
        details: error.message,
      });
    }
  },

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;

      const result = await pool.query(
        "SELECT id, username, email FROM users WHERE id = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user",
        details: error.message,
      });
    }
  },
};

module.exports = userController;
