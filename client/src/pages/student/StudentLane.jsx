import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Img, Gb } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TUR, TOWER, POS, avOf } from '../../assets/constants';
import { api } from '../../services/api';

export function StudentLane({ go }) {
  const { user, avatar } = useAuth();
  const { say } = useToast();

  const [lane, setLane] = useState(0);
  const [turrets, setTurrets] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getTurrets();
        if (res.success && res.turrets) {
          setTurrets(res.turrets);
        }
      } catch (err) {
        console.error('Failed to load turrets:', err);
      }
    }
    load();
  }, []);

  const mv = (d) => setLane((l) => (l + d + 8) % 8);

  const currentTurret = turrets[lane] || {
    name: TUR[lane][0],
    isActive: lane === 0
  };

  const isCurrentTurretActive = lane === 0 && currentTurret.isActive;

  const enter = () => {
    if (isCurrentTurretActive) {
      go('learn');
    } else {
      say(lane === 0 ? 'Turret ini dinonaktifkan oleh guru.' : 'Turret ini masih terkunci. Selesaikan turret sebelumnya terlebih dahulu!', 'error');
    }
  };

  const name = user?.full_name || 'Roselia Paras Wangi';

  return (
    <div>
      <Header cur="lane" go={go} />

      <div className="mx-auto max-w-6xl px-4 pb-8">
        {/* Student Banner */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#ffc82c] px-4 py-2.5 text-[#2a1d00] shadow-xl">
          <Img
            n={avOf(avatar)}
            c="h-12 w-12 rounded-xl bg-[#14275c] object-cover object-top border-2 border-[#14275c]"
            a="Avatar"
          />
          <div className="mr-auto">
            <p className="text-[10px] font-bold tracking-wider uppercase opacity-80">PENJELAJAH ARSIP</p>
            <p className="hd text-2xl leading-none text-[#2a1d00]">{name} !</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-[11px] font-bold leading-tight">EXP<br />120/1000</span>
            <div className="h-3 w-48 rounded-full bg-[#0b183f]">
              <div className="h-full w-[12%] rounded-full bg-[#ffc82c]" />
            </div>
          </div>
          <button
            onClick={() => go('sHome')}
            className="hd ml-4 rounded-lg bg-[#2a1d00] text-[#ffc82c] px-3 py-1 text-sm hover:bg-black transition"
          >
            ☰ BERANDA
          </button>
        </div>

        {/* Lane Area & Side Panel */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_260px]">
          {/* Lane Map Canvas */}
          <div className="pn relative h-[520px] overflow-hidden md:h-[600px] border-2 border-[#2f6bd6]">
            <h2 className="hd absolute left-6 top-4 z-10 text-3xl text-white">PETA LANE</h2>
            <p className="absolute right-6 top-6 z-10 hidden text-xs italic text-blue-200 sm:block">
              Jelajahi setiap turret dan tingkatkan pengetahuan kearsipanmu!
            </p>

            {/* Connecting Lane Path */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full pointer-events-none">
              <path
                vectorEffect="non-scaling-stroke"
                d="M6.6 27 Q17 12 28 27 T55.7 27 T79 27 Q95 14 92 40 Q91 62 90 58 Q80 66 67.6 58 T43.7 58 T19 57"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity=".85"
              />
            </svg>

            {/* Tower Nodes */}
            {POS.map(([x, y], i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLane(i)}
                aria-label={TUR[i][0]}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <Img
                  n={TOWER[i]}
                  c={`object-contain transition-all duration-200 ${
                    i === 7 ? 'h-36 md:h-44' : 'h-28 md:h-36'
                  } ${
                    i === lane
                      ? 'drop-shadow-[0_0_18px_#ffc82c] scale-110'
                      : i === 0
                      ? 'hover:scale-105'
                      : 'opacity-70 grayscale-[30%] hover:opacity-90'
                  }`}
                  a={TUR[i][0]}
                />
                {i === lane && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#ffc82c] px-2.5 py-0.5 text-xs font-bold text-black shadow-lg animate-pulse">
                    Turret {i + 1}
                  </span>
                )}
              </button>
            ))}

            {/* D-Pad Controller */}
            <div className="absolute bottom-5 left-5 h-[104px] w-[104px] rounded-full bg-[#0d2a8a] p-2 shadow-2xl border border-white/20 z-20">
              <div className="relative h-full w-full rounded-full bg-[#2f63e8]">
                <button
                  type="button"
                  onClick={() => mv(-1)}
                  aria-label="Atas"
                  className="absolute left-1/2 top-0 -translate-x-1/2 text-xl text-white hover:text-[#ffc82c]"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => mv(1)}
                  aria-label="Kanan"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-xl text-white hover:text-[#ffc82c]"
                >
                  ▶
                </button>
                <button
                  type="button"
                  onClick={() => mv(1)}
                  aria-label="Bawah"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180 text-xl text-white hover:text-[#ffc82c]"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => mv(-1)}
                  aria-label="Kiri"
                  className="absolute left-1 top-1/2 -translate-y-1/2 text-xl text-white hover:text-[#ffc82c]"
                >
                  ◀
                </button>
                <span className="absolute inset-[30%] rounded-full bg-[#0d2a8a] pointer-events-none" />
              </div>
            </div>

            {/* Avatar Platform Preview */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
              <Img n={avOf(avatar)} c="mx-auto h-28 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]" a="Avatar" />
              <div className="-mt-3 h-6 w-36 rounded-[50%] border-2 border-[#ffc82c] bg-[#2a4a8a] shadow-[0_0_20px_#ffc82c]" />
            </div>

            {/* Enter Turret Button */}
            <Gb
              onClick={enter}
              cls="absolute bottom-5 right-5 !rounded-2xl !px-8 !py-3 text-2xl shadow-2xl z-20"
            >
              Masuk &gt;&gt;
            </Gb>
          </div>

          {/* Right Status Sidebar */}
          <aside className="pn p-5 text-center border-2 border-[#2f6bd6] flex flex-col justify-between">
            <div>
              <h3 className="hd text-3xl text-white">Progress Turret</h3>
              <p className="hd mt-3 text-6xl">
                <span className="text-[#ffc82c]">1</span> / 8
              </p>
              <div className="mt-2 h-4 rounded-full bg-[#0b183f] overflow-hidden">
                <div className="h-full w-[12.5%] rounded-full bg-[#ffc82c]" />
              </div>

              <div className="mt-6 rounded-xl bg-[#2a4a8a]/70 p-4 text-sm border border-white/10 text-left">
                <p className="font-bold text-white text-base">
                  {lane === 0 ? 'Turret 1 · Hakikat Kearsipan' : `${TUR[lane][0]} · Terkunci`}
                </p>
                <p className="text-xs text-blue-200 mt-1">
                  {lane === 0
                    ? 'Materi dasar pengertian arsip, warkat, dokumen, dan jenis arsip dinamis.'
                    : 'Selesaikan turret sebelumnya untuk membuka akses.'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-blue-200 mb-2">Gunakan tombol arah atau klik menara di peta.</p>
              <button
                type="button"
                onClick={() => go('sHome')}
                className="gy w-full py-2.5 text-lg font-bold"
              >
                « Kembali ke Beranda
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
