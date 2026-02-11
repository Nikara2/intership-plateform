'use client';

import { Icon } from '@iconify/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const icons = {
    danger: { icon: 'lucide:alert-triangle', color: 'text-red-600', bg: 'bg-red-100' },
    warning: { icon: 'lucide:alert-circle', color: 'text-amber-600', bg: 'bg-amber-100' },
    info: { icon: 'lucide:info', color: 'text-blue-600', bg: 'bg-blue-100' },
  };

  const buttons = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  const currentIcon = icons[type];
  const currentButton = buttons[type];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 ${currentIcon.bg} rounded-full flex items-center justify-center`}>
            <Icon icon={currentIcon.icon} className={`text-4xl ${currentIcon.color}`} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">{title}</h2>

        <div
          className="text-slate-600 text-center mb-6"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 ${currentButton} text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
