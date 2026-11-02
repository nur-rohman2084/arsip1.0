import React, { useState } from 'react';
import { Logo, Gb, Img } from '../components/common/UIComponents';

export function Landing({ go }) {
  const [sec, setSec] = useState('home');

  const ft = [
    ['cap', 'Belajar\nInteraktif'],
    ['tro', 'Raih Poin\ndan Prestasi'],
    ['cht', 'Pantau\nProgresmu']
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10">
      <nav className="flex items-center gap-2 py-4">
        <div className="mr-auto">
          <Logo />
        </div>
        {[
          ['home', 'Beranda'],
          ['about', 'Tentang'],
          ['faq', 'FAQ']
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setSec(k)}
            className={`hidden px-3 py-2 text-lg sm:block transition ${sec === k ? 'text-[#ffc82c] font-bold' : 'text-blue-100 hover:text-white'}`}
          >
            {l}
          </button>
        ))}
        <Gb onClick={() => go('login')} cls="!px-6 !py-1.5 text-lg">
          Login
        </Gb>
      </nav>

      {sec === 'home' && (
        <>
          <section className="relative grid items-center gap-6 pt-10 md:grid-cols-[1.4fr_1fr] md:pt-16">
            <div>
              <h1 className="hd text-5xl leading-tight md:text-7xl">
                Learn More,<br />
                <span className="text-[#ffc82c]">Build Your Future</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-blue-50/90 leading-relaxed">
                Media pembelajaran gamifikasi untuk siswa SMK Manajemen Perkantoran dan Layanan Bisnis (MPLB).
              </p>
              <Gb onClick={() => go('login')} cls="mt-8 !px-10 !py-4 text-3xl">
                Mulai &nbsp;&gt;&gt;
              </Gb>
            </div>
            <Img n="av0" c="mx-auto hidden h-[420px] md:block object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" a="Avatar" />
          </section>

          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4 rounded-2xl bg-black/30 border border-white/10 px-6 py-4 md:w-fit backdrop-blur-sm">
            {ft.map(([k, t]) => (
              <div key={k} className="flex items-center gap-3">
                <Img n={k} c="h-14 w-14 object-contain" a={t} />
                <span className="hd whitespace-pre-line leading-tight text-white">{t}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {sec === 'about' && (
        <section className="pn mx-auto mt-10 max-w-3xl p-8">
          <h2 className="hd text-4xl text-[#ffc82c]">Tentang Archive Academy</h2>
          <p className="mt-4 leading-relaxed text-blue-100/90 text-lg">
            Archive Academy adalah media pembelajaran kearsipan berbasis gamifikasi untuk siswa SMK MPLB. Siswa menjelajahi peta turret, membaca materi berstandar kurikulum, mengerjakan kuis berwaktu, lalu memecahkan studi kasus kearsipan nyata. Guru dapat mengelola turret, memantau nilai siswa secara real-time, mengimpor data via CSV, dan mengunduh laporan nilai lengkap.
          </p>
        </section>
      )}

      {sec === 'faq' && (
        <section className="mx-auto mt-10 max-w-3xl space-y-3">
          {[
            ['Bagaimana cara masuk sebagai siswa?', 'Isi nama dan kode kelas dari guru, misalnya ARSIP-7A26 atau 071089.'],
            ['Apa itu turret?', 'Turret adalah satu unit materi kearsipan lengkap dengan kuis berwaktu dan studi kasus esai.'],
            ['Apa yang saya dapat setelah lulus turret?', 'Perolehan EXP, kenaikan level, badge baru, peringkat kelas di leaderboard, serta sertifikat resmi.'],
            ['Apakah data tersimpan secara permanen?', 'Ya, seluruh progres, riwayat nilai kuis, dan kustomisasi avatar tersimpan aman di database server.'],
            ['Bagaimana guru mengelola siswa?', 'Guru dapat masuk ke dashboard untuk melihat statistik nilai, mengunduh laporan CSV/Excel, dan mengimpor data siswa baru.']
          ].map(([q, a]) => (
            <details key={q} className="pn p-5 group cursor-pointer transition">
              <summary className="font-semibold text-lg text-white group-hover:text-[#ffc82c] list-none flex justify-between items-center">
                <span>{q}</span>
                <span className="text-[#ffc82c] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-blue-100/80 leading-relaxed">{a}</p>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}
