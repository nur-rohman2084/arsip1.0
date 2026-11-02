import React, { useState, useEffect } from 'react';
import { StudentLayout } from '../../components/layout/Sidebar';
import { Img, Gb, Bar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { avOf } from '../../assets/constants';
import { api } from '../../services/api';

export function StudentMap({ go }) {
  const { user, studentProfile, avatar } = useAuth();
  const [sel, setSel] = useState(0);
  const [turrets, setTurrets] = useState([]);

  useEffect(() => {
    async function loadTurrets() {
      try {
        const res = await api.getTurrets();
        if (res.success && res.turrets) {
          setTurrets(res.turrets);
        }
      } catch (err) {
        console.error('Failed to load turrets:', err);
      }
    }
    loadTurrets();
  }, []);

  const name = user?.full_name || 'Roselia Paras Wangi';
  const totalXp = studentProfile?.total_xp || 2450;
  const level = studentProfile?.level || 9;

  const displayTurrets = turrets.length ? turrets.slice(0, 5) : [
    { index: 0, name: 'Turret Laser', code: 't0', isActive: true },
    { index: 1, name: 'Turret Meriam', code: 't1', isActive: false },
    { index: 2, name: 'Turret Rudal', code: 't2', isActive: false },
    { index: 3, name: 'Turret Perisai', code: 't3', isActive: false },
    { index: 4, name: 'Turret Penguat', code: 't4', isActive: false }
  ];

  return (
    <StudentLayout cur="sPeta" go={go}>
      <h1 className="hd text-3xl md:text-4xl leading-tight">
        Selamat Datang,<br />
        <span className="text-[#ffc82c]">{name}!</span>
      </h1>
      <p className="text-sm text-blue-100 mt-1">
        Petualangan hebatmu di dunia kearsipan masih berlanjut! Selesaikan misi berikutnya.
      </p>

      {/* Hero Stats */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[2.2fr_1fr]">
        <div className="pn flex flex-wrap items-center gap-4 p-5">
          <Img
            n={avOf(avatar)}
            c="h-28 w-24 rounded-2xl bg-[#14275c] border-2 border-[#4a6fc8] object-cover object-top"
            a="Avatar"
          />
          <div className="min-w-[200px] flex-1">
            <p className="hd text-xl text-blue-200">Level {level}</p>
            <p className="hd text-4xl text-[#ffc82c]">Archivist</p>
            <div className="mt-1">
              <Bar v={55} h="h-3.5" />
            </div>
            <p className="mt-1.5 text-xs text-blue-200 font-medium">
              + 150 XP lagi untuk menuju level selanjutnya
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <span className="text-xs text-blue-200">Total XP</span>
              <Img n="star" c="h-8 w-8" a="Star" />
            </div>
            <p className="hd text-4xl text-white">{totalXp.toLocaleString('id-ID')}</p>
            <p className="text-[11px] font-bold text-emerald-300">↑ +150 XP</p>
          </div>
        </div>

        <div className="pn flex items-center justify-center gap-4 p-5 text-center">
          <span className="text-6xl animate-pulse" aria-hidden="true">🔥</span>
          <div>
            <p className="text-xs text-blue-200 font-bold uppercase">Streak Belajar</p>
            <span className="hd text-4xl text-[#ffc82c]">Hari Ke 3</span>
          </div>
        </div>
      </div>

      {/* Turret Cards */}
      <h2 className="hd mb-3 mt-6 text-3xl text-white">Perjalanan yang Menunggumu</h2>
      <div className="pn grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
        {displayTurrets.map((t, i) => {
          const isSelected = sel === i;
          const isUnlocked = i === 0 && t.isActive;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => setSel(i)}
              className={`pd p-3 text-center transition-all ${
                isSelected ? '!border-2 !border-[#ffc82c] shadow-[0_0_15px_rgba(255,200,44,0.3)] scale-[1.02]' : 'hover:border-white/40'
              }`}
            >
              <p className="flex justify-between text-[10px]">
                <span className={isSelected ? 'text-[#ffc82c] font-bold' : 'text-blue-300'}>
                  {isSelected ? 'DIPILIH' : `LEVEL ${i + 1}`}
                </span>
                <span>{isSelected ? '✓' : '•••'}</span>
              </p>
              <Img n={t.code || `t${i}`} c="mx-auto my-2 h-24 object-contain" a={t.name} />
              <p className="hd text-lg leading-tight text-white">{t.name}</p>
              <p className="text-[10px] text-blue-300 mt-0.5">Level 1 • 120 soal</p>
              <span
                className={`mt-2 inline-block rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                  isUnlocked ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' : 'bg-[#1a2147] text-red-400 border border-red-500/30'
                }`}
              >
                {isUnlocked ? '■ Aktif' : '● Locked'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Gb onClick={() => go('lane')} cls="!px-8 !py-3 text-2xl shadow-xl">
          ▶ Lanjutkan Perjalanan &gt;&gt;
        </Gb>
      </div>
    </StudentLayout>
  );
}
