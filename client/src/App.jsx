import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import IMAGES from './assets/images.json';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { AvatarStudio } from './pages/AvatarStudio';

// Student Pages
import { StudentHome } from './pages/student/StudentHome';
import { StudentMap } from './pages/student/StudentMap';
import { StudentLane } from './pages/student/StudentLane';
import { StudentLearn } from './pages/student/StudentLearn';
import { StudentQuiz } from './pages/student/StudentQuiz';
import { StudentGraduation } from './pages/student/StudentGraduation';
import { StudentAchievements } from './pages/student/StudentAchievements';

// Teacher Pages
import { TeacherHome } from './pages/teacher/TeacherHome';
import { TeacherTurrets } from './pages/teacher/TeacherTurrets';
import { TeacherStudents } from './pages/teacher/TeacherStudents';
import { TeacherReports } from './pages/teacher/TeacherReports';
import { TeacherSettings } from './pages/teacher/TeacherSettings';

function AppContent() {
  const { user, role, loading } = useAuth();
  const [pg, setPg] = useState(() => {
    const savedToken = localStorage.getItem('aa_token');
    return savedToken ? 'sHome' : 'landing';
  });
  const [quizResult, setQuizResult] = useState(null);

  const go = (p) => {
    setPg(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Redirect based on role if logged in
  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === 'guru' && ['landing', 'login', 'sHome', 'sPeta', 'lane', 'avatar'].includes(pg)) {
        setPg('tHome');
      } else if (user.role === 'siswa' && ['landing', 'login', 'tHome', 'tTurret', 'tSiswa', 'tLap', 'tSet'].includes(pg)) {
        setPg('sHome');
      }
    } else if (!loading && !user && !['landing', 'login'].includes(pg)) {
      setPg('landing');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07122f]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#ffc82c] border-t-transparent mb-4" />
          <p className="hd text-2xl text-white">Memuat Archive Academy...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (pg) {
      case 'landing':
        return <Landing go={go} />;
      case 'login':
        return <Login go={go} />;
      case 'avatar':
        return <AvatarStudio go={go} />;

      // Student Pages
      case 'sHome':
        return <StudentHome go={go} />;
      case 'sPeta':
        return <StudentMap go={go} />;
      case 'lane':
        return <StudentLane go={go} />;
      case 'learn':
        return <StudentLearn go={go} />;
      case 'quiz':
        return <StudentQuiz go={go} onQuizCompleted={(res) => setQuizResult(res)} />;
      case 'grad':
        return <StudentGraduation go={go} quizResult={quizResult} />;
      case 'sAch':
        return <StudentAchievements go={go} />;

      // Teacher Pages
      case 'tHome':
        return <TeacherHome go={go} />;
      case 'tTurret':
        return <TeacherTurrets go={go} />;
      case 'tSiswa':
        return <TeacherStudents go={go} />;
      case 'tLap':
        return <TeacherReports go={go} />;
      case 'tSet':
        return <TeacherSettings go={go} />;

      default:
        return <Landing go={go} />;
    }
  };

  const bgStyle = IMAGES.bg
    ? {
        backgroundImage: `linear-gradient(rgba(7, 18, 47, 0.75), rgba(7, 18, 47, 0.85)), url(${IMAGES.bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }
    : {
        background: '#07122f'
      };

  return (
    <div className="min-h-screen" style={bgStyle}>
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
