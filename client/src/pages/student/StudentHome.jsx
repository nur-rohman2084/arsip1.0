import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/Sidebar';
import { Img, I, Stat, Bar, Gb, Chip } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { avOf } from '../../assets/constants';
import { api } from '../../services/api';

export function StudentHome({ go }) {
  const { user, studentProfile, avatar, refreshStudentProfile } = useAuth();
  const { say } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshStudentProfile();
  }, []);

  const name = user?.full_name || 'Roselia Paras Wangi';
  const totalXp = studentProfile?.total_xp || 2450;
  const level = studentProfile?.level || 1;
  const badgeCount = studentProfile?.badgeCount || 6;
  const progressPercent = studentProfile?.progressPercent || 78;

  const R = [
    ['01', 'Briefing Room', 'Pahami misi & materi kearsipan', 'SELESAI', 'bg-emerald-600'],
    ['02', 'Simulasi Arsip', 'Latihan pemilahan warkat', 'DALAM PROGRES', 'bg-[#ffc82c] text-black'],
    ['03', 'Tantangan Kuis', 'Uji pengetahuan kearsipan', 'TERKUNCI', 'bg-white/20 text-white/70']
  ];

  return (
    <StudentLayout cur="sHome" go={go}>
      {/* Student Top Bar */}
      <div className="mb-4 flex items-center gap-3">
        <Img
          n={avOf(avatar)}
          c="h-14 w-14 rounded-2xl border-2 border-[#4a6fc8] bg-[#14275c] object-cover object-top"
          a="Avatar Siswa"
        />
        <div className="mr-auto">
          <p className="text-[11px] font-bold text-[#ffc82c] tracking-wider">PORTAL SISWA</p>
          <h1 className="hd text-3xl text-white">Selamat Datang, {name}!</h1>
          <p className="text-xs text-blue-200">
            Lanjutkan petualangan belajarmu di dunia kearsipan Archive Academy.
          </p>
        </div>
        <div className="pn flex items-center gap-2 !rounded-xl px-3.5 py-2 text-xs">
          <I n="cal" c="w-4 h-4 text-[#ffc82c]" />
          <span>Senin, 27 Okt 2025</span>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat ic={<Img n="star" c="h-8 w-8" a="XP" />} l="Total XP" v={totalXp.toLocaleString('id-ID')} d="+150" />
        <Stat ic={<Img n="med" c="h-8 w-8" a="Badge" />} l="Badge Koleksi" v={badgeCount.toString()} d="+1" />
        <Stat ic={<I n="chart" c="w-6 h-6 text-[#ffc82c]" />} l="Progress Belajar" v={`${progressPercent} %`} bar={progressPercent} />
        <Stat ic={<I n="ok" c="w-6 h-6 text-[#ffc82c]" />} l="Target Harian" v="3 / 4" d="75%" />
      </div>

      {/* Main Grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-4">
          {/* Active Missions Card */}
          <div className="pn p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="hd text-2xl text-white">Misi Kearsipan Aktif</h2>
                <p className="text-xs text-blue-200">Turret 1 · Hakikat Kearsipan & Pengelolaan Warkat</p>
              </div>
              <Gb onClick={() => go('lane')} cls="!px-4 !py-1.5 text-sm font-bold">
                Peta Lane &gt;&gt;
              </Gb>
            </div>

            <div className="space-y-2.5">
              {R.map(([no, title, desc, status, badgeCls]) => (
                <div key={no} className="pd flex items-center gap-3 p-3.5 hover:bg-[#0b1b4f] transition">
                  <span className="hd text-2xl text-[#ffc82c] w-8">{no}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">{title}</p>
                    <p className="text-xs text-blue-200">{desc}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${badgeCls}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="pn p-5">
            <h2 className="hd text-2xl mb-2 text-white">Performa Pembelajaran</h2>
            <p className="text-xs text-blue-200 mb-3">
              Rata-rata nilaimu berada di atas batas kelulusan kelas (KKM 75).
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="pd p-3 text-center">
                <p className="text-[11px] text-blue-300">Rata-rata Nilai</p>
                <p className="hd text-3xl text-[#ffc82c]">{studentProfile?.average_score || 88.5}</p>
              </div>
              <div className="pd p-3 text-center">
                <p className="text-[11px] text-blue-300">Peringkat Kelas</p>
                <p className="hd text-3xl text-emerald-300">Top 5</p>
              </div>
              <div className="pd p-3 text-center">
                <p className="text-[11px] text-blue-300">Streak Harian</p>
                <p className="hd text-3xl text-orange-400">🔥 3 Hari</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-4">
          {/* Class Card */}
          <div className="pn p-4 flex items-center gap-3">
            <Img n="isl1" c="h-12 w-12 rounded-xl object-cover" a="Kelas" />
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Kelas XI MPLB 1</p>
              <p className="text-xs text-blue-200">32 Siswa · Guru: Bu Rina</p>
            </div>
            <button
              onClick={() => say('Informasi kelas terkoneksi ke akun pengajar.')}
              className="text-xs text-[#ffc82c] font-bold hover:underline"
            >
              Detail ›
            </button>
          </div>

          {/* Daily Streak Card */}
          <div className="pn p-5">
            <div className="flex justify-between items-center">
              <h3 className="hd text-xl text-white">Target Harian</h3>
              <Chip t="ON TRACK" g />
            </div>
            <p className="text-xs text-blue-200 mt-1">Selesaikan 1 kuis turret hari ini</p>
            <div className="mt-3">
              <Bar v={75} h="h-3" />
              <p className="text-[11px] text-blue-200 mt-1 text-right">3 dari 4 misi tuntas</p>
            </div>
          </div>

          {/* New Badge Card */}
          <div className="pn flex items-center gap-3 p-4">
            <Img n="med" c="h-12 w-12 object-contain" a="Badge Baru" />
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Badge: Penjelajah Arsip</p>
              <p className="text-[11px] text-blue-200">Berhasil menyelesaikan misi kearsipan pertamamu.</p>
              <button
                onClick={() => go('sAch')}
                className="text-[11px] font-bold text-[#ffc82c] hover:underline mt-0.5 block"
              >
                Lihat koleksi badge →
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
