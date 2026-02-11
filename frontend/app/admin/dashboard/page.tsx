'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth, adminAPI } from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
  totalStudents: number;
  totalCompanies: number;
  activeOffers: number;
  ongoingInternships: number;
  studentsGrowth: number;
  companiesGrowth: number;
}

interface ChartData {
  month: string;
  count: number;
}

interface SectorData {
  sectors: Array<{ name: string; count: number; percentage: number }>;
  total: number;
}

interface Activity {
  date: string;
  type: string;
  description: string;
  user: string;
  status?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [sectorData, setSectorData] = useState<SectorData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    console.log('🔍 Admin Dashboard - Checking auth...');
    console.log('🔍 Is authenticated:', auth.isAuthenticated());

    if (!auth.isAuthenticated()) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    const role = auth.getRole();
    console.log('🔍 User role:', role);

    if (role === 'COMPANY') {
      console.log('❌ COMPANY user trying to access admin, redirecting to /company/dashboard');
      router.push('/company/dashboard');
      return;
    }

    if (role !== 'SCHOOL_ADMIN') {
      console.log('❌ Invalid role for admin dashboard, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('✅ SCHOOL_ADMIN access granted, fetching data...');
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');

      const [statsData, applicationsData, sectorsData, activitiesData] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getApplicationsByMonth(6),
        adminAPI.getInternshipsBySector(),
        adminAPI.getRecentActivities(5),
      ]);

      console.log('✅ Stats data received:', statsData);
      console.log('✅ Applications data received:', applicationsData);
      console.log('✅ Sectors data received:', sectorsData);
      console.log('✅ Activities data received:', activitiesData);

      setStats(statsData);
      setChartData(applicationsData);
      setSectorData(sectorsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="lucide:loader-2" className="text-5xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-slate-400 flex flex-col h-screen fixed inset-y-0 left-0 z-50">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:graduation-cap" className="text-white text-2xl" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">EduStage</span>
        </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/admin/dashboard"
            className={`flex items-center px-4 py-3 transition-all ${
              pathname === '/admin/dashboard'
                ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                : 'hover:text-white hover:bg-white/5 rounded-lg'
            }`}
          >
            <Icon icon="lucide:layout-dashboard" className="mr-3 text-xl" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/students"
            className={`flex items-center px-4 py-3 transition-all ${
              pathname?.startsWith('/admin/students')
                ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                : 'hover:text-white hover:bg-white/5 rounded-lg'
            }`}
          >
            <Icon icon="lucide:users" className="mr-3 text-xl" />
            <span>Étudiants</span>
          </Link>

          <Link
            href="/admin/companies"
            className={`flex items-center px-4 py-3 transition-all ${
              pathname?.startsWith('/admin/companies')
                ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                : 'hover:text-white hover:bg-white/5 rounded-lg'
            }`}
          >
            <Icon icon="lucide:building-2" className="mr-3 text-xl" />
            <span>Entreprises</span>
          </Link>

          <Link
            href="/admin/internships"
            className={`flex items-center px-4 py-3 transition-all ${
              pathname === '/admin/internships'
                ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                : 'hover:text-white hover:bg-white/5 rounded-lg'
            }`}
          >
            <Icon icon="lucide:briefcase" className="mr-3 text-xl" />
            <span>Stages en Cours</span>
          </Link>

          <Link
            href="/admin/stats"
            className={`flex items-center px-4 py-3 transition-all ${
              pathname === '/admin/stats'
                ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                : 'hover:text-white hover:bg-white/5 rounded-lg'
            }`}
          >
            <Icon icon="lucide:pie-chart" className="mr-3 text-xl" />
            <span>Statistiques</span>
          </Link>

          <Link
            href="/admin/accounts"
            className={`flex items-center px-4 py-3 transition-all ${
              pathname === '/admin/accounts'
                ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                : 'hover:text-white hover:bg-white/5 rounded-lg'
            }`}
          >
            <Icon icon="lucide:user-cog" className="mr-3 text-xl" />
            <span>Comptes</span>
          </Link>

          <Link
            href="/admin/settings"
            className={`flex items-center px-4 py-3 transition-all ${
              pathname === '/admin/settings'
                ? 'text-white bg-blue-700/20 border-l-4 border-blue-700 rounded-r-lg'
                : 'hover:text-white hover:bg-white/5 rounded-lg'
            }`}
          >
            <Icon icon="lucide:settings" className="mr-3 text-xl" />
            <span>Paramètres</span>
          </Link>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Rechercher un dossier, étudiant, entreprise..."
                className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Icon icon="lucide:bell" className="text-2xl" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 cursor-pointer group">
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

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome Section */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-slate-900">Bienvenue, {auth.getEmail()?.split('@')[0]}</h2>
            <p className="text-slate-500">Voici un aperçu global de l'activité de l'école pour aujourd'hui.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                  <Icon icon="lucide:users-2" className="text-2xl" />
                </div>
                {stats && stats.studentsGrowth > 0 && (
                  <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    +{stats.studentsGrowth}% <Icon icon="lucide:arrow-up-right" className="ml-1" />
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium">Total Étudiants</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.totalStudents || 0}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
                  <Icon icon="lucide:building" className="text-2xl" />
                </div>
                {stats && stats.companiesGrowth > 0 && (
                  <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    +{stats.companiesGrowth}% <Icon icon="lucide:arrow-up-right" className="ml-1" />
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium">Entreprises</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.totalCompanies || 0}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                  <Icon icon="lucide:file-plus" className="text-2xl" />
                </div>
                {stats && stats.activeOffers > 50 && (
                  <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full uppercase tracking-wider">
                    Recrutement Intense
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium">Offres Actives</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.activeOffers || 0}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Icon icon="lucide:clipboard-check" className="text-2xl" />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Stages en Cours</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.ongoingInternships || 0}</h3>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Applications Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-800">Candidatures par mois</h3>
                <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                  <option>6 derniers mois</option>
                  <option>12 derniers mois</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {chartData.length > 0 ? (
                  chartData.map((data, i) => {
                    const maxCount = Math.max(...chartData.map(d => d.count));
                    const height = maxCount > 0 ? (data.count / maxCount) * 95 : 5;
                    const isLast = i === chartData.length - 1;

                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center group">
                        <div
                          className={`w-full ${isLast ? 'bg-blue-600' : 'bg-blue-500/20 group-hover:bg-blue-500'} transition-all rounded-t-sm`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className={`text-[10px] mt-2 font-bold ${isLast ? 'text-blue-600' : 'text-slate-400'}`}>
                          {data.month}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Aucune donnée
                  </div>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-8">Stages par secteur</h3>
              {sectorData && sectorData.sectors.length > 0 ? (
                <div className="flex items-center justify-center space-x-12">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {sectorData.sectors.map((sector, index) => {
                        const colors = ['#1E40AF', '#0F766E', '#F59E0B', '#64748b', '#8B5CF6'];
                        const circumference = 2 * Math.PI * 40;
                        const dashArray = (sector.percentage / 100) * circumference;
                        const prevPercentages = sectorData.sectors.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                        const dashOffset = -(prevPercentages / 100) * circumference;

                        return (
                          <circle
                            key={sector.name}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="20"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={dashOffset}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-slate-800">{sectorData.total}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {sectorData.sectors.map((sector, index) => {
                      const colors = ['#1E40AF', '#0F766E', '#F59E0B', '#64748b', '#8B5CF6'];
                      return (
                        <div key={sector.name} className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[index % colors.length] }}></span>
                          <span>{sector.name} ({sector.percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-400">
                  Aucune donnée de secteur disponible
                </div>
              )}
            </div>
          </div>

          {/* Activities and Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Activities Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Activités récentes</h3>
                <Link href="/admin/activities" className="text-blue-600 text-sm font-bold hover:underline">
                  Voir tout
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Utilisateur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activities.length > 0 ? (
                      activities.map((activity, index) => {
                        const date = new Date(activity.date);
                        const formatted = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                        const typeColors: Record<string, string> = {
                          application: 'bg-blue-100 text-blue-700',
                          evaluation: 'bg-amber-100 text-amber-700',
                          stage: 'bg-emerald-100 text-emerald-700',
                        };

                        const typeLabels: Record<string, string> = {
                          application: 'Candidature',
                          evaluation: 'Évaluation',
                          stage: 'Stage',
                        };

                        return (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-500">{formatted}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 ${typeColors[activity.type] || 'bg-slate-100 text-slate-700'} text-[10px] font-bold rounded-md`}>
                                {typeLabels[activity.type] || activity.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{activity.description}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{activity.user}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          Aucune activité récente
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Actions Rapides</h3>
              <div className="grid grid-cols-1 gap-4">
                <Link
                    href="/admin/students"
                  className="w-full flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon icon="lucide:user-plus" className="text-xl" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-bold text-slate-800">Gérer les Étudiants</p>
                    <p className="text-xs text-slate-500">Inscriptions et listes</p>
                  </div>
                </Link>

                <Link
                    href="/admin/companies"
                  className="w-full flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-teal-500 hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Icon icon="lucide:landmark" className="text-xl" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-bold text-slate-800">Gérer les Entreprises</p>
                    <p className="text-xs text-slate-500">Partenariats et offres</p>
                  </div>
                </Link>

                <Link
                    href="/admin/stats"
                  className="w-full flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Icon icon="lucide:bar-chart-3" className="text-xl" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-bold text-slate-800">Voir les Rapports</p>
                    <p className="text-xs text-slate-500">Statistiques détaillées</p>
                  </div>
                </Link>

                <Link
                    href="/admin/accounts"
                  className="w-full flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-800 hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-slate-100 text-slate-700 rounded-xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
                    <Icon icon="lucide:shield-check" className="text-xl" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-bold text-slate-800">Gestion des Comptes</p>
                    <p className="text-xs text-slate-500">Rôles et permissions</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
