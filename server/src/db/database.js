const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const isVercel = Boolean(process.env.VERCEL);
let dbPath;

if (isVercel) {
  dbPath = path.join('/tmp', 'archive_academy.db');
  const bundledDbPath = path.join(__dirname, '../../data/archive_academy.db');
  if (!fs.existsSync(dbPath) && fs.existsSync(bundledDbPath)) {
    try {
      fs.copyFileSync(bundledDbPath, dbPath);
    } catch (e) {
      console.warn('Could not copy bundled DB to /tmp:', e.message);
    }
  }
} else {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  dbPath = path.join(dataDir, 'archive_academy.db');
}

const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize schema
function initSchema() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('siswa', 'guru')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_code TEXT UNIQUE NOT NULL,
      class_name TEXT NOT NULL,
      academic_year TEXT DEFAULT '2025/2026',
      total_students INTEGER DEFAULT 0,
      completion_rate REAL DEFAULT 0.0
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      class_id INTEGER REFERENCES classes(id),
      nis TEXT,
      avatar_skin TEXT DEFAULT 'sawo',
      avatar_top INTEGER DEFAULT 0,
      avatar_hair INTEGER DEFAULT 0,
      avatar_acc INTEGER DEFAULT 0,
      total_xp INTEGER DEFAULT 120,
      level INTEGER DEFAULT 1,
      streak_days INTEGER DEFAULT 3,
      average_score REAL DEFAULT 0.0,
      progress_percent INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      nip TEXT,
      school_name TEXT DEFAULT 'SMA Archive Nusantara',
      kkm_score REAL DEFAULT 75.0,
      auto_unlock_turret INTEGER DEFAULT 1,
      notify_activity INTEGER DEFAULT 1,
      notify_reminder INTEGER DEFAULT 1,
      notify_weekly_email INTEGER DEFAULT 0,
      two_factor_auth INTEGER DEFAULT 1,
      subject TEXT DEFAULT 'Informatika',
      main_class TEXT DEFAULT 'Kelas X IPA 1'
    );

    CREATE TABLE IF NOT EXISTS turrets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      index_order INTEGER NOT NULL UNIQUE,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      tower_image TEXT NOT NULL,
      pos_x REAL NOT NULL,
      pos_y REAL NOT NULL,
      description TEXT NOT NULL,
      duration_mins INTEGER DEFAULT 15,
      total_questions INTEGER DEFAULT 120,
      difficulty TEXT DEFAULT 'Sedang',
      is_active INTEGER DEFAULT 1,
      material_title TEXT,
      material_bullets TEXT
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      turret_id INTEGER NOT NULL REFERENCES turrets(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      answer_index INTEGER NOT NULL,
      explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS study_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      turret_id INTEGER NOT NULL REFERENCES turrets(id) ON DELETE CASCADE,
      scenario TEXT NOT NULL,
      question TEXT NOT NULL,
      min_characters INTEGER DEFAULT 30,
      time_limit_seconds INTEGER DEFAULT 300
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      turret_id INTEGER NOT NULL REFERENCES turrets(id) ON DELETE CASCADE,
      score REAL NOT NULL,
      correct_answers INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      essay_answer TEXT,
      xp_earned INTEGER DEFAULT 150,
      passed INTEGER DEFAULT 1,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon_key TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS student_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, badge_id)
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cert_code TEXT UNIQUE NOT NULL,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      turret_id INTEGER NOT NULL REFERENCES turrets(id) ON DELETE CASCADE,
      student_name TEXT NOT NULL,
      score REAL NOT NULL,
      badge_title TEXT NOT NULL,
      authorized_by TEXT DEFAULT 'Bu Rina',
      issued_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS class_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      month TEXT NOT NULL,
      title TEXT NOT NULL,
      sub_text TEXT NOT NULL,
      tag TEXT NOT NULL
    );
  `;

  db.exec(schema);
}

initSchema();

module.exports = db;
