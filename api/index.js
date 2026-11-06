let app;

function getApp() {
  if (app) return app;

  // Loading the Express app initializes the database schema.
  const expressApp = require('../server/src/app');
  const db = require('../server/src/db/database');

  // Seed demo records once when the serverless database is empty.
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount === 0) {
    const seedDatabase = require('../server/src/db/seed');
    seedDatabase();
  }

  app = expressApp;
  return app;
}

module.exports = (req, res) => {
  try {
    const handler = getApp();
    return handler(req, res);
  } catch (error) {
    console.error('[Archive Academy] API bootstrap failed:', error);

    if (res.headersSent) {
      return res.end();
    }

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({
      success: false,
      message: 'API gagal diinisialisasi.',
      error: error && error.message ? error.message : 'Unknown bootstrap error'
    }));
  }
};
