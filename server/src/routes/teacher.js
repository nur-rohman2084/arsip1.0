const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { verifyToken, requireRole } = require('../middleware/auth');

const upload = multer({ dest: path.join(__dirname, '../../data/uploads/') });

// Teacher protection for all routes
router.use(verifyToken, requireRole('guru'));

// GET /api/teacher/dashboard
router.get('/dashboard', (req, res) => {
  try {
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const completedStudents = db.prepare('SELECT COUNT(*) as count FROM students WHERE progress_percent >= 80').get().count;
    const avgScoreRow = db.prepare('SELECT AVG(average_score) as avgScore FROM students WHERE average_score > 0').get();
    const avgScore = avgScoreRow.avgScore ? Number(avgScoreRow.avgScore.toFixed(1)) : 87.5;

    const classes = db.prepare('SELECT * FROM classes').all();
    const schedules = db.prepare('SELECT * FROM class_schedules').all();

    // Line performance data
    const performance = {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      scores: [48, 60, 60, 74, 72, 79, 82],
      completion: [58, 72, 74, 85, 84, 92, 92]
    };

    res.json({
      success: true,
      stats: {
        totalStudents: totalStudents || 32,
        completedStudents: completedStudents || 28,
        averageScore: avgScore,
        completionRate: '87%'
      },
      performance,
      classes: classes.map((c, i) => ({
        id: c.id,
        name: c.class_name,
        code: c.class_code,
        studentsCount: c.total_students,
        completion: c.completion_rate,
        img: `isl${(i % 3) + 1}`
      })),
      schedules
    });
  } catch (err) {
    console.error('Teacher dashboard error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat dashboard guru.' });
  }
});

// GET /api/teacher/turrets
router.get('/turrets', (req, res) => {
  try {
    const turrets = db.prepare('SELECT * FROM turrets ORDER BY index_order ASC').all();
    res.json({ success: true, turrets });
  } catch (err) {
    console.error('Fetch teacher turrets error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat daftar turret guru.' });
  }
});

// PATCH /api/teacher/turrets/:id
router.patch('/turrets/:id', (req, res) => {
  const { isActive, description, durationMins, difficulty } = req.body;

  try {
    const turret = db.prepare('SELECT * FROM turrets WHERE id = ? OR index_order = ?').get(req.params.id, req.params.id);
    if (!turret) {
      return res.status(404).json({ success: false, message: 'Turret tidak ditemukan.' });
    }

    const newActive = isActive !== undefined ? (isActive ? 1 : 0) : turret.is_active;
    const newDesc = description !== undefined ? description : turret.description;
    const newDuration = durationMins !== undefined ? durationMins : turret.duration_mins;
    const newDiff = difficulty !== undefined ? difficulty : turret.difficulty;

    db.prepare(`
      UPDATE turrets
      SET is_active = ?, description = ?, duration_mins = ?, difficulty = ?
      WHERE id = ?
    `).run(newActive, newDesc, newDuration, newDiff, turret.id);

    res.json({
      success: true,
      message: `Turret ${turret.name} berhasil diperbarui.`,
      turret: {
        ...turret,
        is_active: newActive,
        description: newDesc,
        duration_mins: newDuration,
        difficulty: newDiff
      }
    });
  } catch (err) {
    console.error('Update turret error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui turret.' });
  }
});

// GET /api/teacher/students
router.get('/students', (req, res) => {
  const { q, f, classId } = req.query;

  try {
    let sql = `
      SELECT s.id, s.nis, s.average_score, s.progress_percent, s.is_active, s.total_xp, s.level,
             u.full_name, c.class_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      sql += ' AND (LOWER(u.full_name) LIKE ? OR s.nis LIKE ?)';
      params.push(`%${q.toLowerCase()}%`, `%${q}%`);
    }

    if (f === 'Aktif') {
      sql += ' AND s.is_active = 1';
    } else if (f === 'Nonaktif') {
      sql += ' AND s.is_active = 0';
    }

    if (classId) {
      sql += ' AND s.class_id = ?';
      params.push(classId);
    }

    sql += ' ORDER BY s.id ASC';

    const students = db.prepare(sql).all(...params);
    res.json({ success: true, students });
  } catch (err) {
    console.error('Fetch teacher students error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat data siswa.' });
  }
});

// POST /api/teacher/students
router.post('/students', (req, res) => {
  const { name, nis, score, progress, isActive, classId } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama siswa wajib diisi.' });
    }

    const nisGen = nis || '07' + Math.floor(1000 + Math.random() * 9000);
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(nisGen);
    if (existing) {
      return res.status(400).json({ success: false, message: 'NIS sudah digunakan.' });
    }

    const hashedPw = bcrypt.hashSync('071089', 8);
    const userInsert = db.prepare(`
      INSERT INTO users (username, password, full_name, role)
      VALUES (?, ?, ?, 'siswa')
    `).run(nisGen, hashedPw, name.trim());

    const studentInsert = db.prepare(`
      INSERT INTO students (user_id, class_id, nis, average_score, progress_percent, is_active, total_xp, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      userInsert.lastInsertRowid,
      classId || 1,
      nisGen,
      score !== undefined ? Number(score) : 75.0,
      progress !== undefined ? Number(progress) : 0,
      isActive !== undefined ? (isActive ? 1 : 0) : 1,
      120
    );

    res.json({
      success: true,
      message: 'Siswa berhasil ditambahkan.',
      studentId: studentInsert.lastInsertRowid
    });
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan siswa.' });
  }
});

// PUT /api/teacher/students/:id
router.put('/students/:id', (req, res) => {
  const { name, nis, score, progress, isActive } = req.body;

  try {
    const student = db.prepare('SELECT s.*, u.id as user_id FROM students s JOIN users u ON s.user_id = u.id WHERE s.id = ?').get(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    }

    if (name) {
      db.prepare('UPDATE users SET full_name = ? WHERE id = ?').run(name.trim(), student.user_id);
    }

    const newNis = nis !== undefined ? nis : student.nis;
    const newScore = score !== undefined ? Number(score) : student.average_score;
    const newProgress = progress !== undefined ? Number(progress) : student.progress_percent;
    const newActive = isActive !== undefined ? (isActive ? 1 : 0) : student.is_active;

    db.prepare(`
      UPDATE students
      SET nis = ?, average_score = ?, progress_percent = ?, is_active = ?
      WHERE id = ?
    `).run(newNis, newScore, newProgress, newActive, student.id);

    res.json({ success: true, message: 'Data siswa berhasil diperbarui.' });
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui data siswa.' });
  }
});

// DELETE /api/teacher/students/:id
router.delete('/students/:id', (req, res) => {
  try {
    const student = db.prepare('SELECT user_id FROM students WHERE id = ?').get(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    }

    // Delete user will cascade to student
    db.prepare('DELETE FROM users WHERE id = ?').run(student.user_id);
    res.json({ success: true, message: 'Siswa berhasil dihapus.' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus siswa.' });
  }
});

// POST /api/teacher/students/import-csv
router.post('/students/import-csv', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File CSV tidak ditemukan.' });
  }

  try {
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let isHeader = true;
    let importedCount = 0;
    const defaultPasswordHash = bcrypt.hashSync('071089', 8);

    for await (const line of rl) {
      if (!line.trim()) continue;
      if (isHeader) {
        isHeader = false;
        continue;
      }

      // Parse CSV line (handles quotes)
      const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
      const [nis, nama, kelas, nilai, progres, status] = parts;

      if (!nama) continue;

      const nisVal = nis || '07' + Math.floor(1000 + Math.random() * 9000);
      const scoreVal = nilai ? parseFloat(nilai) || 75.0 : 75.0;
      const progVal = progres ? parseInt(progres) || 0 : 0;
      const activeVal = status ? (status.toLowerCase().includes('aktif') && !status.toLowerCase().includes('non') ? 1 : 0) : 1;

      // Find or insert user
      let user = db.prepare('SELECT id FROM users WHERE username = ?').get(nisVal);
      let userId;
      if (!user) {
        const uIns = db.prepare('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)').run(nisVal, defaultPasswordHash, nama, 'siswa');
        userId = uIns.lastInsertRowid;
      } else {
        userId = user.id;
        db.prepare('UPDATE users SET full_name = ? WHERE id = ?').run(nama, userId);
      }

      // Find or insert student
      const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(userId);
      if (!student) {
        db.prepare(`
          INSERT INTO students (user_id, class_id, nis, average_score, progress_percent, is_active, total_xp, level)
          VALUES (?, 1, ?, ?, ?, ?, 120, 1)
        `).run(userId, nisVal, scoreVal, progVal, activeVal);
      } else {
        db.prepare(`
          UPDATE students
          SET average_score = ?, progress_percent = ?, is_active = ?
          WHERE id = ?
        `).run(scoreVal, progVal, activeVal, student.id);
      }

      importedCount++;
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Berhasil mengimpor ${importedCount} data siswa dari CSV.`
    });
  } catch (err) {
    console.error('Import CSV error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses file CSV.' });
  }
});

// GET /api/teacher/reports/export
router.get('/reports/export', (req, res) => {
  const { type, classId } = req.query;

  try {
    const students = db.prepare(`
      SELECT s.nis, u.full_name as nama, c.class_name as kelas, s.average_score as nilai,
             s.progress_percent as progres, s.is_active, s.total_xp as xp
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      ORDER BY s.id ASC
    `).all();

    const csvHeader = 'No,NIS,Nama Siswa,Kelas,Rata-rata Nilai,Progres Belajar (%),Total XP,Status\n';
    const csvRows = students.map((s, idx) => {
      const statusStr = s.is_active ? 'Aktif' : 'Nonaktif';
      return `${idx + 1},${s.nis},"${s.nama}","${s.kelas || 'Kelas XI MPLB 1'}",${s.nilai},${s.progres}%,${s.xp},${statusStr}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Laporan_${type || 'Nilai_Siswa'}_${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (err) {
    console.error('Export report error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengekspor laporan.' });
  }
});

// GET /api/teacher/settings
router.get('/settings', (req, res) => {
  try {
    const teacher = db.prepare('SELECT t.*, u.full_name, u.username FROM teachers t JOIN users u ON t.user_id = u.id WHERE t.user_id = ?').get(req.user.id);
    res.json({ success: true, settings: teacher || {} });
  } catch (err) {
    console.error('Fetch settings error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat pengaturan.' });
  }
});

// PUT /api/teacher/settings
router.put('/settings', (req, res) => {
  const { fullName, username, schoolName, kkmScore, autoUnlock, notifyActivity, notifyReminder, notifyWeekly, twoFactor, subject, mainClass } = req.body;

  try {
    if (fullName) {
      db.prepare('UPDATE users SET full_name = ? WHERE id = ?').run(fullName.trim(), req.user.id);
    }
    if (username) {
      db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username.trim(), req.user.id);
    }

    db.prepare(`
      UPDATE teachers
      SET school_name = ?, kkm_score = ?, auto_unlock_turret = ?,
          notify_activity = ?, notify_reminder = ?, notify_weekly_email = ?,
          two_factor_auth = ?, subject = ?, main_class = ?
      WHERE user_id = ?
    `).run(
      schoolName || 'SMA Archive Nusantara',
      kkmScore ? Number(kkmScore) : 75.0,
      autoUnlock ? 1 : 0,
      notifyActivity ? 1 : 0,
      notifyReminder ? 1 : 0,
      notifyWeekly ? 1 : 0,
      twoFactor ? 1 : 0,
      subject || 'Informatika',
      mainClass || 'Kelas X IPA 1',
      req.user.id
    );

    res.json({ success: true, message: 'Pengaturan berhasil disimpan!' });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan.' });
  }
});

module.exports = router;
