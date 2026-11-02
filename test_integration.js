const app = require('./server/src/app');
const http = require('http');

async function runTests() {
  console.log('=== STARTING INTEGRATION TESTS FOR ARCHIVE ACADEMY ===\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, '127.0.0.1', resolve));
  const BASE = 'http://127.0.0.1:5099';

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('Health Check', async () => {
    const res = await fetch(`${BASE}/api/health`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Health check returned non-ok');
  });

  // 2. Student Login
  let studentToken = '';
  await test('Student Login (Roselia Paras Wangi)', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'siswa',
        studentName: 'Roselia Paras Wangi',
        classCode: '071089'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token) throw new Error(data.message || 'Login failed');
    studentToken = data.token;
  });

  // 3. Teacher Login
  let teacherToken = '';
  await test('Teacher Login (rina.guru)', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'guru',
        username: 'rina.guru',
        password: '123456'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token) throw new Error(data.message || 'Login failed');
    teacherToken = data.token;
  });

  // 4. Auth Me Verification
  await test('Student Auth/Me Verification', async () => {
    const res = await fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (!data.success || data.user.role !== 'siswa') throw new Error('Invalid student profile');
  });

  await test('Teacher Auth/Me Verification', async () => {
    const res = await fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    const data = await res.json();
    if (!data.success || data.user.role !== 'guru') throw new Error('Invalid teacher profile');
  });

  // 5. Save Avatar
  await test('Save Student Avatar Customization', async () => {
    const res = await fetch(`${BASE}/api/students/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ skin: 'sawo-muda', c: 2, h: 1, a: 3 })
    });
    const data = await res.json();
    if (!data.success || data.avatar.c !== 2) throw new Error('Avatar not saved properly');
  });

  // 6. Turrets & Quiz
  await test('Fetch Turrets List', async () => {
    const res = await fetch(`${BASE}/api/turrets`);
    const data = await res.json();
    if (!data.success || data.turrets.length !== 8) throw new Error('Expected 8 turrets');
  });

  await test('Fetch Quiz Questions', async () => {
    const res = await fetch(`${BASE}/api/turrets/0/quiz`);
    const data = await res.json();
    if (!data.success || data.questions.length < 3 || !data.studyCase) throw new Error('Quiz questions incomplete');
  });

  // 7. Submit Quiz
  let certCode = '';
  await test('Submit Quiz Attempt and Award Badge/Certificate', async () => {
    const res = await fetch(`${BASE}/api/turrets/0/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        answers: [1, 2, 0], // all correct
        essayAnswer: 'Unit kearsipan harus menerapkan asas sentralisasi untuk tata kelola surat masuk dan keluar.'
      })
    });
    const data = await res.json();
    if (!data.success || !data.result || data.result.score < 800) throw new Error('Quiz submit failed or score invalid');
    certCode = data.result.certCode;
  });

  // 8. Fetch Achievements & Leaderboard
  await test('Fetch Achievements & Leaderboard', async () => {
    const resAch = await fetch(`${BASE}/api/students/achievements`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const dataAch = await resAch.json();
    if (!dataAch.success || !dataAch.badges.length) throw new Error('Failed to load achievements');

    const resLead = await fetch(`${BASE}/api/students/leaderboard`);
    const dataLead = await resLead.json();
    if (!dataLead.success || !dataLead.leaderboard.length) throw new Error('Failed to load leaderboard');
  });

  // 9. Teacher Dashboard & Turret Management
  await test('Teacher Dashboard Data', async () => {
    const res = await fetch(`${BASE}/api/teacher/dashboard`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    const data = await res.json();
    if (!data.success || !data.stats || !data.classes.length) throw new Error('Teacher dashboard data invalid');
  });

  await test('Teacher Toggle Turret Active State', async () => {
    const res = await fetch(`${BASE}/api/teacher/turrets/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({ isActive: true, durationMins: 20 })
    });
    const data = await res.json();
    if (!data.success || data.turret.is_active !== 1) throw new Error('Failed to toggle turret');
  });

  // 10. Teacher Student CRUD
  let createdStudentId = null;
  await test('Teacher Create Student', async () => {
    const res = await fetch(`${BASE}/api/teacher/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({
        name: 'Bayu Pratama Test',
        nis: '079999',
        score: 95.0,
        progress: 80,
        isActive: true
      })
    });
    const data = await res.json();
    if (!data.success || !data.studentId) throw new Error('Failed to create student');
    createdStudentId = data.studentId;
  });

  await test('Teacher Update Student', async () => {
    const res = await fetch(`${BASE}/api/teacher/students/${createdStudentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({
        name: 'Bayu Pratama Test (Updated)',
        score: 98.0
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to update student');
  });

  await test('Teacher Delete Student', async () => {
    const res = await fetch(`${BASE}/api/teacher/students/${createdStudentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to delete student');
  });

  // 11. Teacher Export CSV Report
  await test('Teacher Export CSV Report', async () => {
    const res = await fetch(`${BASE}/api/teacher/reports/export?type=Nilai_Siswa`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    const text = await res.text();
    if (!text.includes('No,NIS,Nama Siswa,Kelas,Rata-rata Nilai')) throw new Error('CSV report format invalid');
  });

  // 12. Teacher Update Settings
  await test('Teacher Update Settings', async () => {
    const res = await fetch(`${BASE}/api/teacher/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({
        fullName: 'Rina Susanti, M.Pd.',
        schoolName: 'SMK Negeri 1 Archive',
        kkmScore: 78
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to update settings');
  });

  server.close();

  console.log(`\n=========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=========================================`);

  if (failed > 0) process.exit(1);
}

runTests();
