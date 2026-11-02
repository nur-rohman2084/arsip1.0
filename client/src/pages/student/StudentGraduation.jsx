import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Img, Gb, Bar, I } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export function StudentGraduation({ go, quizResult }) {
  const { user } = useAuth();
  const { say } = useToast();
  const [certModal, setCertModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const name = user?.full_name || 'Roselia Paras Wangi';
  const score = quizResult?.score || 850;
  const xpGained = quizResult?.xpGained || 150;
  const badgeName = quizResult?.badgeAwarded || 'Penjelajah Arsip';
  const certCode = quizResult?.certCode || 'CERT-AA-2025-001';

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await api.getLeaderboard();
        if (res.success && res.leaderboard) {
          setLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
    }
    loadLeaderboard();
  }, []);

  const defaultTop3 = [
    { rank: '👑', name: 'Rizky Pratama', score: '12.500' },
    { rank: '2', name: 'Adhilah Kusuma', score: '11.000' },
    { rank: '3', name: 'Nayla Muna Arifin', score: '10.900' }
  ];

  const topRows = leaderboard.length >= 3
    ? leaderboard.slice(0, 3).map((r, i) => ({
        rank: i === 0 ? '👑' : String(i + 1),
        name: r.name,
        score: r.xp?.toLocaleString('id-ID') || '10.000'
      }))
    : defaultTop3;

  return (
    <div>
      <Header cur="lane" go={go} />

      <div className="mx-auto max-w-6xl space-y-4 px-4 pb-8">
        {/* Success Banner */}
        <div className="pn flex items-center gap-3 !rounded-xl px-5 py-3 border border-emerald-500/40 bg-emerald-950/40">
          <Img n="flg" c="h-9 object-contain" a="Bendera" />
          <span className="hd mr-auto text-2xl text-emerald-300">Turret 1 – Selesai</span>
          <i className="hidden sm:block text-sm text-blue-100">Kerja bagus, Penjelajah Kearsipan!</i>
        </div>

        {/* Hero Card */}
        <div className="pn flex flex-wrap items-center gap-6 p-6">
          <Img n="tro1" c="h-32 object-contain drop-shadow-[0_10px_20px_rgba(255,200,44,0.4)]" a="Trophy" />
          <div className="flex-1 min-w-[240px]">
            <h1 className="hd text-3xl md:text-4xl text-white">Halo, {name} !</h1>
            <p className="max-w-md text-sm text-blue-100 mt-1">
              Terus belajar dan raih pencapaian terbaikmu di Archive Academy! Modul berikutnya siap dieksplorasi.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-[#14275c]/60 px-3.5 py-1.5">
                <Img n="star" c="h-8 w-8" a="Skor" />
                <span className="text-sm leading-tight text-white">
                  Skor Akhir<br />
                  <b className="text-[#ffc82c] text-base">{score}</b>
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-[#14275c]/60 px-3.5 py-1.5">
                <span className="hd rounded bg-[#ffc82c] px-2 py-1 text-[#2a1d00] text-sm">XP</span>
                <div className="w-36">
                  <p className="text-xs text-blue-200">
                    <b className="text-white">+{xpGained}</b> EXP Diperoleh
                  </p>
                  <Bar v={75} h="h-1.5" />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-[#14275c]/60 px-3.5 py-1.5">
                <Img n="med" c="h-8 w-8" a="Badge" />
                <span className="text-sm leading-tight text-white">
                  Badge Baru<br />
                  <b className="text-emerald-300 text-xs">{badgeName}</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard and Certificate Grid */}
        <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
          {/* Leaderboard */}
          <div className="pn p-5">
            <h2 className="hd mb-3 flex items-center gap-2 text-2xl text-white">
              <Img n="pod" c="h-8 w-8 object-contain" a="Podium" />
              Peringkat Kelas
            </h2>
            {topRows.map(({ rank, name: sName, score: sScore }) => (
              <div
                key={sName}
                className="mb-2 flex items-center gap-4 rounded-xl bg-[#2f3f8c]/80 px-4 py-2.5 border border-white/10"
              >
                <span className="hd w-6 text-xl text-[#ffc82c]">{rank}</span>
                <span className="mr-auto text-sm font-semibold text-white">{sName}</span>
                <b className="text-[#ffc82c] text-sm">{sScore} XP</b>
              </div>
            ))}
            <p className="hd text-center text-blue-300 my-1">...</p>
            <div className="flex items-center gap-4 rounded-xl bg-[#3a4aa0] px-4 py-2.5 border-2 border-[#ffc82c]">
              <span className="hd w-6 text-xl text-white">★</span>
              <span className="mr-auto text-sm font-bold text-white">{name.split(' ')[0]} (Kamu)</span>
              <b className="text-[#ffc82c] text-sm">{score} Skor</b>
            </div>
          </div>

          {/* Certificate Card */}
          <div className="pn p-5 flex flex-col justify-between">
            <div>
              <h2 className="hd mb-3 text-2xl text-white">Sertifikat Kelulusan</h2>
              <div className="flex flex-wrap items-center gap-5">
                <Img n="cer" c="h-36 object-contain drop-shadow-lg" a="Sertifikat" />
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Selamat! Kamu telah menyelesaikan seluruh rangkaian pembelajaran dan studi kasus di <b>Archive Academy</b> dengan hasil memuaskan.
                  </p>
                  <Gb onClick={() => setCertModal(true)} cls="mt-4 !px-6 text-xl shadow-lg">
                    Lihat & Unduh Sertifikat <I n="dl" c="w-5 h-5 ml-1" />
                  </Gb>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-blue-300">
              ID Sertifikat: <span className="font-mono text-white">{certCode}</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => go('sHome')}
            className="gy px-10 py-3 text-3xl font-bold hover:scale-105 transition transform shadow-xl"
          >
            Lanjut ke Beranda →
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {certModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl">
            <div
              id="cert"
              className="rounded-3xl border-4 border-[#ffc82c] bg-[#fffaf0] p-8 text-center text-[#14213d] shadow-2xl relative"
            >
              <Img n="logo" c="mx-auto h-16 w-16" a="Logo" />
              <p className="hd mt-2 text-xl text-[#07122f]">ARCHIVE ACADEMY · SERTIFIKAT RESMI</p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{certCode}</p>

              <h2 className="hd mt-4 text-4xl text-[#0d3a86] border-b-2 border-[#ffc82c] pb-2 inline-block">
                {name}
              </h2>

              <p className="mt-4 text-sm text-gray-700 leading-relaxed max-w-md mx-auto">
                Telah berhasil menyelesaikan <b>Turret 1 · Hakikat Kearsipan</b> dengan skor akhir <b>{score}</b> dan dianugerahi lencana kehormatan <b>{badgeName}</b>.
              </p>

              <div className="mt-8 flex justify-between items-end border-t border-gray-300 pt-4 px-4 text-left">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Status Kelulusan</p>
                  <p className="text-xs font-bold text-emerald-700">TERVERIFIKASI SISTEM ✓</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase">Pengajar / Validator</p>
                  <p className="hd text-base text-[#0d3a86]">Rina Susanti, S.Pd.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <Gb
                onClick={() => {
                  window.print();
                  say('Pilih "Simpan sebagai PDF" pada dialog cetak browsermu.', 'info');
                }}
                cls="text-lg shadow-lg"
              >
                Cetak / Simpan PDF
              </Gb>
              <button
                onClick={() => setCertModal(false)}
                className="gy px-6 py-2 text-lg font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
