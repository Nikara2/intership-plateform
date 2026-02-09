'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated() || auth.getRole() !== 'SCHOOL_ADMIN') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Dashboard Admin École
        </h1>
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <p className="text-slate-600">
            Bienvenue sur votre dashboard administrateur !
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Email: {auth.getEmail()}
          </p>
          <button
            onClick={() => {
              auth.logout();
              router.push('/login');
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
