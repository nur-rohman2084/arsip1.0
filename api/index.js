const path = require('path');
const fs = require('fs');

// 1. Impor aplikasi Express dari folder server
const app = require('../server/src/app');

// 2. Handler otomatis untuk meletakkan DB SQLite di folder /tmp Vercel saat Cold Start
try {
  const tmpDbPath = '/tmp/database.sqlite';
  const originalDbPath = path.join(__dirname, '../server/src/db/database.sqlite');

  // Salin file DB ke /tmp jika belum ada di lingkungan serverless
  if (!fs.existsSync(tmpDbPath) && fs.existsSync(originalDbPath)) {
    fs.copyFileSync(originalDbPath, tmpDbPath);
  }

  const db = require('../server/src/db/database');
  const count = db.prepare('SELECT count(*) as c FROM users').get()?.c || 0;
  
  if (count === 0) {
    const seed = require('../server/src/db/seed');
    seed();
  }
} catch (e) {
  console.warn('Vercel cold-start auto-seed notice:', e.message);
}

// 3. Export sebagai Vercel Serverless Function
module.exports = app;
