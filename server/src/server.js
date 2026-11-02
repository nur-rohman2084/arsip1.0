const app = require('./app');
const path = require('path');
const fs = require('fs');
require('./db/database'); // Ensure db is connected & schema initialized

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Archive Academy Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
