'use client';

import { Icon } from '@iconify/react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: { icon: 'lucide:check-circle', bg: 'bg-green-500' },
    error: { icon: 'lucide:alert-circle', bg: 'bg-red-500' },
    warning: { icon: 'lucide:alert-triangle', bg: 'bg-amber-500' },
    info: { icon: 'lucide:info', bg: 'bg-blue-500' },
  };

  const currentIcon = icons[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${currentIcon.bg} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}>
        <Icon icon={currentIcon.icon} className="text-2xl flex-shrink-0" />
        <p className="font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <Icon icon="lucide:x" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
