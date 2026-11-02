import React, { useState } from 'react';
import { Logo, Gb, Img } from '../components/common/UIComponents';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Login({ go }) {
  const [tab, setTab] = useState('siswa');
  const [f, setF] = useState({ a: '', b: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { say } = useToast();

  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    setErr('');
  };

  const sub = async (e) => {
    if (e) e.preventDefault();
    setErr('');

    if (tab === 'siswa') {
      if (!f.a.trim() || !f.b.trim()) {
        return setErr('Nama siswa dan kode kelas wajib diisi.');
      }
      setLoading(true);
      try {
        await login({
          role: 'siswa',
          studentName: f.a.trim(),
          classCode: f.b.trim()
        });
        say(`Selamat datang, ${f.a.trim()}!`, 'success');
        go('avatar');
      } catch (error) {
        setErr(error.message || 'Login gagal.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!f.a.trim() || !f.b) {
        return setErr('Username dan password wajib diisi.');
      }
      setLoading(true);
      try {
        await login({
          role: 'guru',
          username: f.a.trim(),
          password: f.b
        });
        say('Selamat datang, Bu Rina!', 'success');
        go('tHome');
      } catch (error) {
        setErr(error.message || 'Username atau kata sandi guru tidak sesuai.');
      } finally {
        setLoading(false);
      }
    }
  };

  const fill = () => {
    setErr('');
    setF(
      tab === 'siswa'
        ? { a: 'Roselia Paras Wangi', b: '071089' }
        : { a: 'rina.guru', b: '123456' }
    );
  };

  const inp = 'mt-1 w-full rounded-2xl border-2 border-[#262d6b] bg-white px-4 py-3.5 text-[#14183a] focus:outline-none focus:border-[#ffc82c] font-medium transition';

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-4">
      <button onClick={() => go('landing')} className="w-fit" aria-label="Kembali ke Beranda">
        <Logo s />
      </button>

      <div className="my-auto py-6 text-center">
        <h1 className="hd ol text-5xl leading-tight md:text-6xl">
          Masuk ke<br />Archive Academy
        </h1>
        <p className="mt-3 text-xl font-semibold text-blue-100">Pilih peran anda untuk melanjutkan</p>

        {/* Role Toggle Switcher */}
        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 overflow-hidden rounded-full bg-[#d9d9d9] text-[#2a1d00] p-1 shadow-inner">
          {[
            ['siswa', 'Siswa', 'sis'],
            ['guru', 'Guru', 'gur']
          ].map(([k, l, im]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setTab(k);
                setF({ a: '', b: '' });
                setErr('');
              }}
              className={`hd flex items-center justify-center gap-2 rounded-full py-2.5 text-2xl transition ${
                tab === k ? 'bg-[#ffc82c] shadow-md font-bold' : 'hover:bg-black/5 opacity-80'
              }`}
            >
              <Img n={im} c="h-9 w-9 object-contain" a={l} />
              {l}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={sub} className="mx-auto mt-6 max-w-md rounded-2xl bg-white p-4 text-left text-[#14183a] shadow-xl">
          <label className="ml-1 text-xs font-bold text-gray-700">
            {tab === 'siswa' ? 'Nama Siswa' : 'Username'}
          </label>
          <input
            className={inp}
            value={f.a}
            onChange={set('a')}
            placeholder={tab === 'siswa' ? 'Masukkan nama lengkap' : 'rina.guru'}
            disabled={loading}
          />

          <label className="ml-1 mt-3 block text-xs font-bold text-gray-700">
            {tab === 'siswa' ? 'Kode Kelas atau NIS' : 'Password'}
          </label>
          <input
            type={tab === 'siswa' ? 'text' : 'password'}
            className={inp}
            value={f.b}
            onChange={set('b')}
            placeholder={tab === 'siswa' ? 'Contoh: ARSIP-7A26 atau 071089' : '••••••'}
            disabled={loading}
          />

          {err && (
            <div role="alert" className="mt-3 rounded-lg bg-red-100 border border-red-400 p-2 text-xs font-semibold text-red-700">
              ⚠️ {err}
            </div>
          )}

          <Gb
            type="submit"
            disabled={loading}
            cls="mt-5 w-full !rounded-xl !py-3 text-2xl shadow-lg"
          >
            {loading ? 'Memproses...' : 'Masuk >>'}
          </Gb>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={fill}
            className="text-sm font-semibold text-[#ffc82c] hover:underline"
          >
            💡 Isi dengan data contoh ({tab === 'siswa' ? 'Roselia' : 'Bu Rina'})
          </button>
        </div>
      </div>
    </div>
  );
}
