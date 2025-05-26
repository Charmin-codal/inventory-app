const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(); // reads from .env

module.exports = pool;