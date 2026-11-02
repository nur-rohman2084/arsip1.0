const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/students/dashboard
router.get('/dashboard', verifyToken, requireRole('siswa'), (req, res) => {
  try {
    const student = db.prepare(`
      SELECT s.*, u.full_name, c.class_name, c.class_code
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.user_id = ?
    `).get(req.user.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
    }

    const badges = db.prepare(`
      SELECT b.*, sb.earned_at
      FROM badges b
      JOIN student_badges sb ON b.id = sb.badge_id
      WHERE sb.student_id = ?
    `).all(student.id);

    const recentAttempt = db.prepare(`
      SELECT qa.*, t.name as turret_name
      FROM quiz_attempts qa
      JOIN turrets t ON qa.turret_id = t.id
      WHERE qa.student_id = ?
      ORDER BY qa.completed_at DESC
      LIMIT 1
    `).get(student.id);

    res.json({
      success: true,
      data: {
        id: student.id,
        name: student.full_name,
        nis: student.nis,
        className: student.class_name || 'Kelas XI MPLB 1',
        classCode: student.class_code || 'ARSIP-7A26',
        totalXp: student.total_xp,
        level: student.level,
        streakDays: student.streak_days,
        averageScore: student.average_score,
        progressPercent: student.progress_percent,
        badgeCount: badges.length,
        badges,
        avatar: {
          skin: student.avatar_skin,
          c: student.avatar_top,
          h: student.avatar_hair,
          a: student.avatar_acc
        },
        recentActivity: recentAttempt ? {
          turretName: recentAttempt.turret_name,
          score: recentAttempt.score,
          completedAt: recentAttempt.completed_at
        } : null
      }
    });
  } catch (err) {
    console.error('Fetch student dashboard error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat dashboard siswa.' });
  }
});

// PUT /api/students/avatar
router.put('/avatar', verifyToken, requireRole('siswa'), (req, res) => {
  const { skin, c, h, a } = req.body;

  try {
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
    }

    db.prepare(`
      UPDATE students
      SET avatar_skin = ?, avatar_top = ?, avatar_hair = ?, avatar_acc = ?
      WHERE id = ?
    `).run(
      skin || 'sawo',
      c !== undefined ? c : 0,
      h !== undefined ? h : null,
      a !== undefined ? a : 0,
      student.id
    );

    res.json({
      success: true,
      message: 'Avatar berhasil disimpan!',
      avatar: {
        skin: skin || 'sawo',
        c: c !== undefined ? c : 0,
        h: h !== undefined ? h : null,
        a: a !== undefined ? a : 0
      }
    });
  } catch (err) {
    console.error('Update avatar error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui avatar.' });
  }
});

// GET /api/students/achievements
router.get('/achievements', verifyToken, (req, res) => {
  try {
    let studentId = req.user.student_id;
    if (!studentId && req.user.id) {
      const s = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
      if (s) studentId = s.id;
    }

    const allBadges = db.prepare('SELECT * FROM badges').all();
    const earnedBadges = studentId ? db.prepare('SELECT badge_id FROM student_badges WHERE student_id = ?').all(studentId).map(b => b.badge_id) : [];

    const badgesWithStatus = allBadges.map(b => ({
      ...b,
      isEarned: earnedBadges.includes(b.id)
    }));

    const checklists = [
      { text: 'Selesaikan 3 Turret', isDone: true },
      { text: 'Raih 3 Badge', isDone: true },
      { text: 'Kumpulkan 2.000 XP', isDone: true },
      { text: 'Selesaikan Semua Turret', isDone: false }
    ];

    res.json({
      success: true,
      badges: badgesWithStatus,
      checklists,
      progressPercent: 72
    });
  } catch (err) {
    console.error('Fetch achievements error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat pencapaian.' });
  }
});

// GET /api/students/leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT u.full_name as name, s.total_xp as xp, s.average_score as score
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = 1
      ORDER BY s.total_xp DESC
      LIMIT 10
    `).all();

    res.json({ success: true, leaderboard: rows });
  } catch (err) {
    console.error('Fetch leaderboard error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat papan peringkat.' });
  }
});

// GET /api/students/certificate/:id
router.get('/certificate/:id', verifyToken, (req, res) => {
  try {
    const cert = db.prepare(`
      SELECT c.*, t.name as turret_name, u.full_name as student_name
      FROM certificates c
      JOIN turrets t ON c.turret_id = t.id
      JOIN students s ON c.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE c.id = ? OR c.cert_code = ?
    `).get(req.params.id, req.params.id);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Sertifikat tidak ditemukan.' });
    }

    res.json({ success: true, certificate: cert });
  } catch (err) {
    console.error('Fetch certificate error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat sertifikat.' });
  }
});

module.exports = router;
