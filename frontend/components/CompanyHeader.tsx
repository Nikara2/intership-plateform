'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { auth } from '@/lib/api';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CompanyHeader() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    setUserEmail(auth.getEmail() || '');
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/company/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center text-white">
            <Icon icon="lucide:graduation-cap" className="text-2xl" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Stage<span className="text-[#F59E0B]">Connect</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/company/dashboard"
            className={`font-medium transition-colors ${
              isActive('/company/dashboard')
                ? 'text-slate-900 font-semibold border-b-2 border-[#1E40AF] py-1'
                : 'text-slate-500 hover:text-[#1E40AF]'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/company/offers"
            className={`font-medium transition-colors ${
              isActive('/company/offers')
                ? 'text-slate-900 font-semibold border-b-2 border-[#1E40AF] py-1'
                : 'text-slate-500 hover:text-[#1E40AF]'
            }`}
          >
            Mes Offres
          </Link>
          <Link
            href="/company/applications"
            className={`font-medium transition-colors ${
              isActive('/company/applications')
                ? 'text-slate-900 font-semibold border-b-2 border-[#1E40AF] py-1'
                : 'text-slate-500 hover:text-[#1E40AF]'
            }`}
          >
            Candidatures
          </Link>
          <Link
            href="/company/evaluations"
            className={`font-medium transition-colors ${
              isActive('/company/evaluations')
                ? 'text-slate-900 font-semibold border-b-2 border-[#1E40AF] py-1'
                : 'text-slate-500 hover:text-[#1E40AF]'
            }`}
          >
            Évaluations
          </Link>
          <Link
            href="/company/profile"
            className={`font-medium transition-colors ${
              isActive('/company/profile')
                ? 'text-slate-900 font-semibold border-b-2 border-[#1E40AF] py-1'
                : 'text-slate-500 hover:text-[#1E40AF]'
            }`}
          >
            Mon Profil
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <Icon icon="lucide:bell" className="text-2xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{userEmail}</p>
              <p className="text-xs text-slate-500">Recruteur</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-100 hover:border-[#1E40AF] transition-all">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}&backgroundColor=1e40af`}
                alt="User avatar"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
