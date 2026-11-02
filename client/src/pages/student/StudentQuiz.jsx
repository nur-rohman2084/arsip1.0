import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Img, Gb } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export function StudentQuiz({ go, onQuizCompleted }) {
  const { user, refreshStudentProfile } = useAuth();
  const { say } = useToast();

  const [questions, setQuestions] = useState([]);
  const [studyCase, setStudyCase] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [answersList, setAnswersList] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [essay, setEssay] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz questions from backend
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await api.getQuiz('0');
        if (res.success) {
          setQuestions(res.questions || []);
          setStudyCase(res.studyCase);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
        say('Gagal memuat soal kuis dari server.', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, []);

  const isEssayStage = questions.length > 0 && currentIdx >= questions.length;
  const timeLimit = isEssayStage ? 300 : 60;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Timer countdown
  useEffect(() => {
    setTimeLeft(timeLimit);
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIdx, isEssayStage]);

  // Auto answer on timeout
  useEffect(() => {
    if (timeLeft === 0 && !isEssayStage && !isLocked) {
      handleAnswer();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `00.${String(mins).padStart(2, '0')}.${String(secs).padStart(2, '0')}`;
  };

  const handleAnswer = async () => {
    if (isEssayStage) {
      if (essay.trim().length < 30) {
        return say('Tulis jawaban minimal 30 karakter untuk menyelesaikan studi kasus.', 'error');
      }

      setSubmitting(true);
      try {
        const payload = {
          answers: answersList,
          essayAnswer: essay.trim()
        };
        const res = await api.submitQuiz('0', payload);
        if (res.success) {
          say('Selamat! Tantangan berhasil diselesaikan.', 'success');
          await refreshStudentProfile();
          if (onQuizCompleted) {
            onQuizCompleted(res.result);
          }
          go('grad');
        }
      } catch (err) {
        console.error('Submit quiz error:', err);
        say(err.message || 'Gagal mengirimkan jawaban kuis.', 'error');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (isLocked) return;
    setIsLocked(true);

    const currentQ = questions[currentIdx];
    const isCorrect = selectedAns === currentQ.a;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }
    setAnswersList((prev) => [...prev, selectedAns]);
  };

  const handleNext = () => {
    if (!isEssayStage && !isLocked) {
      return say('Pilih dan kirim jawabanmu dulu dengan tombol Jawab.', 'error');
    }
    if (isEssayStage) {
      return handleAnswer();
    }

    setCurrentIdx((prev) => prev + 1);
    setSelectedAns(null);
    setIsLocked(false);
  };

  if (loading) {
    return (
      <div>
        <Header cur="lane" go={go} />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="hd text-3xl animate-pulse text-[#ffc82c]">Memuat Soal Kuis Turret...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div>
      <Header cur="lane" go={go} />

      <div className="mx-auto max-w-6xl px-4 pb-8">
        {/* Timer & Question Progress Bar */}
        <div className="flex justify-center gap-4">
          <div className="hd flex items-center gap-2 rounded-2xl bg-white/25 px-5 py-2 text-3xl text-white shadow-lg">
            ⏱ {formatTime(timeLeft)}
          </div>
          <div className="hd flex items-center gap-3 rounded-2xl bg-[#0b0f33]/80 px-5 py-2 text-3xl border border-white/20">
            <span className="h-2.5 w-28 rounded-full bg-white/30 overflow-hidden inline-block">
              <span
                className="block h-full rounded-full bg-[#ffc82c] transition-all duration-300"
                style={{
                  width: `${isEssayStage ? 100 : ((currentIdx + 1) / questions.length) * 100}%`
                }}
              />
            </span>
            <span>{isEssayStage ? 'Studi Kasus' : `${currentIdx + 1}/${questions.length}`}</span>
          </div>
        </div>

        {/* Question Area */}
        {!isEssayStage && currentQ ? (
          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1.7fr]">
            <div className="hidden items-center justify-center rounded-2xl bg-[#0d3a86]/80 p-6 md:flex border border-[#2f6bd6] shadow-xl">
              <Img n="fol" c="h-64 object-contain" a="Folder" />
            </div>

            <div className="rounded-2xl border-2 border-[#2f6bd6] bg-[#0b0f33]/85 p-6 shadow-2xl">
              <h1 className="hd text-2xl leading-snug text-white">{currentQ.q}</h1>

              <div className="mt-5 space-y-3" role="radiogroup">
                {currentQ.o.map((opt, k) => {
                  const isRight = isLocked && k === currentQ.a;
                  const isWrong = isLocked && selectedAns === k && k !== currentQ.a;
                  const isSelected = selectedAns === k;

                  let btnCls = 'bg-[#222a52]/80 hover:bg-[#2c3666] text-white';
                  if (isRight) btnCls = 'bg-emerald-700/80 border-2 border-emerald-400 text-white shadow-lg';
                  else if (isWrong) btnCls = 'bg-red-700/70 border-2 border-red-400 text-white';
                  else if (isSelected) btnCls = 'bg-[#0d3a86] border-2 border-[#ffc82c] text-white';

                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isLocked}
                      onClick={() => setSelectedAns(k)}
                      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all ${btnCls}`}
                    >
                      <span className="hd text-3xl w-8 text-[#ffc82c]">{'ABCD'[k]}</span>
                      <span className="flex-1 font-medium text-sm md:text-base">{opt}</span>
                      {(isSelected || isRight) && <span className="text-2xl font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>

              {isLocked && currentQ.explanation && (
                <div className="mt-4 rounded-xl bg-blue-900/40 border border-blue-400/40 p-3 text-xs text-blue-100">
                  💡 <b>Penjelasan:</b> {currentQ.explanation}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Essay / Study Case Stage */
          <div className="mt-5 rounded-2xl border-2 border-[#2f6bd6] bg-[#0b0f33]/85 p-6 shadow-2xl">
            <div className="rounded-xl bg-[#0d2a8a]/60 border border-white/10 p-4 mb-4">
              <p className="hd text-xl text-[#ffc82c] mb-1">Studi Kasus Kearsipan:</p>
              <p className="text-sm md:text-base leading-relaxed text-blue-50">
                {studyCase?.scenario ||
                  'PT Maju Bersama membiarkan tiap unit kerjanya mengelola surat sendiri–sendiri, sehingga surat penting klien hilang dan tidak diketahui unit mana yang menyimpannya. Di unit SDM, seorang petugas membiarkan berkas gaji terbuka di meja dan menceritakan isinya ke rekan unit lain. Di gudang, arsip lama bercampur tanpa pemilahan, termasuk foto dan naskah pidato pendiri tahun 1995.'}
              </p>
            </div>

            <p className="hd text-lg text-white">
              Pertanyaan: {studyCase?.question || 'Identifikasi asas pengelolaan surat yang diterapkan dan rekomendasikan asas yang lebih tepat.'}
            </p>

            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Tuliskan analisis dan rekomendasi jawabanmu disini (minimal 30 karakter)....."
              aria-label="Jawaban esai"
              className="mt-3 h-48 w-full rounded-xl bg-[#0d3a86]/60 border border-white/20 p-4 text-white italic placeholder-blue-300/60 focus:outline-none focus:border-[#ffc82c]"
            />

            <div className="flex justify-between items-center text-xs mt-1 text-blue-200">
              <span>Minimal 30 karakter</span>
              <span className={essay.trim().length >= 30 ? 'text-emerald-400 font-bold' : 'text-yellow-300'}>
                {essay.trim().length} karakter ditulis
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          {!isEssayStage && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isLocked}
              className="gy px-8 py-2.5 text-2xl font-bold disabled:opacity-40"
            >
              Lanjut →
            </button>
          )}

          <Gb
            onClick={handleAnswer}
            disabled={
              submitting ||
              (!isEssayStage && (selectedAns === null || isLocked)) ||
              (isEssayStage && essay.trim().length < 30)
            }
            cls="!px-8 text-2xl shadow-lg"
          >
            {submitting ? 'Mengirim...' : isEssayStage ? 'Kirim Jawaban & Selesai >>' : 'Jawab >>'}
          </Gb>
        </div>

        {/* Direct transition banner to study case */}
        {!isEssayStage && isLocked && currentIdx === questions.length - 1 && (
          <div className="mt-4 flex justify-end">
            <Gb onClick={() => setCurrentIdx(questions.length)} cls="text-lg">
              Ke Studi Kasus ({correctCount}/{questions.length} benar) &gt;&gt;
            </Gb>
          </div>
        )}
      </div>
    </div>
  );
}
