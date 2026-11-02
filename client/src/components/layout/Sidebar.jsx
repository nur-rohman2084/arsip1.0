import React from 'react';
import { Img, I } from '../common/UIComponents';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ items, cur, go, isTeacher = false }) {
  const { logout } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col rounded-r-3xl border-r border-[#2c4486] bg-[#0f1f4a]/95 p-4 md:flex z-20">
        <div className="mx-auto mt-2 text-center">
          <Img n="logo" c="mx-auto h-20 w-20" a="Logo" />
          <div className="hd mt-1 text-2xl leading-[1]">
            ARCHIVE<br />
            <span className="text-[#ffc82c]">ACADEMY</span>
          </div>
        </div>

        {isTeacher && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#14275c] p-2.5 border border-[#2c4486]">
            <Img n="gur" c="h-8 w-8 object-contain" a="Guru" />
            <span className="hd text-xl">Guru</span>
          </div>
        )}

        {isTeacher && (
          <p className="mt-3 text-[10px] font-bold tracking-wider text-blue-300">
            RUANG PENGAJAR
          </p>
        )}

        <nav className="mt-4 space-y-1.5 flex-1">
          {items.map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => go(key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm transition-all ${
                cur === key
                  ? 'gb !rounded-2xl text-base !shadow-none font-bold'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <I n={icon} c="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {isTeacher && (
          <div className="mt-auto mb-3 rounded-xl border border-[#2c4486] bg-[#14275c] p-3 text-left">
            <p className="hd text-base leading-tight text-white">Setiap kelas, petualangan baru.</p>
            <p className="mt-1 text-[11px] text-blue-200">Bantu siswa meraih potensi terbaiknya hari ini!</p>
          </div>
        )}

        <button
          onClick={logout}
          className={`flex items-center gap-3 border-t border-white/10 px-3 pt-3 text-sm text-red-300 hover:text-red-200 transition ${
            isTeacher ? '' : 'mt-auto'
          }`}
        >
          <I n="out" c="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-[#2c4486] bg-[#0f1f4a] py-2 md:hidden">
        {items.map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => go(key)}
            aria-label={label}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${
              cur === key ? 'text-[#ffc82c] font-bold' : 'text-blue-200'
            }`}
          >
            <I n={icon} c="w-5 h-5" />
            <span>{label.split(' ')[0]}</span>
          </button>
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-red-300"
        >
          <I n="out" c="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </nav>
    </>
  );
}

export const StudentLayout = ({ cur, go, children }) => {
  const items = [
    ['sHome', 'Beranda', 'home'],
    ['sPeta', 'Peta Belajar', 'map'],
    ['sAch', 'Pencapaian', 'trophy']
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} cur={cur} go={go} />
      <main className="min-w-0 flex-1 p-4 pb-24 md:p-6">{children}</main>
    </div>
  );
};

export const TeacherLayout = ({ cur, go, children }) => {
  const items = [
    ['tHome', 'Beranda', 'home'],
    ['tTurret', 'Kelola Turret', 'tur'],
    ['tSiswa', 'Data Siswa', 'users'],
    ['tLap', 'Laporan', 'chart'],
    ['tSet', 'Pengaturan', 'set']
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} cur={cur} go={go} isTeacher />
      <main className="min-w-0 flex-1 p-4 pb-24 md:p-6">{children}</main>
    </div>
  );
};
