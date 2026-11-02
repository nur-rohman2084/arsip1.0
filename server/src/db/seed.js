const db = require('./database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const saltRounds = 8;

function runSeed() {
  console.log('--- Starting Database Seeding ---');

  // 1. Classes
  const insertClass = db.prepare(`
    INSERT OR IGNORE INTO classes (class_code, class_name, academic_year, total_students, completion_rate)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertClass.run('ARSIP-7A26', 'Kelas XI MPLB 1', '2025/2026', 32, 87.0);
  insertClass.run('ARSIP-7B26', 'Kelas XI MPLB 2', '2025/2026', 30, 75.0);
  insertClass.run('ARSIP-7C26', 'Kelas XI MPLB 3', '2025/2026', 28, 60.0);

  const mainClass = db.prepare('SELECT id FROM classes WHERE class_code = ?').get('ARSIP-7A26');
  const classId = mainClass ? mainClass.id : 1;

  // 2. Teacher
  const teacherUser = db.prepare('SELECT id FROM users WHERE username = ?').get('rina.guru');
  let teacherUserId;
  if (!teacherUser) {
    const hashedTeacherPw = bcrypt.hashSync('123456', saltRounds);
    const res = db.prepare(`
      INSERT INTO users (username, password, full_name, role)
      VALUES (?, ?, ?, ?)
    `).run('rina.guru', hashedTeacherPw, 'Rina Susanti, S.Pd.', 'guru');
    teacherUserId = res.lastInsertRowid;

    db.prepare(`
      INSERT INTO teachers (user_id, nip, school_name, kkm_score, auto_unlock_turret, subject, main_class)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(teacherUserId, '198504122010012008', 'SMA Archive Nusantara', 75.0, 1, 'Informatika & Kearsipan', 'Kelas XI MPLB 1');
  }

  // 3. Turrets
  const turretsData = [
    {
      index: 0,
      code: 't0',
      name: 'Turret Laser',
      tower: 'tw0',
      x: 6.6,
      y: 27,
      desc: 'Turret dengan serangan energi jarak jauh. Materi dasar kearsipan dan warkat.',
      title: 'Hakikat Kearsipan',
      active: 1,
      bullets: JSON.stringify([
        'Arsip: rekaman kegiatan dalam berbagai bentuk dan media (UU No. 43/2009).',
        'Warkat: informasi tertulis, tercetak, atau bergambar yang masih berguna bagi organisasi.',
        'Dokumen: warkat yang tidak aktif, tetapi tetap jadi bukti. Pustaka: warkat yang telah dikumpulkan dan diolah untuk referensi.',
        'Arsip Dinamis: arsip yang digunakan secara langsung dalam kegiatan pencipta arsip (aktif, inaktif, vital).',
        'Arsip Statis: arsip yang bernilai sejarah dan disimpan permanen di Arsip Nasional Republik Indonesia (ANRI).'
      ])
    },
    {
      index: 1,
      code: 't1',
      name: 'Turret Meriam',
      tower: 'tw1',
      x: 28,
      y: 27,
      desc: 'Pertahanan kokoh dengan daya ledak tinggi. Materi asas pengelolaan surat (sentralisasi, desentralisasi, gabungan).',
      title: 'Asas Pengelolaan Surat & Warkat',
      active: 1,
      bullets: JSON.stringify([
        'Asas Sentralisasi: pengelolaan surat masuk dan keluar dipusatkan pada satu unit kerja (one gate policy).',
        'Asas Desentralisasi: setiap unit kerja mengelola surat masing-masing secara mandiri.',
        'Asas Gabungan: perpaduan sentralisasi untuk penerimaan/pengiriman dan desentralisasi untuk pengolahan berkas.'
      ])
    },
    {
      index: 2,
      code: 't2',
      name: 'Turret Rudal',
      tower: 'tw2',
      x: 55.7,
      y: 27,
      desc: 'Rudal presisi tinggi. Materi sistem penyimpanan kearsipan abjad (Alphabetical Filing System).',
      title: 'Sistem Penyimpanan Abjad',
      active: 1,
      bullets: JSON.stringify([
        'Sistem Abjad: penyusunan arsip berdasarkan urutan nama orang, perusahaan, atau organisasi dari A-Z.',
        'Mengindeks: menentukan kata tangkap (caption) yang menjadi dasar penataan berkas.',
        'Guide & Folder: panduan abjad utama (A, B, C...) dan sub-folder pembantu.'
      ])
    },
    {
      index: 3,
      code: 't3',
      name: 'Turret Perisai',
      tower: 'tw3',
      x: 79,
      y: 27,
      desc: 'Perlindungan maksimal dari serangan musuh. Materi sistem nomor dan subjek (Dewey, Terminal Digit).',
      title: 'Sistem Nomor & Subjek',
      active: 1,
      bullets: JSON.stringify([
        'Sistem Nomor: klasifikasi berkas menggunakan angka (Dewey Decimal / Terminal Digit).',
        'Sistem Subjek: pengelompokan berdasarkan perihal atau masalah pokok kegiatan organisasi.'
      ])
    },
    {
      index: 4,
      code: 't4',
      name: 'Turret Penguat',
      tower: 'tw4',
      x: 92,
      y: 58,
      desc: 'Meningkatkan efisiensi pertahanan. Materi pemeliharaan, fumigasi, dan pengamanan fisik arsip.',
      title: 'Pemeliharaan & Keamanan Arsip',
      active: 1,
      bullets: JSON.stringify([
        'Faktor Perusak: biologi (rayap, jamur), kimiawi (keasaman kertas), fisika (suhu, cahaya, kelembaban).',
        'Fumigasi: pencegahan hama dengan gas beracun terkendali.',
        'Klasifikasi Keamanan: sangat rahasia, rahasia, terbatas, terbuka.'
      ])
    },
    {
      index: 5,
      code: 't5',
      name: 'Turret Pembeku',
      tower: 'tw5',
      x: 67.6,
      y: 58,
      desc: 'Membekukan pergerakan ancaman. Materi jadwal retensi arsip (JRA) dan pemusnahan berkas.',
      title: 'Penyusutan & Retensi Arsip',
      active: 0,
      bullets: JSON.stringify([
        'Jadwal Retensi Arsip (JRA): pedoman jangka waktu penyimpanan berkas aktif dan inaktif.',
        'Pemusnahan: penghancuran berkas yang sudah tidak memiliki nilai guna secara hukum dengan berita acara.'
      ])
    },
    {
      index: 6,
      code: 't6',
      name: 'Turret Pemulih',
      tower: 'tw6',
      x: 43.7,
      y: 58,
      desc: 'Memulihkan energi pangkalan. Materi alih media dan sistem kearsipan elektronik.',
      title: 'Digitalisasi & Alih Media',
      active: 1,
      bullets: JSON.stringify([
        'Alih Media: proses mengubah arsip fisik ke format digital (scanning, optical character recognition).',
        'Autentisitas Digital: memastikan dokumen elektronik memiliki nilai pembuktian yang sah.'
      ])
    },
    {
      index: 7,
      code: 't7',
      name: 'Turret Radar',
      tower: 'tw7',
      x: 19,
      y: 57,
      desc: 'Pusat komando dan deteksi dini. Materi audit dan tata kelola kearsipan modern.',
      title: 'Audit & Tata Kelola Kearsipan Modern',
      active: 1,
      bullets: JSON.stringify([
        'Pengawasan Kearsipan: audit kepatuhan terhadap standar kearsipan nasional (ANRI).',
        'Pusat Komando: integrasi teknologi informasi dalam tata kelola dokumen pemerintahan dan swasta.'
      ])
    }
  ];

  const insertTurret = db.prepare(`
    INSERT OR REPLACE INTO turrets (index_order, code, name, tower_image, pos_x, pos_y, description, is_active, material_title, material_bullets)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  turretsData.forEach(t => {
    insertTurret.run(t.index, t.code, t.name, t.tower, t.x, t.y, t.desc, t.active, t.title, t.bullets);
  });

  // 4. Questions & Study Case for Turret 1 (index 0)
  const turret1 = db.prepare('SELECT id FROM turrets WHERE index_order = 0').get();
  if (turret1) {
    db.prepare('DELETE FROM questions WHERE turret_id = ?').run(turret1.id);
    const insertQuestion = db.prepare(`
      INSERT INTO questions (turret_id, question, options, answer_index, explanation)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertQuestion.run(
      turret1.id,
      'Arsip yang sudah tidak dipakai langsung dalam penyelenggaraan administrasi, tetapi bernilai sebagai pertanggungjawaban dan bukti sejarah, disebut.....',
      JSON.stringify(['Arsip dinamis aktif', 'Arsip statis', 'Arsip dinamis pasif', 'Arsip Vital']),
      1,
      'Arsip statis adalah arsip yang dihasilkan oleh pencipta arsip karena memiliki nilai guna kesejarahan dan telah diserahkan ke ANRI.'
    );

    insertQuestion.run(
      turret1.id,
      'Asas pengelolaan surat yang mengharuskan seluruh surat masuk dan surat keluar melalui satu unit kerja terpusat (one gate policy) adalah asas ...',
      JSON.stringify(['Disentralisasi', 'Gabungan', 'Sentralisasi', 'Disposisi']),
      2,
      'Asas sentralisasi memusatkan seluruh penerimaan, pencatatan, dan pendistribusian surat pada satu unit terpusat.'
    );

    insertQuestion.run(
      turret1.id,
      'Pernyataan yang paling tepat tentang warkat adalah ....',
      JSON.stringify([
        'Informasi tertulis, tercetak, atau bergambar yang masih berguna sebagai bahan informasi dan ingatan organisasi',
        'Guntingan koran yang ditempel pada kertas baru',
        'Kumpulan buku bacaan yang disimpan di suatu tempat',
        'Arsip yang seluruhnya disimpan di Arsip Nasional'
      ]),
      0,
      'Warkat adalah catatan tertulis atau bergambar yang memuat informasi nyata untuk keperluan organisasi.'
    );

    // Study Case
    db.prepare('DELETE FROM study_cases WHERE turret_id = ?').run(turret1.id);
    db.prepare(`
      INSERT INTO study_cases (turret_id, scenario, question, min_characters, time_limit_seconds)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      turret1.id,
      'PT Maju Bersama membiarkan tiap unit kerjanya mengelola surat sendiri–sendiri, sehingga surat penting klien hilang dan tidak diketahui unit mana yang menyimpannya. Di unit SDM, seorang petugas membiarkan berkas gaji terbuka di meja dan menceritakan isinya ke rekan unit lain. Di gudang, arsip lama bercampur tanpa pemilahan, termasuk foto dan naskah pidato pendiri tahun 1995.',
      'Identifikasi asas pengelolaan surat yang diterapkan saat ini, dan rekomendasikan perbaikan asas serta tata kelola keamanan arsip yang lebih tepat!',
      30,
      300
    );
  }

  // 5. Badges
  const badgesData = [
    { name: 'Rising Star', icon: 'med', desc: 'Selesaikan misi pertamamu di Archive Academy' },
    { name: 'Top Student', icon: 'tro1', desc: 'Raih nilai kuis di atas 85' },
    { name: 'Knowledge Seeker', icon: 'fol', desc: 'Pelajari seluruh modul Hakikat Kearsipan' },
    { name: 'Speed Learner', icon: 'star', desc: 'Selesaikan kuis kearsipan dengan cepat dan tepat' },
    { name: 'Ultimate Winner', icon: 'pod', desc: 'Kuasai seluruh turret pembelajaran' }
  ];

  const insertBadge = db.prepare('INSERT OR IGNORE INTO badges (name, icon_key, description) VALUES (?, ?, ?)');
  badgesData.forEach(b => insertBadge.run(b.name, b.icon, b.desc));

  // 6. Students Data
  const studentsList = [
    { name: 'Roselia Paras Wangi', nis: '071089', score: 85.0, progress: 78, active: 1, xp: 2450 },
    { name: 'Ahmad Rizky', nis: '071090', score: 92.0, progress: 95, active: 1, xp: 12500 },
    { name: 'Siti Nurhaliza', nis: '071091', score: 90.5, progress: 92, active: 1, xp: 11000 },
    { name: 'Bima Pratama', nis: '071092', score: 89.0, progress: 90, active: 1, xp: 10900 },
    { name: 'Dewi Lestari', nis: '071093', score: 88.5, progress: 88, active: 1, xp: 9500 },
    { name: 'Rizky Maulana', nis: '071094', score: 87.0, progress: 86, active: 1, xp: 8800 },
    { name: 'Nadia Putri', nis: '071095', score: 86.5, progress: 85, active: 1, xp: 8200 },
    { name: 'Fajar Ramadhan', nis: '071096', score: 79.0, progress: 65, active: 1, xp: 6200 },
    { name: 'Alya Safitri', nis: '071097', score: 78.0, progress: 60, active: 0, xp: 5400 }
  ];

  const defaultPasswordHash = bcrypt.hashSync('071089', saltRounds);

  studentsList.forEach(s => {
    let u = db.prepare('SELECT id FROM users WHERE username = ?').get(s.nis);
    let uid;
    if (!u) {
      const res = db.prepare(`
        INSERT INTO users (username, password, full_name, role)
        VALUES (?, ?, ?, ?)
      `).run(s.nis, defaultPasswordHash, s.name, 'siswa');
      uid = res.lastInsertRowid;
    } else {
      uid = u.id;
    }

    const existingStudent = db.prepare('SELECT id FROM students WHERE user_id = ?').get(uid);
    if (!existingStudent) {
      db.prepare(`
        INSERT INTO students (user_id, class_id, nis, average_score, progress_percent, is_active, total_xp, level, streak_days)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(uid, classId, s.nis, s.score, s.progress, s.active, s.xp, Math.max(1, Math.floor(s.xp / 1000)), 3);
    }
  });

  // Award badges & sample certificate for Roselia
  const roseliaUser = db.prepare('SELECT id FROM users WHERE username = ?').get('071089');
  if (roseliaUser) {
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(roseliaUser.id);
    if (student) {
      const allBadges = db.prepare('SELECT id FROM badges').all();
      const insertSb = db.prepare('INSERT OR IGNORE INTO student_badges (student_id, badge_id) VALUES (?, ?)');
      allBadges.forEach(b => insertSb.run(student.id, b.id));

      // Certificate
      db.prepare(`
        INSERT OR IGNORE INTO certificates (cert_code, student_id, turret_id, student_name, score, badge_title, authorized_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run('CERT-AA-2025-001', student.id, turret1.id, 'Roselia Paras Wangi', 850.0, 'Penjelajah Arsip', 'Rina Susanti, S.Pd.');
    }
  }

  // 7. Class Schedules
  const schedules = [
    { day: '28', month: 'Okt', title: 'Review Materi: Penyimpanan Sistem Abjad', sub: 'Kelas X IPA 1 • 10.00 – 11.30 WIB', tag: 'Hari ini' },
    { day: '29', month: 'Okt', title: 'Evaluasi Turret 3 – Penyimpanan Sistem Abjad', sub: 'Kelas X IPS 1 • 09.00 – 10.30 WIB', tag: 'Besok' },
    { day: '30', month: 'Okt', title: 'Pembahasan Hasil Quiz', sub: 'Kelas XI IPA 2 • 13.00 – 14.30 WIB', tag: 'Lusa' }
  ];

  db.prepare('DELETE FROM class_schedules').run();
  const insertSchedule = db.prepare('INSERT INTO class_schedules (day, month, title, sub_text, tag) VALUES (?, ?, ?, ?, ?)');
  schedules.forEach(s => insertSchedule.run(s.day, s.month, s.title, s.sub, s.tag));

  // 8. Generate seed CSV file
  const csvLines = ['nis,nama,kelas,nilai,progres,status'];
  studentsList.forEach(s => {
    csvLines.push(`${s.nis},"${s.name}",Kelas XI MPLB 1,${s.score},${s.progress},${s.active ? 'Aktif' : 'Nonaktif'}`);
  });

  const csvPath = path.join(__dirname, '../../data/students_seed.csv');
  fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');
  console.log('Created seed CSV at:', csvPath);

  console.log('--- Database Seeding Completed Successfully ---');
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
