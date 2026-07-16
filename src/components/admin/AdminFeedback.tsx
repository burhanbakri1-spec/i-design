'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Toast = {
  id: number;
  message: string;
  tone: 'success' | 'error' | 'info';
};

interface FeedbackContextValue {
  notify: (message: string, tone?: Toast['tone']) => void;
  confirm: (message: string) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function AdminFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmation, setConfirmation] = useState<{
    message: string;
    resolve: (value: boolean) => void;
  } | null>(null);

  const notify = useCallback((message: string, tone: Toast['tone'] = 'info') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, tone }]);
    setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmation({ message, resolve });
    });
  }, []);

  const value = useMemo(() => ({ notify, confirm }), [confirm, notify]);

  const closeConfirm = (result: boolean) => {
    confirmation?.resolve(result);
    setConfirmation(null);
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] grid gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-[min(360px,calc(100vw-2rem))] border px-4 py-3 text-sm shadow-sm ${
              toast.tone === 'success'
                ? 'border-green-700 bg-green-50 text-green-900'
                : toast.tone === 'error'
                  ? 'border-red-700 bg-red-50 text-red-900'
                  : 'border-black/20 bg-white text-black'
            }`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
      {confirmation && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/25 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white p-6 shadow-xl">
            <p className="text-base">{confirmation.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="border border-black/20 px-4 py-2 text-sm" onClick={() => closeConfirm(false)}>
                Cancel
              </button>
              <button className="bg-black px-4 py-2 text-sm text-white" onClick={() => closeConfirm(true)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function useAdminFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error('useAdminFeedback must be used inside AdminFeedbackProvider');
  return value;
}
