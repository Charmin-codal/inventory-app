const express = require("express");
const cors = require("cors");
const errorHandler = require("../src/middleware/errorHandler");

const itemRoutes = require("../src/routes/itemRoutes");
const cartRoutes = require("../src/routes/cartRoutes");
const wishlistRoutes = require("../src/routes/wishlistRoutes");
const userRoutes = require("../src/routes/userRoutes");

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
