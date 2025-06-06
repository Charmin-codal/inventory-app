const { Pool } = require("pg");
require("dotenv").config();
const { Client } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false } // only for dev/testing
});

client.connect()
  .then(() => console.log("Connected to Render DB"))
  .catch(err => console.error("Connection error", err.stack));

module.exports = pool;
module.exports = client;
