'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth, api } from '@/lib/api';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  sector?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  size?: string;
  founded_year?: number;
  employee_count?: number;
  user?: {
    id: string;
    email: string;
    is_active: boolean;
    created_at: string;
  };
  offers?: Offer[];
  applications?: Application[];
  stats?: {
    totalOffers: number;
    activeOffers: number;
    totalApplications: number;
    acceptedApplications: number;
    completedInternships: number;
    acceptanceRate: number;
  };
}

interface Offer {
  id: string;
  title: string;
  description?: string;
  location?: string;
  duration?: string;
  start_date?: string;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  applied_at: string;
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  offer?: {
    id: string;
    title: string;
  };
}

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const companyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'offers' | 'applications'>('info');

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

    fetchCompanyDetails();
  }, [router, companyId]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/companies/${companyId}/detailed`);
      setCompany(data);
    } catch (error) {
      console.error('Failed to fetch company details:', error);
    } finally {
      setLoading(false);
    }
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      OPEN: 'bg-green-100 text-green-700',
      CLOSED: 'bg-slate-100 text-slate-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      ACCEPTED: 'Acceptée',
      REJECTED: 'Refusée',
      COMPLETED: 'Terminé',
      OPEN: 'Ouverte',
      CLOSED: 'Fermée',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
            <p className="text-slate-600 font-semibold">Chargement des détails...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icon icon="lucide:alert-circle" className="text-6xl text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Entreprise introuvable</p>
          <Link
            href="/admin/companies"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à la liste
          </Link>
        </div>
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
          <div className="flex items-center space-x-4">
            <Link
                href="/admin/companies"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Icon icon="lucide:arrow-left" className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{company.name}</h1>
              <p className="text-sm text-slate-500">{company.user?.email}</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">Offres Totales</span>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:briefcase" className="text-2xl text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{company.stats?.totalOffers || 0}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">Offres Actives</span>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:check-circle" className="text-2xl text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{company.stats?.activeOffers || 0}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">Candidatures</span>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:users" className="text-2xl text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{company.stats?.totalApplications || 0}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-500">Taux d'Acceptation</span>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Icon icon="lucide:percent" className="text-2xl text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{company.stats?.acceptanceRate || 0}%</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="border-b border-slate-200 px-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-4 text-sm font-bold transition-all border-b-2 ${
                    activeTab === 'info'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  Informations
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`py-4 text-sm font-bold transition-all border-b-2 ${
                    activeTab === 'offers'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  Offres ({company.offers?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`py-4 text-sm font-bold transition-all border-b-2 ${
                    activeTab === 'applications'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  Candidatures ({company.applications?.length || 0})
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Nom de l'entreprise
                      </label>
                      <p className="text-base text-slate-900 font-medium">{company.name}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Secteur
                      </label>
                      <p className="text-base text-slate-900 font-medium">{getSectorLabel(company.sector)}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Taille
                      </label>
                      <p className="text-base text-slate-900 font-medium">{company.size || '-'}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Nombre d'employés
                      </label>
                      <p className="text-base text-slate-900 font-medium">
                        {company.employee_count ? `${company.employee_count} employés` : '-'}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Année de fondation
                      </label>
                      <p className="text-base text-slate-900 font-medium">{company.founded_year || '-'}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Email
                      </label>
                      <p className="text-base text-slate-900 font-medium">{company.email || '-'}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Téléphone
                      </label>
                      <p className="text-base text-slate-900 font-medium">{company.phone || '-'}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Site web
                      </label>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-blue-600 hover:underline font-medium flex items-center gap-2"
                        >
                          {company.website}
                          <Icon icon="lucide:external-link" className="text-sm" />
                        </a>
                      ) : (
                        <p className="text-base text-slate-900 font-medium">-</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Adresse
                      </label>
                      <p className="text-base text-slate-900 font-medium">{company.address || '-'}</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Description
                      </label>
                      <p className="text-base text-slate-700 leading-relaxed">
                        {company.description || 'Aucune description disponible'}
                      </p>
                    </div>

                    <div className="md:col-span-2 pt-4 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Statut du compte
                      </label>
                      <div className="flex items-center gap-2">
                        {company.user?.is_active ? (
                          <>
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                            <span className="text-base text-green-700 font-medium">Compte actif</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 bg-slate-300 rounded-full"></span>
                            <span className="text-base text-slate-500 font-medium">Compte inactif</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Email du compte
                      </label>
                      <p className="text-base text-slate-900 font-medium">{company.user?.email}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Membre depuis
                      </label>
                      <p className="text-base text-slate-900 font-medium">
                        {company.user?.created_at ? formatDate(company.user.created_at) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Offers Tab */}
              {activeTab === 'offers' && (
                <div className="space-y-4">
                  {company.offers && company.offers.length > 0 ? (
                    company.offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">{offer.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {offer.location && (
                                <span className="flex items-center gap-1">
                                  <Icon icon="lucide:map-pin" className="text-slate-400" />
                                  {offer.location}
                                </span>
                              )}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(offer.status)}`}
                          >
                            {getStatusLabel(offer.status)}
                          </span>
                        </div>

                        {offer.description && (
                          <p className="text-sm text-slate-700 mb-3 line-clamp-2">{offer.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {offer.duration && (
                              <span className="flex items-center gap-1">
                                <Icon icon="lucide:clock" />
                                {offer.duration}
                              </span>
                            )}
                            {offer.start_date && (
                              <span className="flex items-center gap-1">
                                <Icon icon="lucide:calendar" />
                                {formatDate(offer.start_date)}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/admin/offers/${offer.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Voir les détails →
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Icon icon="lucide:briefcase" className="text-6xl text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-semibold">Aucune offre publiée</p>
                    </div>
                  )}
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  {company.applications && company.applications.length > 0 ? (
                    company.applications.map((application) => (
                      <div
                        key={application.id}
                        className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">
                              {application.student?.first_name} {application.student?.last_name}
                            </h3>
                            <p className="text-sm text-slate-600">{application.offer?.title}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(application.status)}`}
                          >
                            {getStatusLabel(application.status)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-xs text-slate-500">
                            Candidature envoyée le {formatDate(application.applied_at)}
                          </span>
                          <Link
                            href={`/admin/students/${application.student?.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Voir l'étudiant →
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Icon icon="lucide:inbox" className="text-6xl text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-semibold">Aucune candidature reçue</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
