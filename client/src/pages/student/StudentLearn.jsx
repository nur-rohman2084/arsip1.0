import React from 'react';
import { Header } from '../../components/layout/Header';
import { Img, Gb } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';

export function StudentLearn({ go }) {
  const { user } = useAuth();
  const name = user?.full_name || 'Roselia Paras Wangi';

  const bullets = [
    'Arsip: rekaman kegiatan atau peristiwa dalam berbagai bentuk dan media sesuai dengan perkembangan teknologi informasi dan komunikasi yang dibuat dan diterima oleh lembaga negara, pemerintah daerah, lembaga pendidikan, perusahaan, organisasi politik, organisasi kemasyarakatan, maupun perseorangan (UU No. 43/2009).',
    'Warkat: setiap lembaran naskah yang berisi informasi tertulis, tercetak, atau bergambar yang masih berguna sebagai bahan pertimbangan dan alat ingatan organisasi.',
    'Dokumen: warkat yang tidak aktif digunakan dalam kegiatan sehari-hari, tetapi tetap disimpan sebagai alat bukti hukum dan pertanggungjawaban.',
    'Pustaka: kumpulan warkat atau dokumen yang telah dikumpulkan, disusun, dan diolah secara sistematis untuk keperluan studi, penelitian, atau referensi.',
    'Arsip Dinamis: arsip yang dipergunakan secara langsung dalam perencanaan, pelaksanaan, penyelenggaraan kehidupan kebangsaan pada umumnya atau dipergunakan secara langsung dalam penyelenggaraan administrasi negara (terdiri dari arsip aktif, inaktif, dan vital).',
    'Arsip Statis: arsip yang dihasilkan oleh pencipta arsip karena memiliki nilai guna kesejarahan, telah habis retensinya, dan berketerangan dipermanenkan yang telah diverifikasi oleh Arsip Nasional Republik Indonesia (ANRI).'
  ];

  return (
    <div>
      <Header cur="lane" go={go} />

      <div className="mx-auto max-w-6xl px-4 pb-8">
        <button
          onClick={() => go('lane')}
          className="mb-4 flex items-center gap-2 rounded-xl border-2 border-white px-5 py-1.5 text-xl hd hover:bg-white/10 transition"
        >
          « Kembali ke Peta Lane
        </button>

        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.25fr]">
          {/* Illustration Container */}
          <div className="flex h-72 items-center justify-center rounded-2xl bg-[#0d3a86]/80 p-6 md:h-[520px] border border-[#2f6bd6] shadow-xl">
            <Img n="fol" c="h-56 md:h-80 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" a="Materi Kearsipan" />
          </div>

          {/* Material Text Content */}
          <div className="pn p-6 md:p-8">
            <span className="gb inline-block px-6 py-1 text-3xl">Turret 1</span>
            <h1 className="hd mt-3 text-4xl md:text-5xl text-white">Hakikat Kearsipan</h1>
            <p className="text-sm text-[#ffc82c] font-semibold mt-1">
              Kurikulum SMK Manajemen Perkantoran dan Layanan Bisnis (MPLB)
            </p>

            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-blue-50">
              {bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end">
              <Gb onClick={() => go('quiz')} cls="!px-8 !py-3 text-2xl shadow-xl">
                Mulai Tantangan &gt;&gt;
              </Gb>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
