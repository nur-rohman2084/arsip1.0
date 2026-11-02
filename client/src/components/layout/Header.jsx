import React from 'react';
import { Logo, Img } from '../common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { avOf } from '../../assets/constants';

export function Header({ cur, go }) {
  const { user, studentProfile, avatar } = useAuth();
  const { say } = useToast();

  const studentName = user?.full_name || 'Roselia Paras Wangi';
  const firstName = studentName.split(' ')[0];
  const level = studentProfile?.level || 1;
  const xp = studentProfile?.total_xp || 120;

  const navLinks = [
    { key: 'sHome', label: 'Beranda' },
    { key: 'lane', label: 'Peta Belajar' },
    { key: 'sAch', label: 'Pencapaian' },
    { key: 'help', label: 'Bantuan' },
  ];

  return (
    <header className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
      <button onClick={() => go('sHome')} className="mr-auto text-left" aria-label="Beranda">
        <Logo />
      </button>

      <nav className="hidden items-center gap-6 sm:flex">
        {navLinks.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => (key === 'help' ? say('Pusat bantuan & FAQ Archive Academy siap mendampingi!') : go(key))}
            className={`text-lg transition-colors ${cur === key ? 'text-[#ffc82c] font-bold' : 'text-blue-100 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="ml-4 flex items-center gap-2.5 bg-[#14275c]/60 border border-[#2c4486] px-3 py-1.5 rounded-xl">
        <Img
          n={avOf(avatar)}
          c="h-10 w-10 rounded-lg bg-white/20 object-cover object-top border border-[#ffc82c]"
          a="Avatar Siswa"
        />
        <div className="text-xs leading-tight">
          <div className="font-bold text-white">{firstName}</div>
          <div className="text-[#ffc82c] font-semibold">Level {level} - {xp} EXP</div>
        </div>
      </div>
    </header>
  );
}
