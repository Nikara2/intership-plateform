'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth, api } from '@/lib/api';
import Link from 'next/link';

interface Application {
  id: string;
  status: string;
  applied_at: string;
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    program?: string;
    level?: string;
  };
  offer?: {
    id: string;
    title: string;
    location?: string;
    duration?: string;
    start_date?: string;
    company?: {
      id: string;
      name: string;
      sector?: string;
    };
  };
}

export default function AdminInternshipsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<Application[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

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

    fetchInternships();
  }, [router]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const data = await api.get('/applications');
      // Filter only ACCEPTED and COMPLETED internships
      const activeInternships = data.filter(
        (app: Application) => app.status === 'ACCEPTED' || app.status === 'COMPLETED'
      );
      setInternships(activeInternships);
      setFilteredInternships(activeInternships);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = internships;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (internship) =>
          internship.student?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.student?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.offer?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.offer?.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter((internship) => internship.status === filterStatus);
    }

    // Company filter
    if (filterCompany) {
      filtered = filtered.filter((internship) => internship.offer?.company?.name === filterCompany);
    }

    setFilteredInternships(filtered);
  }, [searchQuery, filterStatus, filterCompany, internships]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACCEPTED: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACCEPTED: 'En cours',
      COMPLETED: 'Terminé',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      ACCEPTED: 'lucide:play-circle',
      COMPLETED: 'lucide:check-circle',
    };
    return icons[status] || 'lucide:circle';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getSectorLabel = (sector?: string) => {
    const labels: Record<string, string> = {
      it: 'Tech & IT',
      finance: 'Finance',
      marketing: 'Marketing',
      health: 'Santé',
      energy: 'Énergie',
    };
    return sector ? labels[sector] || sector : '-';
  };

  const uniqueCompanies = Array.from(
    new Set(internships.map((i) => i.offer?.company?.name).filter(Boolean))
  );

  // Calculate stats
  const totalInternships = filteredInternships.length;
  const activeInternships = filteredInternships.filter((i) => i.status === 'ACCEPTED').length;
  const completedInternships = filteredInternships.filter((i) => i.status === 'COMPLETED').length;
  const uniqueStudents = new Set(filteredInternships.map((i) => i.student?.id)).size;

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
          <h1 className="text-2xl font-bold text-slate-800">Stages en Cours</h1>

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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">Stages Totaux</span>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:briefcase" className="text-2xl text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{totalInternships}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">En Cours</span>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:play-circle" className="text-2xl text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{activeInternships}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">Terminés</span>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:check-circle" className="text-2xl text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{completedInternships}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">Étudiants</span>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:users" className="text-2xl text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{uniqueStudents}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Rechercher par étudiant, entreprise, offre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="ACCEPTED">En cours</option>
                <option value="COMPLETED">Terminé</option>
              </select>

              {/* Company Filter */}
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Toutes les entreprises</option>
                {uniqueCompanies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(searchQuery || filterStatus || filterCompany) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('');
                    setFilterCompany('');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-700">{filteredInternships.length}</span> stage
                {filteredInternships.length > 1 ? 's' : ''} trouvé{filteredInternships.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Internships List */}
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-6 bg-slate-200 rounded w-1/3 mb-3"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                      </div>
                      <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : filteredInternships.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
                <Icon icon="lucide:briefcase" className="text-6xl text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">Aucun stage trouvé</p>
                <p className="text-sm text-slate-400 mt-1">
                  {searchQuery || filterStatus || filterCompany
                    ? 'Essayez de modifier vos filtres'
                    : 'Aucun stage en cours pour le moment'}
                </p>
              </div>
            ) : (
              filteredInternships.map((internship) => (
                <div
                  key={internship.id}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {internship.student?.first_name} {internship.student?.last_name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(internship.status)}`}
                        >
                          <Icon icon={getStatusIcon(internship.status)} />
                          {getStatusLabel(internship.status)}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Icon icon="lucide:briefcase" className="text-slate-400" />
                          <span className="font-medium">{internship.offer?.title}</span>
                        </p>

                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Icon icon="lucide:building-2" className="text-slate-400" />
                          <span>{internship.offer?.company?.name}</span>
                          {internship.offer?.company?.sector && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                              {getSectorLabel(internship.offer.company.sector)}
                            </span>
                          )}
                        </p>

                        {internship.offer?.location && (
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Icon icon="lucide:map-pin" className="text-slate-400" />
                            {internship.offer.location}
                          </p>
                        )}

                        {internship.student?.program && (
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Icon icon="lucide:graduation-cap" className="text-slate-400" />
                            {internship.student.program}
                            {internship.student.level && ` - ${internship.student.level}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        {internship.offer?.duration && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Icon icon="lucide:clock" />
                            {internship.offer.duration}
                          </p>
                        )}
                        {internship.offer?.start_date && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Icon icon="lucide:calendar" />
                            {formatDate(internship.offer.start_date)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Candidature acceptée le {formatDate(internship.applied_at)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/students/${internship.student?.id}`}
                        className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Icon icon="lucide:user" />
                        Voir l'étudiant
                      </Link>
                      <Link
                        href={`/admin/companies/${internship.offer?.company?.id}`}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Icon icon="lucide:building-2" />
                        Voir l'entreprise
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
