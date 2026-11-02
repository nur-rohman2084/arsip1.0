const app = require('../server/src/app');

// Ensure seeded on Vercel cold-start if /tmp DB is newly created
try {
  const db = require('../server/src/db/database');
  const count = db.prepare('SELECT count(*) as c FROM users').get()?.c || 0;
  if (count === 0) {
    const seed = require('../server/src/db/seed');
    seed();
  }
} catch (e) {
  console.warn('Vercel cold-start auto-seed notice:', e.message);
}

module.exports = app;
