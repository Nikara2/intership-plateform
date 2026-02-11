'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth } from '@/lib/api';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/admin/dashboard', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
    { href: '/admin/students', icon: 'lucide:users', label: 'Étudiants' },
    { href: '/admin/companies', icon: 'lucide:building-2', label: 'Entreprises' },
    { href: '/admin/internships', icon: 'lucide:briefcase', label: 'Stages en Cours' },
    { href: '/admin/stats', icon: 'lucide:pie-chart', label: 'Statistiques' },
    { href: '/admin/accounts', icon: 'lucide:user-cog', label: 'Comptes' },
    { href: '/admin/settings', icon: 'lucide:settings', label: 'Paramètres' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#0F172A] text-slate-400 flex flex-col h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:graduation-cap" className="text-white text-2xl" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">EduStage</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Icon icon="lucide:x" className="text-white text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive(item.href)
                  ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon icon={item.icon} className="mr-3 text-xl" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={() => {
              auth.logout();
              router.push('/login');
            }}
            className="flex items-center px-4 py-2 text-slate-400 hover:text-red-400 transition-colors w-full"
          >
            <Icon icon="lucide:log-out" className="mr-3 text-xl" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
