import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '../../components/layout/Sidebar';
import { Img, I, Stat, Gb, Chip } from '../../components/common/UIComponents';
import { useToast } from '../../context/ToastContext';
import { ini } from '../../assets/constants';
import { api } from '../../services/api';

export function TeacherStudents({ go }) {
  const { say } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [f, setF] = useState('Semua Status');
  const [sel, setSel] = useState(0);
  const [page, setPage] = useState(1);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', nis: '', score: 85, progress: 50, isActive: true });
  const [editStudent, setEditStudent] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const loadStudents = async () => {
    try {
      const res = await api.getTeacherStudents();
      if (res.success && res.students) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return say('Nama siswa wajib diisi.', 'error');

    try {
      const res = await api.createStudent(newStudent);
      if (res.success) {
        say('Siswa baru berhasil ditambahkan.', 'success');
        setShowAddModal(false);
        setNewStudent({ name: '', nis: '', score: 85, progress: 50, isActive: true });
        loadStudents();
      }
    } catch (err) {
      say(err.message || 'Gagal menambahkan siswa.', 'error');
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    if (!editStudent) return;

    try {
      const res = await api.updateStudent(editStudent.id, {
        name: editStudent.full_name,
        nis: editStudent.nis,
        score: editStudent.average_score,
        progress: editStudent.progress_percent,
        isActive: editStudent.is_active === 1
      });
      if (res.success) {
        say('Data siswa berhasil diperbarui.', 'success');
        setShowEditModal(false);
        loadStudents();
      }
    } catch (err) {
      say(err.message || 'Gagal memperbarui siswa.', 'error');
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus data siswa ${name}?`)) return;

    try {
      const res = await api.deleteStudent(id);
      if (res.success) {
        say(`Siswa ${name} berhasil dihapus.`, 'success');
        if (sel > 0 && sel >= students.length - 1) setSel(0);
        loadStudents();
      }
    } catch (err) {
      say(err.message || 'Gagal menghapus siswa.', 'error');
    }
  };

  const handleImportCsv = async (e) => {
    e.preventDefault();
    if (!csvFile) return say('Pilih berkas CSV terlebih dahulu.', 'error');

    setImporting(true);
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await api.importStudentsCsv(formData);
      if (res.success) {
        say(res.message, 'success');
        setShowImportModal(false);
        setCsvFile(null);
        loadStudents();
      }
    } catch (err) {
      say(err.message || 'Gagal mengimpor CSV.', 'error');
    } finally {
      setImporting(false);
    }
  };

  const filtered = students.filter((s) => {
    const matchQ = s.full_name?.toLowerCase().includes(q.toLowerCase()) || s.nis?.includes(q);
    const matchF = f === 'Semua Status' || (f === 'Aktif' ? s.is_active === 1 : s.is_active === 0);
    return matchQ && matchF;
  });

  const selectedStudent = filtered[sel] || filtered[0] || students[0] || {
    id: 1,
    full_name: 'Roselia Paras Wangi',
    nis: '071089',
    average_score: 88.5,
    progress_percent: 78,
    is_active: 1
  };

  return (
    <TeacherLayout cur="tSiswa" go={go}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Img n="tav" c="h-14 w-14 rounded-2xl border-2 border-[#4a6fc8] object-cover" a="Guru" />
        <div className="mr-auto">
          <p className="text-[10px] font-bold text-[#ffc82c] tracking-wider uppercase">DASHBOARD GURU</p>
          <h1 className="hd text-3xl text-white">Data Siswa & Prestasi</h1>
          <p className="text-xs text-blue-200">Kenali pencapaian siswa dan dampingi setiap langkah belajarnya.</p>
        </div>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat ic={<I n="users" c="w-6 h-6 text-[#ffc82c]" />} l="Total Siswa Terdaftar" v={students.length.toString()} d="+2" />
        <Stat ic={<I n="trophy" c="w-6 h-6 text-[#ffc82c]" />} l="Siswa Tuntas" v="28" d="+3" />
        <Stat ic={<I n="chart" c="w-6 h-6 text-[#ffc82c]" />} l="Rata-rata Nilai" v="87.5" d="+1.2" />
        <Stat ic={<I n="ok" c="w-6 h-6 text-[#ffc82c]" />} l="Penyelesaian" v="87%" />
      </div>

      {/* Toolbar */}
      <div className="my-4 flex flex-wrap items-center gap-3">
        <select aria-label="Kelas" className="pd bg-[#0b183f] px-3.5 py-2 text-sm text-white border border-white/10">
          <option>Kelas XI MPLB 1 (Aktif)</option>
          <option>Kelas XI MPLB 2</option>
          <option>Kelas XI MPLB 3</option>
        </select>
        <span className="mr-auto text-xs text-blue-200">
          {students.length} siswa terdaftar • Tahun ajaran 2025/2026
        </span>

        <button
          onClick={() => setShowImportModal(true)}
          className="pd flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-100 hover:text-white hover:border-[#ffc82c] transition"
        >
          <I n="file" c="w-4 h-4 text-emerald-400" />
          <span>Impor CSV</span>
        </button>

        <a
          href="/api/teacher/reports/export?type=Data_Siswa"
          download
          className="pd flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-100 hover:text-white hover:border-[#ffc82c] transition"
        >
          <I n="dl" c="w-4 h-4 text-[#ffc82c]" />
          <span>Ekspor CSV</span>
        </a>

        <Gb onClick={() => setShowAddModal(true)} cls="!rounded-xl !py-2 text-sm !font-sans font-bold">
          + Tambah Siswa
        </Gb>
      </div>

      {/* Table & Sidebar Detail Grid */}
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        {/* Students Table */}
        <div className="pn p-5">
          <div className="mb-4 flex gap-3">
            <label className="pd flex flex-1 items-center gap-2 px-3.5 border border-white/10">
              <I n="find" c="w-4 h-4 text-blue-300" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama atau NIS siswa..."
                className="w-full bg-transparent py-2 text-sm text-white placeholder-blue-300 focus:outline-none"
              />
            </label>
            <select
              value={f}
              onChange={(e) => setF(e.target.value)}
              className="pd bg-[#0b183f] px-3 text-sm text-white border border-white/10"
            >
              {['Semua Status', 'Aktif', 'Nonaktif'].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs text-blue-300 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Nilai</th>
                  <th className="py-2.5 px-3">Progres</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((s, idx) => {
                  const isSelected = selectedStudent.id === s.id;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSel(idx)}
                      className={`cursor-pointer transition hover:bg-white/5 ${
                        isSelected ? 'bg-[#1b3274]/70 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-blue-300">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{s.full_name}</div>
                        <div className="text-[11px] text-blue-300 font-mono">NIS: {s.nis}</div>
                      </td>
                      <td className="py-3 px-3">
                        <b className="text-[#ffc82c]">{Number(s.average_score).toFixed(1)}</b>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{s.progress_percent}%</span>
                          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-[#ffc82c]" style={{ width: `${s.progress_percent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Chip t={s.is_active ? '● Aktif' : '● Nonaktif'} g={Boolean(s.is_active)} />
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditStudent(s);
                            setShowEditModal(true);
                          }}
                          className="text-xs text-blue-300 hover:text-[#ffc82c]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(s.id, s.full_name);
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-blue-300">
                      Tidak ada siswa yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Sidebar */}
        <aside className="pn p-5 text-center flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="hd text-2xl text-white">Detail Siswa</h3>
              <Chip t={selectedStudent.is_active ? '● Aktif' : '● Nonaktif'} g={Boolean(selectedStudent.is_active)} />
            </div>

            <div className="hd mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#4a6fc8] bg-[#1b3274] text-3xl text-[#ffc82c] shadow-lg">
              {ini(selectedStudent.full_name)}
            </div>

            <p className="hd mt-3 text-2xl text-white">{selectedStudent.full_name}</p>
            <p className="text-xs text-blue-200">
              Kelas XI MPLB 1 • NIS {selectedStudent.nis}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="pd p-2.5">
                <p className="text-[10px] text-blue-300 uppercase font-bold">Rata-rata Nilai</p>
                <p className="hd text-3xl text-[#ffc82c]">
                  {Number(selectedStudent.average_score).toFixed(1)}
                </p>
              </div>
              <div className="pd p-2.5">
                <p className="text-[10px] text-blue-300 uppercase font-bold">Progres Belajar</p>
                <p className="hd text-3xl text-emerald-300">
                  {selectedStudent.progress_percent}%
                </p>
              </div>
            </div>

            <p className="mt-4 border-t border-white/10 pt-3 text-left text-sm font-bold text-white">
              Lencana yang Diperoleh
            </p>
            <div className="mt-2 flex justify-around text-2xl py-1 rounded-xl bg-[#0b183f]" aria-hidden="true">
              <span>🏆</span>
              <span>⚡</span>
              <span>🛡️</span>
            </div>

            <p className="mt-4 text-left text-sm font-bold text-white">Aktivitas Terakhir</p>
            <p className="text-left text-xs text-blue-200 mt-1 leading-relaxed">
              Menyelesaikan modul dan kuis Turret Laser dengan skor 850.
            </p>
          </div>

          <button
            onClick={() => say(`Riwayat belajar ${selectedStudent.full_name} lengkap tercatat di sistem.`, 'info')}
            className="pd mt-4 w-full py-2.5 text-sm font-bold text-blue-100 hover:text-white hover:border-[#ffc82c] transition"
          >
            → Lihat Riwayat Lengkap
          </button>
        </aside>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form onSubmit={handleAddStudent} className="pn w-full max-w-md p-6 bg-[#0f1f4a] border-2 border-[#ffc82c]">
            <h2 className="hd text-2xl text-white mb-4">+ Tambah Siswa Baru</h2>
            <div className="space-y-3 text-left">
              <div>
                <label className="text-xs text-blue-200 block mb-1">Nama Lengkap Siswa</label>
                <input
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Nama Siswa"
                  className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                />
              </div>
              <div>
                <label className="text-xs text-blue-200 block mb-1">NIS (Opsional / Terbuat Otomatis)</label>
                <input
                  value={newStudent.nis}
                  onChange={(e) => setNewStudent({ ...newStudent, nis: e.target.value })}
                  placeholder="Contoh: 071099"
                  className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-200 block mb-1">Nilai Awal</label>
                  <input
                    type="number"
                    value={newStudent.score}
                    onChange={(e) => setNewStudent({ ...newStudent, score: e.target.value })}
                    className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-200 block mb-1">Progres (%)</label>
                  <input
                    type="number"
                    value={newStudent.progress}
                    onChange={(e) => setNewStudent({ ...newStudent, progress: e.target.value })}
                    className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="pd px-5 py-2 text-sm text-blue-200 hover:text-white"
              >
                Batal
              </button>
              <Gb type="submit" cls="!px-6 !py-2 text-sm font-bold">
                Simpan Siswa
              </Gb>
            </div>
          </form>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form onSubmit={handleEditStudent} className="pn w-full max-w-md p-6 bg-[#0f1f4a] border-2 border-[#ffc82c]">
            <h2 className="hd text-2xl text-white mb-4">Edit Data Siswa</h2>
            <div className="space-y-3 text-left">
              <div>
                <label className="text-xs text-blue-200 block mb-1">Nama Lengkap</label>
                <input
                  required
                  value={editStudent.full_name}
                  onChange={(e) => setEditStudent({ ...editStudent, full_name: e.target.value })}
                  className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                />
              </div>
              <div>
                <label className="text-xs text-blue-200 block mb-1">NIS</label>
                <input
                  value={editStudent.nis}
                  onChange={(e) => setEditStudent({ ...editStudent, nis: e.target.value })}
                  className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-200 block mb-1">Nilai Rata-rata</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editStudent.average_score}
                    onChange={(e) => setEditStudent({ ...editStudent, average_score: e.target.value })}
                    className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-200 block mb-1">Progres (%)</label>
                  <input
                    type="number"
                    value={editStudent.progress_percent}
                    onChange={(e) => setEditStudent({ ...editStudent, progress_percent: e.target.value })}
                    className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-blue-200 block mb-1">Status Keaktifan</label>
                <select
                  value={editStudent.is_active}
                  onChange={(e) => setEditStudent({ ...editStudent, is_active: Number(e.target.value) })}
                  className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="pd px-5 py-2 text-sm text-blue-200 hover:text-white"
              >
                Batal
              </button>
              <Gb type="submit" cls="!px-6 !py-2 text-sm font-bold">
                Perbarui
              </Gb>
            </div>
          </form>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form onSubmit={handleImportCsv} className="pn w-full max-w-md p-6 bg-[#0f1f4a] border-2 border-emerald-400">
            <h2 className="hd text-2xl text-white mb-2">Impor Data Siswa via CSV</h2>
            <p className="text-xs text-blue-200 mb-4">
              Pilih file CSV dengan kolom header: <code>nis,nama,kelas,nilai,progres,status</code>
            </p>

            <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-[#ffc82c] transition">
              <I n="file" c="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="text-xs text-blue-200"
              />
              {csvFile && (
                <p className="text-xs text-emerald-300 font-bold mt-2">
                  ✓ File dipilih: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="pd px-5 py-2 text-sm text-blue-200 hover:text-white"
              >
                Batal
              </button>
              <Gb type="submit" disabled={importing || !csvFile} cls="!px-6 !py-2 text-sm font-bold">
                {importing ? 'Mengimpor...' : 'Mulai Impor CSV'}
              </Gb>
            </div>
          </form>
        </div>
      )}
    </TeacherLayout>
  );
}
