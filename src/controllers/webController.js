// src/controllers/webController.js
// Contains handlers for web pages: dashboard, stats, redirect
const db = require('../../db'); // adjust path if your db/index.js is at project root /db
const linkModel = require('../models/linkModel'); // preserve existing model usage for dashboard/stats

// Dashboard page (keeps your existing behavior)
async function dashboardPage(req, res) {
  try {
    const links = await linkModel.listLinks();
    return res.render('dashboard', { links, baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` });
  } catch (err) {
    console.error('Dashboard load error (non-fatal):', err?.message || err);
    return res.render('dashboard', { links: [], baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` });
  }
}

// Stats page (keeps your existing behavior)
async function statsPage(req, res) {
  const { code } = req.params;
  try {
    const link = await linkModel.getLinkByCode(code);
    if (!link) return res.status(404).render('404', { message: 'Not found' });
    return res.render('stats', { link, baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).render('error', { message: 'Server error' });
  }
}

// === FIXED redirect handler (atomic UPDATE ... RETURNING) ===
// This replaces the old redirectHandler. It:
// - validates the code shape,
// - atomically increments clicks and updates last_clicked,
// - returns 404 if not found,
// - sets Location header and returns 302 with empty body.
async function redirectHandler(req, res) {
  const { code } = req.params;

  // Basic code format validation (matches assignment rules)
  if (!code || !/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return res.status(404).send('Not found');
  }

  try {
    const sql = `
      UPDATE links
      SET total_clicks = total_clicks + 1,
          last_clicked = NOW()
      WHERE code = $1
      RETURNING target_url;
    `;
    const { rows } = await db.query(sql, [code]);

    if (!rows || rows.length === 0) {
      // Code not present / deleted
      return res.status(404).send('Not found');
    }

    const targetUrl = rows[0].target_url;
    if (!targetUrl) {
      console.error('Redirect error: found row but target_url missing for code=', code);
      return res.status(500).send('server error');
    }

    // Set Location header explicitly and return 302 (no body).
    res.set('Location', targetUrl);
    return res.status(302).end();
  } catch (err) {
    // Log full error to Render logs (do not include secrets)
    console.error('Redirect handler error for code=', code, err);
    return res.status(500).send('server error');
  }
}

module.exports = {
  dashboardPage,
  statsPage,
  redirectHandler,
};
