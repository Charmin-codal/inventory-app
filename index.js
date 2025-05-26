const express = require('express');
const app = express();
require('dotenv').config();
const pool = require('./db');

const itemRoutes = require('./routes/itemRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running');
});

// Use item routes
app.use('/api/items', itemRoutes);

// Use cart routes
app.use('/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});