const express = require("express");
const cors = require("cors");
const errorHandler = require("../src/middleware/errorHandler");
const path = require("path");

const itemRoutes = require("../src/routes/itemRoutes");
const cartRoutes = require("../src/routes/cartRoutes");
const wishlistRoutes = require("../src/routes/wishlistRoutes");
const userRoutes = require("../src/routes/userRoutes");

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
