import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '../../components/layout/Sidebar';
import { Img, I, Stat, Bar, Chip } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export function TeacherHome({ go }) {
  const { user } = useAuth();
  const { say } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.getTeacherDashboard();
        if (res.success) {
          setDashboardData(res);
        }
      } catch (err) {
        console.error('Failed to load teacher dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = dashboardData?.stats || {
    totalStudents: 32,
    completedStudents: 28,
    averageScore: 87.5,
    completionRate: '87%'
  };

  const classes = dashboardData?.classes || [
    { id: 1, name: 'Kelas XI MPLB 1', studentsCount: 32, completion: 87, img: 'isl1' },
    { id: 2, name: 'Kelas XI MPLB 2', studentsCount: 30, completion: 75, img: 'isl2' },
    { id: 3, name: 'Kelas XI MPLB 3', studentsCount: 28, completion: 60, img: 'isl3' }
  ];

  const schedules = dashboardData?.schedules || [
    { day: '28', month: 'Okt', title: 'Review Materi: Penyimpanan Sistem Abjad', sub_text: 'Kelas X IPA 1 • 10.00 – 11.30 WIB', tag: 'Hari ini' },
    { day: '29', month: 'Okt', title: 'Evaluasi Turret 3 – Penyimpanan Sistem Abjad', sub_text: 'Kelas X IPS 1 • 09.00 – 10.30 WIB', tag: 'Besok' },
    { day: '30', month: 'Okt', title: 'Pembahasan Hasil Quiz', sub_text: 'Kelas XI IPA 2 • 13.00 – 14.30 WIB', tag: 'Lusa' }
  ];

  // Performance line chart
  const Line = ({ a, b, lab }) => {
    const pt = (s) => s.map((v, i) => `${40 + i * (520 / (s.length - 1))},${170 - v * 1.6}`).join(' ');
    return (
      <svg viewBox="0 0 600 200" className="w-full">
        <title>Grafik performa</title>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1="40" x2="580" y1={170 - v * 1.6} y2={170 - v * 1.6} stroke="#fff" opacity=".12" />
            <text x="8" y={174 - v * 1.6} fill="#8fa6e0" fontSize="11">{v}</text>
          </g>
        ))}
        {lab.map((l, i) => (
          <text key={l} x={40 + i * (520 / (lab.length - 1))} y="192" fill="#8fa6e0" fontSize="11" textAnchor="middle">
            {l}
          </text>
        ))}
        <polyline points={pt(a)} fill="none" stroke="#6ea0ff" strokeWidth="2.5" />
        <polyline points={pt(b)} fill="none" stroke="#ffc82c" strokeWidth="2.5" />
        {[a, b].map((s, k) =>
          s.map((v, i) => (
            <circle
              key={`${k}-${i}`}
              cx={40 + i * (520 / (s.length - 1))}
              cy={170 - v * 1.6}
              r="4"
              fill={k ? '#ffc82c' : '#6ea0ff'}
            />
          ))
        )}
      </svg>
    );
  };

  const Leg = () => (
    <p className="flex gap-4 text-[11px] text-blue-200">
      <span><span className="text-[#6ea0ff] text-base">●</span> Rata-rata Nilai</span>
      <span><span className="text-[#ffc82c] text-base">●</span> Tingkat Penyelesaian</span>
    </p>
  );

  return (
    <TeacherLayout cur="tHome" go={go}>
      {/* Teacher Top Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Img
          n="tav"
          c="h-14 w-14 rounded-2xl border-2 border-[#4a6fc8] object-cover shadow-lg"
          a="Foto Guru"
        />
        <div className="mr-auto">
          <p className="text-[10px] font-bold text-[#ffc82c] tracking-wider uppercase">DASHBOARD GURU</p>
          <h1 className="hd text-3xl text-white">
            Selamat Datang, <span className="text-[#ffc82c]">{user?.full_name || 'Bu Rina!'}</span>
          </h1>
          <p className="text-xs text-blue-200">Kelola kelas dan pantau progres belajar siswa di Archive Academy.</p>
        </div>

        <button
          onClick={() => say('3 notifikasi baru: Siswa menyelesaikan Kuis Turret 1.', 'info')}
          aria-label="Notifikasi"
          className="pn relative !rounded-xl p-3 hover:bg-[#1b3274] transition"
        >
          <I n="bell" c="w-5 h-5 text-white" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffc82c] text-[10px] font-bold text-black shadow">
            3
          </span>
        </button>

        <div className="pn flex items-center gap-2 !rounded-xl px-3.5 py-2 text-xs text-blue-100">
          <I n="cal" c="w-4 h-4 text-[#ffc82c]" />
          <span>Sen, 27 Okt 2025</span>
        </div>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat ic={<I n="users" c="w-6 h-6 text-[#ffc82c]" />} l="Total Siswa" v={stats.totalStudents.toString()} d="+2" />
        <Stat ic={<I n="trophy" c="w-6 h-6 text-[#ffc82c]" />} l="Selesai Belajar" v={stats.completedStudents.toString()} d="+3" />
        <Stat ic={<I n="chart" c="w-6 h-6 text-[#ffc82c]" />} l="Rata-rata Nilai" v={stats.averageScore.toString()} d="+1.2" />
        <Stat ic={<I n="ok" c="w-6 h-6 text-[#ffc82c]" />} l="Tingkat Penyelesaian" v={stats.completionRate.toString()} d="+4%" />
      </div>

      {/* Performance & Classes Grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="pn p-5">
          <div className="mb-3 flex flex-wrap justify-between items-center gap-2">
            <h2 className="hd text-2xl text-white">📊 Performa Pembelajaran Mingguan</h2>
            <Leg />
          </div>
          <Line
            a={[48, 60, 60, 74, 72, 79, 82]}
            b={[58, 72, 74, 85, 84, 92, 92]}
            lab={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']}
          />
        </div>

        <div className="pn p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="hd text-2xl text-white">Kelas Aktif</h2>
              <button onClick={() => go('tSiswa')} className="text-xs font-bold text-[#ffc82c] hover:underline">
                Lihat Semua →
              </button>
            </div>

            <div className="space-y-3">
              {classes.map((c) => (
                <div key={c.name} className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-none">
                  <Img n={c.img || 'isl1'} c="h-12 w-12 rounded-xl object-cover shrink-0" a={c.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{c.name}</p>
                    <p className="text-[11px] text-blue-200">{c.studentsCount} Siswa • {c.completion}% Selesai</p>
                    <Bar v={c.completion} h="h-1.5" />
                  </div>
                  <button
                    onClick={() => go('tSiswa')}
                    className="rounded-lg bg-[#1b3274] px-3 py-1 text-[11px] font-semibold text-blue-100 hover:bg-[#254294] transition shrink-0"
                  >
                    Detail ›
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Activities, Top Teacher Badge & Quick Actions */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        {/* Schedule */}
        <div className="pn p-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="hd text-2xl text-white">Agenda Mengajar</h2>
            <button onClick={() => say('Agenda lengkap telah dijadwalkan.', 'info')} className="text-xs font-bold text-[#ffc82c] hover:underline">
              Lihat Semua →
            </button>
          </div>
          <div className="space-y-3">
            {schedules.map((s, idx) => (
              <div key={idx} className="flex items-center gap-3 pd p-2.5 border border-white/10">
                <div className="w-12 rounded-xl bg-[#1b3274] py-1.5 text-center shrink-0">
                  <p className="hd text-xl leading-none text-white">{s.day}</p>
                  <p className="text-[10px] text-blue-200 uppercase">{s.month}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight text-white truncate">{s.title}</p>
                  <p className="text-[11px] text-blue-200">{s.sub_text}</p>
                </div>
                <Chip t={s.tag} g={s.tag === 'Hari ini'} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Teacher Badge */}
        <div className="pn flex items-center gap-4 p-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#ffc82c] text-4xl shadow-xl" aria-hidden="true">
            ⭐
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-300 uppercase">PENGHARGAAN PENGAJAR</p>
            <p className="hd text-2xl text-[#ffc82c]">Top Teacher</p>
            <p className="text-[11px] text-blue-100 leading-snug mt-1">
              Diberikan kepada guru karena telah membimbing lebih dari 100 siswa menguasai modul kearsipan!
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pn p-5">
          <h2 className="hd mb-3 text-2xl text-white">⚡ Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              ['Import Siswa', 'file', 'tSiswa'],
              ['Lihat Laporan', 'chart', 'tLap'],
              ['Atur Turret', 'set', 'tTurret'],
              ['Unduh Nilai', 'dl', 'tLap']
            ].map(([l, ic, p]) => (
              <button
                key={l}
                onClick={() => go(p)}
                className="pd flex flex-col items-center justify-center gap-2 p-3 text-xs font-bold text-blue-100 hover:text-white hover:border-[#ffc82c] transition text-center"
              >
                <I n={ic} c="w-6 h-6 text-[#ffc82c]" />
                <span>{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
