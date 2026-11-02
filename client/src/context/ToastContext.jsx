import React, { createContext, useContext, useState, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('info'); // info, success, error
  const timerRef = useRef(null);

  const say = (message, type = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(message);
    setToastType(type);
    timerRef.current = setTimeout(() => {
      setToast('');
    }, 2800);
  };

  return (
    <ToastContext.Provider value={{ say }}>
      {children}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className={`hd flex items-center gap-2 rounded-2xl px-6 py-3 text-lg shadow-2xl border-2 ${
            toastType === 'error'
              ? 'bg-red-900/90 border-red-500 text-red-100'
              : toastType === 'success'
              ? 'bg-emerald-900/90 border-emerald-400 text-emerald-100'
              : 'bg-[#14275c]/95 border-[#ffc82c] text-white'
          }`}>
            <span className="text-xl">
              {toastType === 'error' ? '⚠️' : toastType === 'success' ? '✅' : '🔔'}
            </span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
