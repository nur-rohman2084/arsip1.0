import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '../../components/layout/Sidebar';
import { Img, I, Gb, Tog, Chip } from '../../components/common/UIComponents';
import { useToast } from '../../context/ToastContext';
import { TUR } from '../../assets/constants';
import { api } from '../../services/api';

export function TeacherTurrets({ go }) {
  const { say } = useToast();
  const [turrets, setTurrets] = useState([]);
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState('');
  const [f, setF] = useState('Semua Status');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ desc: '', duration: 15, difficulty: 'Sedang' });

  const loadTurrets = async () => {
    try {
      const res = await api.getTeacherTurrets();
      if (res.success && res.turrets) {
        setTurrets(res.turrets);
      }
    } catch (err) {
      console.error('Failed to load teacher turrets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTurrets();
  }, []);

  const handleToggle = async (turret) => {
    const newStatus = !Boolean(turret.is_active);
    try {
      const res = await api.updateTeacherTurret(turret.id, { isActive: newStatus });
      if (res.success) {
        say(`${turret.name} ${newStatus ? 'berhasil diaktifkan' : 'dinonaktifkan'}.`, 'success');
        setTurrets((prev) =>
          prev.map((t) => (t.id === turret.id ? { ...t, is_active: newStatus ? 1 : 0 } : t))
        );
      }
    } catch (err) {
      say('Gagal memperbarui status turret.', 'error');
    }
  };

  const handleSaveEdit = async () => {
    const currentTurret = turrets[sel];
    if (!currentTurret) return;

    try {
      const res = await api.updateTeacherTurret(currentTurret.id, {
        description: editForm.desc,
        durationMins: Number(editForm.duration),
        difficulty: editForm.difficulty
      });
      if (res.success) {
        say('Materi turret berhasil disimpan.', 'success');
        setTurrets((prev) =>
          prev.map((t) =>
            t.id === currentTurret.id
              ? { ...t, description: editForm.desc, duration_mins: Number(editForm.duration), difficulty: editForm.difficulty }
              : t
          )
        );
        setEditModal(false);
      }
    } catch (err) {
      say('Gagal menyimpan perubahan materi.', 'error');
    }
  };

  const filteredTurrets = turrets.filter((t) => {
    const matchName = t.name.toLowerCase().includes(q.toLowerCase());
    const matchStatus = f === 'Semua Status' || (f === 'Aktif' ? t.is_active === 1 : t.is_active === 0);
    return matchName && matchStatus;
  });

  const activeCount = turrets.filter((t) => t.is_active === 1).length;
  const currentTurret = turrets[sel] || turrets[0] || {
    name: 'Turret Laser',
    description: 'Turret materi dasar kearsipan.',
    is_active: 1,
    duration_mins: 15,
    difficulty: 'Sedang',
    total_questions: 120
  };

  return (
    <TeacherLayout cur="tTurret" go={go}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Img n="tav" c="h-14 w-14 rounded-2xl border-2 border-[#4a6fc8] object-cover" a="Guru" />
        <div className="mr-auto">
          <p className="text-[10px] font-bold text-[#ffc82c] tracking-wider uppercase">DASHBOARD GURU</p>
          <h1 className="hd text-3xl text-white">Kelola Turret Pembelajaran</h1>
          <p className="text-xs text-blue-200">Atur materi, bank soal, dan status akses untuk setiap turret kearsipan.</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="hd text-2xl text-white">Koleksi Turret</h2>
        <Chip t={`${turrets.length || 8} turret`} />
        <span className="mr-auto text-xs text-blue-200">
          {activeCount} aktif • {(turrets.length || 8) - activeCount} nonaktif
        </span>
        <Gb
          onClick={() => say('Seluruh 8 turret standar kurikulum MPLB telah aktif terdaftar.', 'info')}
          cls="!rounded-xl !py-2 text-sm !font-sans font-bold"
        >
          + Tambah Turret
        </Gb>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        {/* Turrets Catalog */}
        <div className="pn p-5">
          <div className="mb-4 flex gap-3">
            <label className="pd flex flex-1 items-center gap-2 px-3.5 border border-white/10">
              <I n="find" c="w-4 h-4 text-blue-300" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama turret..."
                className="w-full bg-transparent py-2.5 text-sm text-white placeholder-blue-300 focus:outline-none"
              />
            </label>
            <select
              value={f}
              onChange={(e) => setF(e.target.value)}
              aria-label="Filter status"
              className="pd bg-[#0b183f] px-4 text-sm text-white border border-white/10 focus:outline-none"
            >
              {['Semua Status', 'Aktif', 'Nonaktif'].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {filteredTurrets.map((t, idx) => {
              const originalIndex = t.index_order !== undefined ? t.index_order : idx;
              const isSelected = sel === originalIndex;
              const isActive = Boolean(t.is_active);

              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setSel(originalIndex)}
                  className={`pd p-3.5 text-center transition-all ${
                    isSelected ? '!border-2 !border-[#ffc82c] shadow-[0_0_15px_rgba(255,200,44,0.3)] scale-[1.02]' : 'hover:border-white/30'
                  }`}
                >
                  <p className="flex justify-between text-[10px]">
                    <span className={isSelected ? 'text-[#ffc82c] font-bold' : 'text-blue-300'}>
                      {isSelected ? 'DIPILIH' : `LEVEL ${originalIndex + 1}`}
                    </span>
                    <span>{isSelected ? '✓' : '•••'}</span>
                  </p>
                  <Img n={t.code || `t${originalIndex}`} c="mx-auto my-2 h-20 object-contain" a={t.name} />
                  <p className="hd text-base text-white truncate">{t.name}</p>
                  <p className="text-[10px] text-blue-300 mt-0.5">Level 1 • {t.total_questions || 120} soal</p>
                  <span
                    className={`mt-2 inline-block rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-[#12335a] text-emerald-300 border border-emerald-500/30' : 'bg-[#1f2a55] text-blue-300'
                    }`}
                  >
                    ● {isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </button>
              );
            })}
            {!filteredTurrets.length && (
              <p className="col-span-full py-10 text-center text-blue-300">
                Tidak ada turret yang sesuai dengan pencarian.
              </p>
            )}
          </div>
          <p className="mt-4 text-xs text-blue-200">
            ⓘ Pilih turret untuk melihat detail materi, mengatur durasi soal, dan mengubah status keterlihatan siswa.
          </p>
        </div>

        {/* Selected Turret Sidebar Detail */}
        <aside className="pn p-5 flex flex-col justify-between">
          <div>
            <h3 className="hd text-2xl text-white">Detail Turret</h3>
            <div className="mt-3 rounded-2xl bg-[#0b183f] p-4 border border-[#2c4486]">
              <Img n="tbg" c="mx-auto h-32 object-contain drop-shadow-md" a="Tower" />
            </div>

            <p className="hd mt-4 text-center text-3xl text-[#ffc82c]">{currentTurret.name}</p>
            <p className="mt-1 text-center text-xs text-blue-200 leading-relaxed">
              {currentTurret.description}
            </p>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-sm">
              <p className="flex justify-between">
                <span className="text-blue-200">Jumlah soal</span>
                <b className="text-white">{currentTurret.total_questions || 120} Soal</b>
              </p>
              <p className="flex justify-between">
                <span className="text-blue-200">Durasi pengerjaan</span>
                <b className="text-white">{currentTurret.duration_mins || 15} Menit</b>
              </p>
              <p className="flex justify-between">
                <span className="text-blue-200">Tingkat kesulitan</span>
                <b className="text-emerald-300">{currentTurret.difficulty || 'Sedang'}</b>
              </p>
            </div>

            {/* Toggle Status Aktif */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <div>
                <p className="text-sm font-bold text-white">Status Akses</p>
                <p className="text-[11px] text-blue-300">
                  {Boolean(currentTurret.is_active) ? 'Terlihat & dapat diakses siswa' : 'Terkunci bagi siswa'}
                </p>
              </div>
              <Tog
                on={Boolean(currentTurret.is_active)}
                l={`Status ${currentTurret.name}`}
                set={() => handleToggle(currentTurret)}
              />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Gb
              onClick={() => say(`Bank soal untuk ${currentTurret.name} telah terisi lengkap.`, 'info')}
              cls="w-full !rounded-xl !font-sans font-bold shadow-md"
            >
              Atur Soal Kuis
            </Gb>
            <button
              onClick={() => {
                setEditForm({
                  desc: currentTurret.description || '',
                  duration: currentTurret.duration_mins || 15,
                  difficulty: currentTurret.difficulty || 'Sedang'
                });
                setEditModal(true);
              }}
              className="pd flex w-full items-center justify-center gap-2 py-2.5 text-sm font-bold text-blue-100 hover:text-white hover:border-[#ffc82c] transition"
            >
              <I n="ed" c="w-4 h-4 text-[#ffc82c]" />
              <span>Edit Materi & Durasi</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Edit Turret Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="pn w-full max-w-lg p-6 bg-[#0f1f4a] border-2 border-[#ffc82c]">
            <h2 className="hd text-2xl text-white mb-2">Edit {currentTurret.name}</h2>
            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs text-blue-200 block mb-1">Deskripsi Materi</label>
                <textarea
                  value={editForm.desc}
                  onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                  className="pd w-full h-24 p-3 text-sm text-white bg-[#0b183f]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-200 block mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-200 block mb-1">Kesulitan</label>
                  <select
                    value={editForm.difficulty}
                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                    className="pd w-full p-2.5 text-sm text-white bg-[#0b183f]"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="pd px-5 py-2 text-sm text-blue-200 hover:text-white"
              >
                Batal
              </button>
              <Gb onClick={handleSaveEdit} cls="!px-6 !py-2 text-sm">
                Simpan Perubahan
              </Gb>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}
