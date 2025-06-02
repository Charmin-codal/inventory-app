const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_here";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No authentication token, access denied",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({
      success: false,
      error: "Token is not valid",
    });
  }
};

module.exports = auth;
