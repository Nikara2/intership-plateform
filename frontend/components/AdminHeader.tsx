'use client';

import { Icon } from '@iconify/react';
import { auth } from '@/lib/api';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
  children?: React.ReactNode;
}

export default function AdminHeader({ title, onMenuClick, children }: AdminHeaderProps) {
  return (
    <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Icon icon="lucide:menu" className="text-2xl text-slate-600" />
        </button>
        <h1 className="text-lg lg:text-2xl font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-6">
        {children}

        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
          <Icon icon="lucide:bell" className="text-xl lg:text-2xl" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="hidden md:flex items-center space-x-3 border-l border-slate-200 pl-3 lg:pl-6 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{auth.getEmail()}</p>
            <p className="text-xs text-slate-500">Administrateur Principal</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.getEmail()}`}
              alt="Avatar"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
