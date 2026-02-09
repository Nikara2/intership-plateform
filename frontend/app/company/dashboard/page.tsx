'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { auth, companyAPI } from '@/lib/api';

interface DashboardStats {
  activeOffers: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  completionRate: number;
  recentApplications: any[];
  activeOffersData: any[];
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated() || auth.getRole() !== 'COMPANY') {
      router.push('/login');
      return;
    }
    setUserEmail(auth.getEmail() || '');
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await companyAPI.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('Error fetching stats:', error);

      // Si le profil d'entreprise n'existe pas, le créer automatiquement
      if (error?.message?.includes('Company not found')) {
        try {
          await companyAPI.setupProfile();
          // Réessayer de charger les stats
          setTimeout(() => fetchStats(), 1000);
        } catch (setupError) {
          console.error('Error setting up profile:', setupError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'INTERVIEW':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'ACCEPTED':
        return 'Accepté';
      case 'REJECTED':
        return 'Refusé';
      case 'INTERVIEW':
        return 'Entretien';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Maintenant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };

  return (
    <>
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-8 py-10">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Bienvenue, {userEmail?.split('@')[0]}
            </h1>
            <p className="text-slate-500 text-lg">
              Voici l'aperçu de votre activité de recrutement pour aujourd'hui.
            </p>
          </div>
          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/company/profile" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all">
              <Icon icon="lucide:user-cog" />
              Modifier mon Profil
            </Link>
            <Link href="/company/applications" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all">
              <Icon icon="lucide:users" />
              Voir les Candidatures
            </Link>
            <Link href="/company/offers" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold shadow-lg shadow-orange-200 hover:bg-[#D97706] transition-all transform hover:-translate-y-0.5 active:translate-y-0">
              <Icon icon="lucide:plus-circle" />
              Publier une Nouvelle Offre
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            // Loading skeleton
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
                      <div className="h-8 bg-slate-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Offres Actives */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 font-medium mb-1">Offres Actives</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats?.activeOffers || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[#16A34A]">
                    <Icon icon="lucide:file-text" className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-green-600">
                  <Icon icon="lucide:trending-up" />
                  <span>En ligne</span>
                </div>
              </div>

              {/* Total Candidatures */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 font-medium mb-1">Total Candidatures</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats?.totalApplications || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E40AF]">
                    <Icon icon="lucide:send" className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
                  <Icon icon="lucide:activity" />
                  <span>Taux: {stats?.completionRate || 0}%</span>
                </div>
              </div>

              {/* En Attente */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 font-medium mb-1">En Attente</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats?.pendingApplications || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F59E0B]">
                    <Icon icon="lucide:clock" className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-orange-600">
                  <Icon icon="lucide:alert-circle" />
                  <span>Nécessite votre attention</span>
                </div>
              </div>

              {/* Acceptés */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 font-medium mb-1">Acceptés</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats?.acceptedApplications || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Icon icon="lucide:graduation-cap" className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-teal-600">
                  <Icon icon="lucide:check-circle-2" />
                  <span>Confirmés</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CANDIDATURES RÉCENTES (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Candidatures Récentes</h2>
                <Link href="/company/applications" className="text-sm font-bold text-[#1E40AF] hover:underline">
                  Voir toutes les candidatures
                </Link>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-[#1E40AF] border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : stats?.recentApplications && stats.recentApplications.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-4">Étudiant</th>
                        <th className="px-6 py-4">Offre</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.recentApplications.map((app: any) => (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student?.first_name || 'Student'}`}
                                className="w-10 h-10 rounded-full bg-slate-100"
                                alt="Avatar"
                              />
                              <div>
                                <p className="font-bold text-slate-900">
                                  {app.student?.first_name} {app.student?.last_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {app.student?.level || 'Étudiant'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">
                            {app.offer?.title || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {formatDate(app.applied_at)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                              {getStatusLabel(app.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/company/applications?id=${app.id}`}
                              className="p-2 text-slate-400 hover:text-[#1E40AF] transition-colors inline-block"
                            >
                              <Icon icon="lucide:eye" className="text-lg" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    <Icon icon="lucide:inbox" className="text-5xl mx-auto mb-4 text-slate-300" />
                    <p className="font-semibold">Aucune candidature récente</p>
                    <p className="text-sm mt-1">Les nouvelles candidatures apparaîtront ici</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MES OFFRES ACTIVES (Right 1/3) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Offres en cours</h2>
              <Link href="/company/offers" className="text-sm font-bold text-[#1E40AF] hover:underline">
                Toutes les offres
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                        <div className="h-8 bg-slate-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : stats?.activeOffersData && stats.activeOffersData.length > 0 ? (
                stats.activeOffersData.map((offer: any) => (
                  <div
                    key={offer.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#1E40AF] transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-900 group-hover:text-[#1E40AF] transition-colors">
                        {offer.title}
                      </h4>
                      <Link
                        href={`/company/offers?id=${offer.id}`}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        <Icon icon="lucide:more-horizontal" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <Icon icon="lucide:map-pin" />
                      {offer.location || 'Non spécifié'}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-bold text-slate-600">
                          {offer._count?.applications || 0} candidatures
                        </span>
                      </div>
                      <Link
                        href={`/company/offers?id=${offer.id}`}
                        className="px-4 py-1.5 bg-slate-50 text-[#1E40AF] text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Modifier
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                  <Icon icon="lucide:briefcase" className="text-4xl mx-auto mb-3 text-slate-300" />
                  <p className="font-semibold mb-1">Aucune offre active</p>
                  <p className="text-sm">Créez votre première offre</p>
                </div>
              )}
            </div>

            {/* Additional Offer Info/CTA */}
            <div className="bg-[#1E40AF] rounded-2xl p-6 text-white text-center">
              <Icon icon="lucide:rocket" className="text-4xl mb-3 mx-auto" />
              <p className="font-bold mb-1">Besoin de plus de visibilité ?</p>
              <p className="text-blue-200 text-sm mb-4">
                Mettez vos offres en avant pour attirer les meilleurs profils.
              </p>
              <button className="w-full py-2 bg-white text-[#1E40AF] font-bold rounded-xl hover:bg-blue-50 transition-colors">
                Passer en Premium
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER (SIMPLE) */}
        <footer className="w-full px-8 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm mt-auto">
          <p>&copy; 2024 StageConnect. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600">
              Aide & Support
            </a>
            <a href="#" className="hover:text-slate-600">
              Conditions d'utilisation
            </a>
            <a href="#" className="hover:text-slate-600">
              Confidentialité
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
