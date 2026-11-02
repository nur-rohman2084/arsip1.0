const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('aa_token') || '';
}

async function request(endpoint, options = {}) {
  const headers = options.headers || {};
  const token = getToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getMe: () => request('/auth/me'),

  // Student
  getStudentDashboard: () => request('/students/dashboard'),
  saveAvatar: (avatar) => request('/students/avatar', {
    method: 'PUT',
    body: JSON.stringify(avatar)
  }),
  getAchievements: () => request('/students/achievements'),
  getLeaderboard: () => request('/students/leaderboard'),
  getCertificate: (id) => request(`/students/certificate/${id}`),

  // Turrets & Quiz
  getTurrets: () => request('/turrets'),
  getTurretDetail: (id) => request(`/turrets/${id}`),
  getQuiz: (turretId) => request(`/turrets/${turretId}/quiz`),
  submitQuiz: (turretId, payload) => request(`/turrets/${turretId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Teacher
  getTeacherDashboard: () => request('/teacher/dashboard'),
  getTeacherTurrets: () => request('/teacher/turrets'),
  updateTeacherTurret: (id, payload) => request(`/teacher/turrets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  getTeacherStudents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/teacher/students?${query}`);
  },
  createStudent: (studentData) => request('/teacher/students', {
    method: 'POST',
    body: JSON.stringify(studentData)
  }),
  updateStudent: (id, studentData) => request(`/teacher/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData)
  }),
  deleteStudent: (id) => request(`/teacher/students/${id}`, {
    method: 'DELETE'
  }),
  importStudentsCsv: (formData) => request('/teacher/students/import-csv', {
    method: 'POST',
    body: formData
  }),
  getTeacherSettings: () => request('/teacher/settings'),
  updateTeacherSettings: (settings) => request('/teacher/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  })
};
