const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { verifyToken } = require('../middleware/auth');

// GET /api/turrets
router.get('/', (req, res) => {
  try {
    const turrets = db.prepare('SELECT * FROM turrets ORDER BY index_order ASC').all();
    const formatted = turrets.map(t => ({
      id: t.id,
      index: t.index_order,
      code: t.code,
      name: t.name,
      towerImage: t.tower_image,
      posX: t.pos_x,
      posY: t.pos_y,
      desc: t.description,
      duration: t.duration_mins,
      totalQuestions: t.total_questions,
      difficulty: t.difficulty,
      isActive: Boolean(t.is_active),
      materialTitle: t.material_title,
      bullets: t.material_bullets ? JSON.parse(t.material_bullets) : []
    }));

    res.json({ success: true, turrets: formatted });
  } catch (err) {
    console.error('Fetch turrets error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat daftar turret.' });
  }
});

// GET /api/turrets/:id
router.get('/:id', (req, res) => {
  try {
    const turret = db.prepare('SELECT * FROM turrets WHERE id = ? OR index_order = ?').get(req.params.id, req.params.id);
    if (!turret) {
      return res.status(404).json({ success: false, message: 'Turret tidak ditemukan.' });
    }

    res.json({
      success: true,
      turret: {
        id: turret.id,
        index: turret.index_order,
        code: turret.code,
        name: turret.name,
        towerImage: turret.tower_image,
        posX: turret.pos_x,
        posY: turret.pos_y,
        desc: turret.description,
        duration: turret.duration_mins,
        totalQuestions: turret.total_questions,
        difficulty: turret.difficulty,
        isActive: Boolean(turret.is_active),
        materialTitle: turret.material_title,
        bullets: turret.material_bullets ? JSON.parse(turret.material_bullets) : []
      }
    });
  } catch (err) {
    console.error('Fetch turret detail error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat detail turret.' });
  }
});

// GET /api/turrets/:id/quiz
router.get('/:id/quiz', (req, res) => {
  try {
    const turret = db.prepare('SELECT * FROM turrets WHERE id = ? OR index_order = ?').get(req.params.id, req.params.id);
    if (!turret) {
      return res.status(404).json({ success: false, message: 'Turret tidak ditemukan.' });
    }

    const questions = db.prepare('SELECT id, question, options, answer_index, explanation FROM questions WHERE turret_id = ?').all(turret.id);
    const studyCase = db.prepare('SELECT id, scenario, question, min_characters, time_limit_seconds FROM study_cases WHERE turret_id = ?').get(turret.id);

    const formattedQuestions = questions.map(q => ({
      id: q.id,
      q: q.question,
      o: JSON.parse(q.options),
      a: q.answer_index,
      explanation: q.explanation
    }));

    res.json({
      success: true,
      turretName: turret.name,
      questions: formattedQuestions,
      studyCase: studyCase ? {
        id: studyCase.id,
        scenario: studyCase.scenario,
        question: studyCase.question,
        minCharacters: studyCase.min_characters,
        timeLimit: studyCase.time_limit_seconds
      } : null
    });
  } catch (err) {
    console.error('Fetch quiz error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat soal kuis.' });
  }
});

// POST /api/turrets/:id/submit
router.post('/:id/submit', verifyToken, (req, res) => {
  const { answers, essayAnswer } = req.body;

  try {
    const turret = db.prepare('SELECT * FROM turrets WHERE id = ? OR index_order = ?').get(req.params.id, req.params.id);
    if (!turret) {
      return res.status(404).json({ success: false, message: 'Turret tidak ditemukan.' });
    }

    // Get student record
    let student = db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
    if (!student && req.user.student_id) {
      student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.user.student_id);
    }

    if (!student) {
      return res.status(400).json({ success: false, message: 'Hanya siswa yang dapat mengirimkan jawaban kuis.' });
    }

    const questions = db.prepare('SELECT id, answer_index FROM questions WHERE turret_id = ?').all(turret.id);
    let correctCount = 0;

    if (Array.isArray(answers)) {
      answers.forEach((ans, idx) => {
        if (questions[idx] && questions[idx].answer_index === ans) {
          correctCount++;
        }
      });
    }

    const totalQ = questions.length || 1;
    const baseScore = Math.round((correctCount / totalQ) * 850);
    const essayValid = essayAnswer && essayAnswer.trim().length >= 30;
    const finalScore = essayValid ? Math.min(1000, baseScore + 150) : baseScore;
    const xpGained = 150;
    const passed = finalScore >= 600 ? 1 : 0;

    // Save quiz attempt
    db.prepare(`
      INSERT INTO quiz_attempts (student_id, turret_id, score, correct_answers, total_questions, essay_answer, xp_earned, passed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(student.id, turret.id, finalScore, correctCount, totalQ, essayAnswer || '', xpGained, passed);

    // Update student progress and XP
    const newXP = student.total_xp + xpGained;
    const newLevel = Math.max(1, Math.floor(newXP / 1000));
    const newProgress = Math.min(100, student.progress_percent + 15);
    const newAverage = Math.round(((student.average_score + (finalScore / 10)) / 2) * 10) / 10;

    db.prepare(`
      UPDATE students
      SET total_xp = ?, level = ?, progress_percent = ?, average_score = ?
      WHERE id = ?
    `).run(newXP, newLevel, newProgress, newAverage, student.id);

    // Award badge if passed
    let badgeAwarded = null;
    const badge = db.prepare('SELECT id, name FROM badges WHERE icon_key = ?').get('med') || db.prepare('SELECT id, name FROM badges LIMIT 1').get();
    if (badge) {
      db.prepare('INSERT OR IGNORE INTO student_badges (student_id, badge_id) VALUES (?, ?)').run(student.id, badge.id);
      badgeAwarded = badge.name;
    }

    // Generate certificate
    const certCode = `CERT-AA-${Date.now().toString().slice(-6)}`;
    const studentUser = db.prepare('SELECT full_name FROM users WHERE id = ?').get(student.user_id);
    const studentName = studentUser ? studentUser.full_name : 'Siswa Archive Academy';

    db.prepare(`
      INSERT INTO certificates (cert_code, student_id, turret_id, student_name, score, badge_title, authorized_by)
      VALUES (?, ?, ?, ?, ?, ?, 'Bu Rina')
    `).run(certCode, student.id, turret.id, studentName, finalScore, badgeAwarded || 'Penjelajah Arsip');

    // Get updated leaderboard
    const leaderboardRows = db.prepare(`
      SELECT u.full_name as name, s.total_xp as xp, s.average_score as score
      FROM students s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.total_xp DESC
      LIMIT 10
    `).all();

    res.json({
      success: true,
      message: 'Kuis berhasil diselesaikan!',
      result: {
        score: finalScore,
        correctCount,
        totalQuestions: totalQ,
        xpGained,
        totalXp: newXP,
        level: newLevel,
        badgeAwarded: badgeAwarded || 'Penjelajah Arsip',
        certCode,
        studentName,
        passed: Boolean(passed),
        leaderboard: leaderboardRows
      }
    });
  } catch (err) {
    console.error('Quiz submit error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses hasil kuis.' });
  }
});

module.exports = router;
