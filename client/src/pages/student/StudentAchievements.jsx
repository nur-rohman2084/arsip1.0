import React, { useState, useEffect } from 'react';
import { StudentLayout } from '../../components/layout/Sidebar';
import { Img, I, Stat, Chip } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { avOf } from '../../assets/constants';
import { api } from '../../services/api';

export function StudentAchievements({ go }) {
  const { user, studentProfile, avatar } = useAuth();
  const [badges, setBadges] = useState([]);
  const [checklists, setChecklists] = useState([]);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await api.getAchievements();
        if (res.success) {
          setBadges(res.badges || []);
          setChecklists(res.checklists || []);
        }
      } catch (err) {
        console.error('Failed to load achievements:', err);
      }
    }
    loadAchievements();
  }, []);

  const name = user?.full_name || 'Roselia Paras Wangi';
  const totalXp = studentProfile?.total_xp || 2450;
  const progressPercent = studentProfile?.progress_percent || 78;

  const defaultBadges = [
    { name: 'Rising Star', icon_key: 'med', desc: 'Misi kearsipan pertama' },
    { name: 'Top Student', icon_key: 'tro1', desc: 'Skor di atas 85' },
    { name: 'Knowledge Seeker', icon_key: '🛡️', desc: 'Selesaikan modul teori' },
    { name: 'Speed Learner', icon_key: '🚀', desc: 'Tepat waktu' },
    { name: 'Ultimate Winner', icon_key: '🎯', desc: 'Kuasai seluruh turret' }
  ];

  const displayBadges = badges.length ? badges : defaultBadges;

  return (
    <StudentLayout cur="sAch" go={go}>
      {/* Student Head */}
      <div className="mb-4 flex items-center gap-3">
        <Img
          n={avOf(avatar)}
          c="h-14 w-14 rounded-2xl border-2 border-[#4a6fc8] bg-[#14275c] object-cover object-top"
          a="Avatar Siswa"
        />
        <div className="mr-auto">
          <p className="text-[11px] font-bold text-[#ffc82c] tracking-wider">KOLEKSI PENGHARGAAN</p>
          <h1 className="hd text-3xl text-white">{name}</h1>
          <p className="text-xs text-blue-200">Kumpulkan seluruh badge dan raih gelar Master Archivist.</p>
        </div>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat ic={<Img n="star" c="h-8 w-8" a="XP" />} l="Total XP" v={totalXp.toLocaleString('id-ID')} d="+150" />
        <Stat ic={<Img n="med" c="h-8 w-8" a="Badge" />} l="Badge Koleksi" v="5" d="+1" />
        <Stat ic={<I n="chart" c="w-6 h-6 text-[#ffc82c]" />} l="Progress Belajar" v={`${progressPercent} %`} bar={progressPercent} />
        <Stat ic={<I n="ok" c="w-6 h-6 text-[#ffc82c]" />} l="Target Misi" v="3 / 4" d="75%" />
      </div>

      {/* Main Grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.9fr_1fr]">
        <div className="space-y-4">
          {/* Badge Collection */}
          <div className="pn p-5">
            <h2 className="hd text-3xl text-white">Koleksi Badge</h2>
            <p className="mb-4 text-sm text-blue-200">
              Kumpulkan berbagai badge prestisius dengan menyelesaikan misi dan tantangan kearsipan di Archive Academy.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {displayBadges.map((b) => (
                <div key={b.name} className="pd flex flex-col items-center gap-2 p-3 text-center border border-white/10 hover:border-[#ffc82c] transition">
                  {b.icon_key && b.icon_key.length > 2 ? (
                    <Img n={b.icon_key} c="h-16 w-16 object-contain" a={b.name} />
                  ) : (
                    <span className="text-5xl" aria-hidden="true">{b.icon_key || '🏆'}</span>
                  )}
                  <p className="text-sm font-bold text-white">{b.name}</p>
                  <span className="rounded-full bg-[#ffc82c] px-3 py-0.5 text-xs font-bold text-black shadow">
                    Diperoleh ✓
                  </span>
                </div>
              ))}

              {/* Locked Badges */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="pd flex flex-col items-center justify-center gap-2 bg-[#0b3a86]/50 p-3 text-gray-300 border border-dashed border-white/20"
                >
                  <span className="text-5xl opacity-50" aria-hidden="true">🛡️</span>
                  <div className="flex items-center gap-1 text-xs text-blue-300">
                    <I n="lock" c="w-4 h-4" />
                    <span>Terkunci</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Overview Mini Card */}
          <div className="pn flex flex-wrap items-center gap-3 p-4">
            <Img n="isl1" c="h-12 w-12 rounded-xl object-cover" a="Kelas" />
            <div className="mr-auto">
              <p className="text-sm font-bold text-white">Kelas XI MPLB 1</p>
              <p className="text-xs text-blue-200">Tahun Ajaran 2025/2026 • 32 Teman Sekelas</p>
            </div>
            <Chip t="AKTIF" g />
          </div>
        </div>

        {/* Right Column: Progress Circle & Target Checklists */}
        <div className="space-y-4">
          <div className="pn p-5">
            <div className="flex justify-between items-center">
              <h3 className="hd text-xl text-white">Progres Pencapaian</h3>
              <Chip t="ON TRACK" g />
            </div>
            <p className="mt-1 text-xs text-blue-200">Selesaikan seluruh aktivitas belajar</p>

            <div className="mt-4 flex items-center gap-4">
              <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90 shrink-0">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b4a86" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ffc82c"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray="181 251"
                />
                <text
                  x="50"
                  y="50"
                  transform="rotate(90 50 50)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="22"
                  fontWeight="bold"
                >
                  72 %
                </text>
              </svg>

              <ul className="space-y-2 text-xs text-blue-100 flex-1">
                {(checklists.length ? checklists : [
                  { text: 'Selesaikan 3 Turret', isDone: true },
                  { text: 'Raih 3 Badge', isDone: true },
                  { text: 'Kumpulkan 2.000 XP', isDone: true },
                  { text: 'Selesaikan Semua Turret', isDone: false }
                ]).map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                        c.isDone ? 'bg-emerald-500 text-black' : 'border border-white/50 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Activity Log Card */}
          <div className="pn p-5">
            <h3 className="hd text-xl text-white mb-2">Riwayat Pembelajaran</h3>
            <div className="space-y-2 text-xs">
              <div className="pd p-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Kuis Turret 1 Selesai</p>
                  <p className="text-blue-300">Nilai: 850 • +150 XP</p>
                </div>
                <span className="text-emerald-300 font-bold">Lulus</span>
              </div>
              <div className="pd p-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Badge Penjelajah Arsip</p>
                  <p className="text-blue-300">Dianugerahkan otomatis</p>
                </div>
                <span className="text-[#ffc82c]">★ Baru</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
