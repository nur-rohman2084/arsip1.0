import React, { useState } from 'react';
import { TeacherLayout } from '../../components/layout/Sidebar';
import { Img, I, Stat, Bar, Gb, Chip } from '../../components/common/UIComponents';
import { useToast } from '../../context/ToastContext';
import { TUR } from '../../assets/constants';

export function TeacherReports({ go }) {
  const { say } = useToast();

  const [f, setF] = useState({
    p: 'Oktober 2025',
    k: 'Kelas XI MPLB 1',
    j: 'Nilai Siswa',
    t: 'Semua Turret'
  });

  const O = {
    p: ['Oktober 2025', 'September 2025'],
    k: ['Kelas XI MPLB 1', 'Kelas XI MPLB 2', 'Kelas XI MPLB 3'],
    j: ['Nilai Siswa', 'Progres Kelas', 'Aktivitas Turret'],
    t: ['Semua Turret', ...TUR.map((x) => x[0])]
  };

  const L = [
    ['Laporan Nilai Siswa', 'CSV / XLSX • 24 KB', 'Nilai_Siswa'],
    ['Laporan Progres Kelas', 'CSV / XLSX • 18 KB', 'Progres_Kelas'],
    ['Laporan Aktivitas Turret', 'CSV / XLSX • 32 KB', 'Aktivitas_Turret'],
    ['Rekap Hasil Belajar', 'CSV / PDF • 146 KB', 'Rekap_Hasil_Belajar']
  ];

  const handleDownloadReport = (typeKey) => {
    const token = localStorage.getItem('aa_token') || '';
    const url = `/api/teacher/reports/export?type=${typeKey}&period=${encodeURIComponent(f.p)}&class=${encodeURIComponent(f.k)}`;

    // Create a temporary link to download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_${typeKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    say(`Mengunduh ${typeKey.replace(/_/g, ' ')}...`, 'success');
  };

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

  return (
    <TeacherLayout cur="tLap" go={go}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Img n="tav" c="h-14 w-14 rounded-2xl border-2 border-[#4a6fc8] object-cover" a="Guru" />
        <div className="mr-auto">
          <p className="text-[10px] font-bold text-[#ffc82c] tracking-wider uppercase">DASHBOARD GURU</p>
          <h1 className="hd text-3xl text-white">Laporan & Rekapitulasi Nilai</h1>
          <p className="text-xs text-blue-200">Pantau perkembangan performa kelas dan unduh laporan berkas digital.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mb-4 flex flex-wrap items-end gap-3 pn p-4">
        {[
          ['p', 'Periode'],
          ['k', 'Kelas'],
          ['j', 'Jenis Laporan'],
          ['t', 'Turret']
        ].map(([k, l]) => (
          <label key={k} className="min-w-[140px] flex-1 text-[11px] font-bold text-blue-200">
            {l}
            <select
              value={f[k]}
              onChange={(e) => setF({ ...f, [k]: e.target.value })}
              className="pd mt-1 w-full bg-[#0b183f] px-3 py-2 text-sm text-white border border-white/10 focus:outline-none"
            >
              {O[k].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
        <Gb
          onClick={() => handleDownloadReport(f.j.replace(/\s+/g, '_'))}
          cls="!rounded-xl !py-2.5 text-sm !font-sans font-bold shadow-lg"
        >
          Buat & Unduh Laporan
        </Gb>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat ic={<I n="users" c="w-6 h-6 text-[#ffc82c]" />} l="Siswa Dievaluasi" v="32" d="+2" />
        <Stat ic={<I n="trophy" c="w-6 h-6 text-[#ffc82c]" />} l="Tuntas Modul" v="28" d="+3" />
        <Stat ic={<I n="chart" c="w-6 h-6 text-[#ffc82c]" />} l="Rata-rata Nilai" v="87.5" d="+1.2" />
        <Stat ic={<I n="ok" c="w-6 h-6 text-[#ffc82c]" />} l="Kelulusan KKM" v="91%" />
      </div>

      {/* Main Grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          {/* Growth Chart */}
          <div className="pn p-5">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <h2 className="hd text-2xl text-white">Grafik Perkembangan Nilai</h2>
              <Chip t="● 7 Hari Terakhir" />
            </div>
            <div className="flex gap-4 text-[11px] text-blue-200 mb-2">
              <span><span className="text-[#6ea0ff] text-base">●</span> Rata-rata Nilai</span>
              <span><span className="text-[#ffc82c] text-base">●</span> Tingkat Penyelesaian</span>
            </div>
            <Line
              a={[68, 72, 79, 83, 84, 86, 87.5]}
              b={[72, 78, 81, 85, 85, 87, 87]}
              lab={['21 Okt', '22 Okt', '23 Okt', '24 Okt', '25 Okt', '26 Okt', '27 Okt']}
            />
            <p className="text-xs text-emerald-300 font-semibold mt-2">
              ↗ Nilai rata-rata siswa naik 1.2 poin dibanding periode evaluasi sebelumnya.
            </p>
          </div>

          {/* Class Summary */}
          <div className="pn p-5">
            <h2 className="hd text-2xl text-white mb-3">Ringkasan Kelas</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['isl1', 'Kelas XI MPLB 1', '32 siswa', 87],
                ['isl2', 'Kelas XI MPLB 2', '30 siswa', 75],
                ['isl3', 'Kelas XI MPLB 3', '28 siswa', 60]
              ].map(([im, n, s, v]) => (
                <div key={n} className="pd p-3 flex items-center gap-2.5 border border-white/10">
                  <Img n={im} c="h-11 w-11 rounded-lg shrink-0 object-cover" a={n} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{n}</p>
                    <p className="text-[10px] text-blue-200">{s} • {v}%</p>
                    <Bar v={v} h="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Reports & Next Steps */}
        <div className="space-y-4">
          <div className="pn p-5">
            <h2 className="hd text-2xl text-white">Unduh Laporan Format CSV/Excel</h2>
            <p className="mb-3 text-xs text-blue-200 leading-relaxed">
              Berkas laporan siap dibuka di Microsoft Excel, Google Spreadsheet, atau dicetak PDF.
            </p>
            <div className="space-y-2">
              {L.map(([t, s, typeKey]) => (
                <div key={t} className="flex items-center gap-3 border-t border-white/10 py-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1b3274]">
                    <I n="file" c="w-5 h-5 text-emerald-400" />
                  </span>
                  <div className="mr-auto min-w-0">
                    <p className="text-sm font-bold text-white truncate">{t}</p>
                    <p className="text-[10px] text-blue-300">{s}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(typeKey)}
                    aria-label={'Unduh ' + t}
                    className="p-2 rounded-lg bg-[#0b183f] text-[#ffc82c] hover:bg-[#ffc82c] hover:text-[#07122f] transition"
                  >
                    <I n="dl" c="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pn p-5 border border-[#ffc82c]/40 bg-[#14275c]/60">
            <h2 className="hd text-2xl text-[#ffc82c]">✨ Langkah Berikutnya</h2>
            <p className="mt-2 text-xs text-blue-100 leading-relaxed">
              4 siswa belum mencapai batas KKM (75). Berikan pendampingan kearsipan khusus agar seluruh kelas siap melaju ke Turret 2.
            </p>
            <button
              onClick={() => go('tSiswa')}
              className="mt-3 text-xs font-bold text-[#ffc82c] hover:underline block"
            >
              Lihat siswa yang perlu dibantu →
            </button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
