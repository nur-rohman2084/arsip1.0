import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '../../components/layout/Sidebar';
import { Img, Gb, Tog } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export function TeacherSettings({ go }) {
  const { user } = useAuth();
  const { say } = useToast();

  const [f, setF] = useState({
    fullName: user?.full_name || 'Rina Susanti, S.Pd.',
    username: user?.username || 'rina.guru',
    email: 'rina@archive.academy',
    schoolName: 'SMA Archive Nusantara',
    kkmScore: '75',
    mainClass: 'Kelas XI MPLB 1',
    subject: 'Informatika & Kearsipan'
  });

  const [t, setT] = useState({
    autoUnlock: true,
    notifyActivity: true,
    notifyReminder: true,
    notifyWeekly: false,
    twoFactor: true
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getTeacherSettings();
        if (res.success && res.settings) {
          const s = res.settings;
          setF({
            fullName: s.full_name || 'Rina Susanti, S.Pd.',
            username: s.username || 'rina.guru',
            email: 'rina@archive.academy',
            schoolName: s.school_name || 'SMA Archive Nusantara',
            kkmScore: String(s.kkm_score || '75'),
            mainClass: s.main_class || 'Kelas XI MPLB 1',
            subject: s.subject || 'Informatika & Kearsipan'
          });
          setT({
            autoUnlock: Boolean(s.auto_unlock_turret),
            notifyActivity: Boolean(s.notify_activity),
            notifyReminder: Boolean(s.notify_reminder),
            notifyWeekly: Boolean(s.notify_weekly_email),
            twoFactor: Boolean(s.two_factor_auth)
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: f.fullName,
        username: f.username,
        schoolName: f.schoolName,
        kkmScore: Number(f.kkmScore),
        mainClass: f.mainClass,
        subject: f.subject,
        autoUnlock: t.autoUnlock,
        notifyActivity: t.notifyActivity,
        notifyReminder: t.notifyReminder,
        notifyWeekly: t.notifyWeekly,
        twoFactor: t.twoFactor
      };
      const res = await api.updateTeacherSettings(payload);
      if (res.success) {
        say('Pengaturan guru berhasil disimpan ke database!', 'success');
      }
    } catch (err) {
      say(err.message || 'Gagal menyimpan pengaturan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const In = ({ k, l, tp = 'text' }) => (
    <label className="text-[11px] font-bold text-blue-200 block">
      {l}
      <input
        type={tp}
        value={f[k]}
        onChange={handleChange(k)}
        className="pd mt-1 w-full px-3.5 py-2.5 text-sm text-white bg-[#0b183f] border border-white/10 focus:outline-none focus:border-[#ffc82c]"
      />
    </label>
  );

  const Row = ({ k, t1, d }) => (
    <div className="flex items-center gap-3 border-b border-white/10 py-3 last:border-none">
      <div className="mr-auto">
        <p className="text-sm font-bold text-white">{t1}</p>
        <p className="text-[11px] text-blue-300">{d}</p>
      </div>
      <Tog on={t[k]} set={(v) => setT({ ...t, [k]: v })} l={t1} />
    </div>
  );

  return (
    <TeacherLayout cur="tSet" go={go}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Img n="tav" c="h-14 w-14 rounded-2xl border-2 border-[#4a6fc8] object-cover" a="Guru" />
        <div className="mr-auto">
          <p className="text-[10px] font-bold text-[#ffc82c] tracking-wider uppercase">DASHBOARD GURU</p>
          <h1 className="hd text-3xl text-white">Pengaturan & Preferensi Akun</h1>
          <p className="text-xs text-blue-200">Sesuaikan profil dan ruang mengajar agar optimal untuk pembelajaran.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="pn p-5">
            <h2 className="hd mb-3 text-2xl text-white">Profil Guru</h2>
            <div className="mb-4 flex items-center gap-3">
              <Img n="tav" c="h-14 w-14 rounded-xl border-2 border-[#4a6fc8] object-cover" a="Foto" />
              <div className="mr-auto">
                <p className="font-bold text-white text-base">{f.fullName}</p>
                <p className="text-[11px] text-blue-300">Format gambar: JPG atau PNG, maksimal 2 MB.</p>
              </div>
              <button
                type="button"
                onClick={() => say('Foto profil guru telah aktif.', 'info')}
                className="pd px-3.5 py-2 text-xs font-bold text-blue-100 hover:text-white"
              >
                Ubah Foto
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <In k="fullName" l="Nama Lengkap & Gelar" />
              <In k="username" l="Nama Pengguna (Username)" />
              <In k="email" l="Alamat Surel (Email)" tp="email" />
              <In k="schoolName" l="Instansi / Sekolah" />
            </div>
          </div>

          {/* Teaching Preferences */}
          <div className="pn p-5">
            <h2 className="hd mb-3 text-2xl text-white">Preferensi Mengajar</h2>
            <div className="grid gap-3 sm:grid-cols-2 mb-3">
              <label className="text-[11px] font-bold text-blue-200 block">
                Kelas Utama
                <select
                  value={f.mainClass}
                  onChange={handleChange('mainClass')}
                  className="pd mt-1 w-full bg-[#0b183f] px-3.5 py-2.5 text-sm text-white border border-white/10 focus:outline-none"
                >
                  <option value="Kelas XI MPLB 1">Kelas XI MPLB 1</option>
                  <option value="Kelas XI MPLB 2">Kelas XI MPLB 2</option>
                  <option value="Kelas XI MPLB 3">Kelas XI MPLB 3</option>
                </select>
              </label>

              <label className="text-[11px] font-bold text-blue-200 block">
                Mata Pelajaran
                <select
                  value={f.subject}
                  onChange={handleChange('subject')}
                  className="pd mt-1 w-full bg-[#0b183f] px-3.5 py-2.5 text-sm text-white border border-white/10 focus:outline-none"
                >
                  <option value="Informatika & Kearsipan">Informatika & Kearsipan</option>
                  <option value="Manajemen Perkantoran">Manajemen Perkantoran</option>
                  <option value="Tata Kelola Surat">Tata Kelola Surat</option>
                </select>
              </label>

              <In k="kkmScore" l="Nilai Ketuntasan Minimum (KKM)" tp="number" />

              <label className="text-[11px] font-bold text-blue-200 block">
                Bahasa Antarmuka
                <select className="pd mt-1 w-full bg-[#0b183f] px-3.5 py-2.5 text-sm text-white border border-white/10">
                  <option>Bahasa Indonesia</option>
                  <option>English</option>
                </select>
              </label>
            </div>

            <Row
              k="autoUnlock"
              t1="Buka turret berikutnya secara otomatis"
              d="Siswa dapat melanjutkan ke turret berikutnya setelah mencapai nilai KKM."
            />
          </div>
        </div>

        {/* Right Column: Notifications & Security */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="pn p-5">
            <h2 className="hd text-2xl text-white mb-2">Preferensi Notifikasi</h2>
            <Row
              k="notifyActivity"
              t1="Aktivitas & pencapaian siswa"
              d="Kuis selesai, lencana baru, dan progres kuis kelas."
            />
            <Row
              k="notifyReminder"
              t1="Pengingat agenda mengajar"
              d="Ingatkan 30 menit sebelum sesi kearsipan dimulai."
            />
            <Row
              k="notifyWeekly"
              t1="Ringkasan mingguan melalui surel"
              d="Kirim rekapitulasi perkembangan setiap Senin pagi."
            />
          </div>

          {/* Security */}
          <div className="pn p-5">
            <h2 className="hd text-2xl text-white mb-2">Keamanan Akun</h2>
            <div className="flex items-center justify-between border-b border-white/10 py-3">
              <div>
                <p className="text-sm font-bold text-white">Kata Sandi</p>
                <p className="text-[11px] text-blue-300">Terakhir diubah 12 Okt 2025</p>
              </div>
              <button
                type="button"
                onClick={() => say('Gunakan password aman minimal 8 karakter.', 'info')}
                className="pd px-4 py-1.5 text-xs font-bold text-blue-100 hover:text-white"
              >
                Ubah
              </button>
            </div>
            <Row
              k="twoFactor"
              t1="Verifikasi dua langkah (2FA)"
              d="Lindungi akun guru dengan kode verifikasi tambahan."
            />
          </div>
        </div>
      </div>

      {/* Footer Save Bar */}
      <div className="pn mt-4 flex flex-wrap items-center justify-end gap-3 p-4">
        <span className="mr-auto text-xs text-blue-200">
          ⓘ Perubahan berlaku untuk akun dan kelas yang Anda kelola.
        </span>
        <button
          type="button"
          onClick={() => say('Perubahan dibatalkan.', 'info')}
          className="pd px-5 py-2.5 text-sm font-bold text-blue-200 hover:text-white"
        >
          Batal
        </button>
        <Gb onClick={handleSave} disabled={saving} cls="!rounded-xl !py-2.5 text-sm !font-sans font-bold shadow-lg">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Gb>
      </div>
    </TeacherLayout>
  );
}
