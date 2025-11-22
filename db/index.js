// db/index.js
const { Pool } = require('pg');

const connectionString =
  process.env.NODE_ENV === 'test'
    ? process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
    : process.env.DATABASE_URL;

console.log('DB DEBUG - NODE_ENV=', process.env.NODE_ENV || 'not-set');
console.log('DB DEBUG - DATABASE_URL present=', !!connectionString);

if (!connectionString) {
  console.error('FATAL: DATABASE_URL is not set. Set it in your environment (Render/Neon/Railway).');
  throw new Error('DATABASE_URL env var is required');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
