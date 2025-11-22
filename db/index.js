// db/index.js
const { Pool } = require('pg');

const connectionString =
  process.env.NODE_ENV === 'test'
    ? process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
    : process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL: DATABASE_URL is not set. Set it in your environment (Render/Neon).');
  // throw an explicit error so logs show reason
  throw new Error('DATABASE_URL env var is required');
}

// Enable SSL for production hosts (Neon). You can also set PGSSLMODE or an env var.
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
