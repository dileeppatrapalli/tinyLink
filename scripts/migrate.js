// scripts/migrate.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'migrations', '001_create_links.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migration applied successfully');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
})();
