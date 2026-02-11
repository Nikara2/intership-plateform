'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterSize, setFilterSize] = useState('');

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

    fetchCompanies();
  }, [router]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await api.get('/companies');
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = companies;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.sector?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sector filter
    if (filterSector) {
      filtered = filtered.filter((company) => company.sector === filterSector);
    }

    // Size filter
    if (filterSize) {
      filtered = filtered.filter((company) => company.size === filterSize);
    }

    setFilteredCompanies(filtered);
  }, [searchQuery, filterSector, filterSize, companies]);

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

  const uniqueSectors = Array.from(new Set(companies.map((c) => c.sector).filter(Boolean)));
  const uniqueSizes = Array.from(new Set(companies.map((c) => c.size).filter(Boolean)));

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
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Entreprises</h1>

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
                    placeholder="Rechercher par nom, email, secteur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Sector Filter */}
              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Tous les secteurs</option>
                {uniqueSectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {getSectorLabel(sector)}
                  </option>
                ))}
              </select>

              {/* Size Filter */}
              <select
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Toutes les tailles</option>
                {uniqueSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(searchQuery || filterSector || filterSize) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterSector('');
                    setFilterSize('');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-700">{filteredCompanies.length}</span> entreprise
                {filteredCompanies.length > 1 ? 's' : ''} trouvée{filteredCompanies.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse"
                  >
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </>
            ) : filteredCompanies.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-100 text-center">
                <Icon icon="lucide:building-2" className="text-6xl text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">Aucune entreprise trouvée</p>
                <p className="text-sm text-slate-400 mt-1">
                  {searchQuery || filterSector || filterSize
                    ? 'Essayez de modifier vos filtres'
                    : 'Aucune entreprise partenaire pour le moment'}
                </p>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      {company.sector && (
                        <span className="inline-block mt-2 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          {getSectorLabel(company.sector)}
                        </span>
                      )}
                    </div>
                    {company.user?.is_active ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                        <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {company.email && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Icon icon="lucide:mail" className="text-slate-400" />
                        {company.email}
                      </p>
                    )}
                    {company.phone && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Icon icon="lucide:phone" className="text-slate-400" />
                        {company.phone}
                      </p>
                    )}
                    {company.address && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Icon icon="lucide:map-pin" className="text-slate-400" />
                        {company.address}
                      </p>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <Icon icon="lucide:external-link" className="text-blue-500" />
                        Site web
                      </a>
                    )}
                  </div>

                  {company.description && (
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{company.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {company.employee_count && (
                        <span className="flex items-center gap-1">
                          <Icon icon="lucide:users" />
                          {company.employee_count} employés
                        </span>
                      )}
                      {company.founded_year && (
                        <span className="flex items-center gap-1">
                          <Icon icon="lucide:calendar" />
                          {company.founded_year}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/admin/companies/${company.id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Icon icon="lucide:eye" className="text-lg" />
                    </Link>
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
