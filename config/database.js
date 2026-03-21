const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'blog.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      titre TEXT NOT NULL,
      contenu TEXT NOT NULL,
      auteur TEXT NOT NULL,
      date TEXT NOT NULL,
      categorie TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_articles_categorie ON articles(categorie);
    CREATE INDEX IF NOT EXISTS idx_articles_auteur ON articles(auteur);
    CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date);
  `);
}

module.exports = { getDb };
