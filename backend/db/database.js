const { DatabaseSync } = require("node:sqlite");
const path = require("path");

// SQLite ships built into Node itself, so there's nothing extra to
// install or compile. The database is a single file next to this code.
const dbPath = path.join(__dirname, "watchlist.db");
const db = new DatabaseSync(dbPath);

// Runs once per server start. "IF NOT EXISTS" makes it safe to run
// again without wiping out movies that were already saved.
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT,
    watched INTEGER NOT NULL DEFAULT 0
  )
`);

module.exports = db;
