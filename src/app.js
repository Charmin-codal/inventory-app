const express = require("express");
const initializeDatabase = require("./config/initDb");
const errorHandler = require("./middleware/errorHandler");

const itemRoutes = require("./routes/itemRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const userRoutes = require("./routes/userRoutes");

initializeDatabase().catch(console.error);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/users", userRoutes);

app.use("/api/items", itemRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
