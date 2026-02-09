'use client';

import { Icon } from '@iconify/react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'lucide:check-circle-2';
      case 'error':
        return 'lucide:alert-circle';
      case 'info':
        return 'lucide:info';
      default:
        return 'lucide:check-circle-2';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-green-50 text-green-800 border-green-200';
    }
  };

  return (
    <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right duration-300">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 shadow-2xl ${getColors()} min-w-[320px] max-w-md`}
      >
        <Icon icon={getIcon()} className="text-2xl flex-shrink-0" />
        <p className="font-semibold flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors"
        >
          <Icon icon="lucide:x" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
