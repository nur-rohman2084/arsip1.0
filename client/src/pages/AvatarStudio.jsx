import React, { useState } from 'react';
import { Logo, Gb, Img } from '../components/common/UIComponents';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CLO, HAI, ACC, CN, HN, AN, avOf } from '../assets/constants';

export function AvatarStudio({ go }) {
  const { avatar, updateAvatar } = useAuth();
  const { say } = useToast();

  const [s, setS] = useState({
    c: avatar?.c !== undefined ? avatar.c : 0,
    h: avatar?.h !== undefined ? avatar.h : null,
    a: avatar?.a !== undefined ? avatar.a : 0,
    skin: avatar?.skin || 'sawo'
  });

  const pick = (k, i) => setS({ ...s, [k]: s[k] === i ? null : i });

  const currentImg = avOf(s);

  const G = [
    ['Pakaian', 'c', CLO, CN],
    ['Rambut', 'h', HAI, HN],
    ['Aksesori', 'a', ACC, AN]
  ];

  const handleSave = async () => {
    try {
      await updateAvatar(s);
      say('Avatar berhasil disimpan ke profilmu!', 'success');
      go('sHome');
    } catch (err) {
      say('Gagal menyimpan avatar, periksa koneksi.', 'error');
    }
  };

  const itemSummary = [
    s.c !== null && CN[s.c],
    s.h !== null && 'Rambut ' + HN[s.h],
    s.a !== null && AN[s.a]
  ].filter(Boolean).join(' · ') || 'Pilihan default';

  return (
    <div className="mx-auto max-w-5xl px-5 py-4">
      <Logo s />
      <div className="text-center mt-3">
        <h1 className="hd ol text-4xl md:text-5xl">Kustomisasi Avatar Kamu!</h1>
        <p className="mt-2 text-lg text-blue-100">Buat karakter unikmu untuk memulai petualangan belajar kearsipan</p>
      </div>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1.3fr]">
        {/* Avatar Preview Box */}
        <div className="pn text-center p-6 flex flex-col items-center">
          <div className="relative h-72 md:h-96 w-64 flex items-center justify-center">
            <Img
              n={currentImg}
              c="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              a="Pratinjau Avatar"
            />
          </div>
          <div className="mt-4 rounded-xl bg-[#0b183f] px-4 py-2 border border-[#2c4486]">
            <p className="text-xs font-semibold text-[#ffc82c]">SETELAN AKTIF</p>
            <p className="text-sm text-blue-100 font-medium">{itemSummary}</p>
          </div>
        </div>

        {/* Item Selection Tabs */}
        <div>
          <div className="rounded-2xl border border-[#4a6fc8] bg-[#14449a]/80 p-4 shadow-xl">
            {G.map(([t, k, L, N]) => (
              <div key={k} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1.5">
                  <h2 className="hd text-xl text-white">{t}</h2>
                  <span className="text-xs text-blue-200">
                    {s[k] !== null ? N[s[k]] : 'Tidak ada'}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2 rounded-xl bg-[#5576b8]/60 p-2 border border-white/10">
                  {L.map((n, i) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={N[i]}
                      aria-pressed={s[k] === i}
                      onClick={() => pick(k, i)}
                      className={`aspect-square rounded-lg bg-white/95 p-1 transition transform hover:scale-105 ${
                        s[k] === i ? 'ring-4 ring-[#ffc82c] shadow-lg scale-105' : 'hover:bg-white'
                      }`}
                    >
                      <Img n={n} c="h-full w-full object-contain" a={N[i]} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => go('sHome')}
              className="gy px-6 py-2.5 text-xl font-bold"
            >
              Lewati
            </button>
            <Gb onClick={handleSave} cls="!px-8 !py-2.5 text-2xl shadow-lg">
              Simpan Avatar &gt;&gt;
            </Gb>
          </div>
        </div>
      </div>
    </div>
  );
}
