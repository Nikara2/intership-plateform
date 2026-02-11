'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth, api, adminAPI } from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
  totalStudents: number;
  totalCompanies: number;
  activeOffers: number;
  ongoingInternships: number;
  studentsGrowth: number;
  companiesGrowth: number;
}

interface ApplicationByMonth {
  month: string;
  count: number;
}

interface SectorData {
  name: string;
  count: number;
  percentage: number;
}

interface InternshipsBySector {
  sectors: SectorData[];
  total: number;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [applicationsByMonth, setApplicationsByMonth] = useState<ApplicationByMonth[]>([]);
  const [internshipsBySector, setInternshipsBySector] = useState<InternshipsBySector | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(6);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const role = auth.getRole();
    if (role === 'COMPANY') {
      router.push('/company/dashboard');
      return;
    }

    if (role !== 'SCHOOL_ADMIN') {
      router.push('/login');
      return;
    }

    fetchAllStats();
  }, [router, selectedPeriod]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const [stats, applications, sectors] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getApplicationsByMonth(selectedPeriod),
        adminAPI.getInternshipsBySector(),
      ]);

      setDashboardStats(stats);
      setApplicationsByMonth(applications);
      setInternshipsBySector(sectors);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxApplicationCount = () => {
    if (applicationsByMonth.length === 0) return 0;
    return Math.max(...applicationsByMonth.map((a) => a.count));
  };

  const getSectorColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-amber-500',
      'bg-red-500',
      'bg-pink-500',
    ];
    return colors[index % colors.length];
  };

  const getSectorColorRing = (index: number) => {
    const colors = [
      'bg-blue-100',
      'bg-purple-100',
      'bg-green-100',
      'bg-amber-100',
      'bg-red-100',
      'bg-pink-100',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <aside className="w-64 bg-[#0F172A] text-slate-400 flex flex-col h-screen fixed inset-y-0 left-0 z-50">
          <div className="p-8 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:graduation-cap" className="text-white text-2xl" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">EduStage</span>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon icon="lucide:loader-2" className="text-6xl text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">Chargement des statistiques...</p>
          </div>
        </main>
      </div>
    );
  }

  const maxCount = getMaxApplicationCount();

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
          <h1 className="text-2xl font-bold text-slate-800">Statistiques & Rapports</h1>

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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:users" className="text-2xl" />
                </div>
                {dashboardStats && dashboardStats.studentsGrowth > 0 && (
                  <span className="flex items-center gap-1 text-sm font-bold bg-white/20 px-2.5 py-1 rounded-full">
                    <Icon icon="lucide:trending-up" />
                    +{dashboardStats.studentsGrowth}%
                  </span>
                )}
              </div>
              <p className="text-4xl font-extrabold mb-1">{dashboardStats?.totalStudents || 0}</p>
              <p className="text-blue-100 text-sm font-medium">Étudiants Inscrits</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:building-2" className="text-2xl" />
                </div>
                {dashboardStats && dashboardStats.companiesGrowth > 0 && (
                  <span className="flex items-center gap-1 text-sm font-bold bg-white/20 px-2.5 py-1 rounded-full">
                    <Icon icon="lucide:trending-up" />
                    +{dashboardStats.companiesGrowth}%
                  </span>
                )}
              </div>
              <p className="text-4xl font-extrabold mb-1">{dashboardStats?.totalCompanies || 0}</p>
              <p className="text-purple-100 text-sm font-medium">Entreprises Partenaires</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:file-text" className="text-2xl" />
                </div>
              </div>
              <p className="text-4xl font-extrabold mb-1">{dashboardStats?.activeOffers || 0}</p>
              <p className="text-green-100 text-sm font-medium">Offres Actives</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:briefcase" className="text-2xl" />
                </div>
              </div>
              <p className="text-4xl font-extrabold mb-1">{dashboardStats?.ongoingInternships || 0}</p>
              <p className="text-amber-100 text-sm font-medium">Stages en Cours</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Candidatures par Mois</h2>
                  <p className="text-sm text-slate-500 mt-1">Évolution des candidatures</p>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={3}>3 mois</option>
                  <option value={6}>6 mois</option>
                  <option value={12}>12 mois</option>
                </select>
              </div>

              {applicationsByMonth.length > 0 ? (
                <div className="space-y-3">
                  {applicationsByMonth.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-700 w-12">{item.month}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end px-3 transition-all duration-500"
                          style={{ width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%' }}
                        >
                          {item.count > 0 && (
                            <span className="text-xs font-bold text-white">{item.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon icon="lucide:bar-chart" className="text-6xl text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-semibold">Aucune donnée disponible</p>
                </div>
              )}
            </div>

            {/* Sectors Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Stages par Secteur</h2>
                <p className="text-sm text-slate-500 mt-1">Répartition des stages par secteur d'activité</p>
              </div>

              {internshipsBySector && internshipsBySector.sectors.length > 0 ? (
                <div className="space-y-4">
                  {internshipsBySector.sectors.map((sector, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getSectorColor(index)}`}></div>
                          <span className="text-sm font-bold text-slate-700">{sector.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-900">{sector.count}</span>
                          <span className="text-sm font-medium text-slate-500">{sector.percentage}%</span>
                        </div>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${getSectorColor(index)} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${sector.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Total</span>
                      <span className="text-lg font-extrabold text-slate-900">{internshipsBySector.total}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon icon="lucide:pie-chart" className="text-6xl text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-semibold">Aucune donnée disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:target" className="text-2xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">Taux de Placement</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {dashboardStats && dashboardStats.totalStudents > 0
                      ? Math.round((dashboardStats.ongoingInternships / dashboardStats.totalStudents) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {dashboardStats?.ongoingInternships || 0} étudiants sur {dashboardStats?.totalStudents || 0} en stage
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:trending-up" className="text-2xl text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">Offres par Entreprise</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {dashboardStats && dashboardStats.totalCompanies > 0
                      ? (dashboardStats.activeOffers / dashboardStats.totalCompanies).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Moyenne d'offres actives par entreprise</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:award" className="text-2xl text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">Taux de Réussite</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {applicationsByMonth.length > 0
                      ? Math.round(
                          (applicationsByMonth.reduce((sum, item) => sum + item.count, 0) /
                            applicationsByMonth.length /
                            (dashboardStats?.totalStudents || 1)) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Taux de candidatures par étudiant</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/students"
                className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all">
                  <Icon icon="lucide:users" className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Voir les Étudiants</p>
                  <p className="text-xs text-slate-500">{dashboardStats?.totalStudents || 0} inscrits</p>
                </div>
              </Link>

              <Link
                href="/admin/companies"
                className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-all">
                  <Icon icon="lucide:building-2" className="text-xl text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Voir les Entreprises</p>
                  <p className="text-xs text-slate-500">{dashboardStats?.totalCompanies || 0} partenaires</p>
                </div>
              </Link>

              <Link
                href="/admin/internships"
                className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-300 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-all">
                  <Icon icon="lucide:briefcase" className="text-xl text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Stages en Cours</p>
                  <p className="text-xs text-slate-500">{dashboardStats?.ongoingInternships || 0} actifs</p>
                </div>
              </Link>

              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-amber-100 group-hover:bg-amber-200 rounded-lg flex items-center justify-center transition-all">
                  <Icon icon="lucide:layout-dashboard" className="text-xl text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Dashboard</p>
                  <p className="text-xs text-slate-500">Vue d'ensemble</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
