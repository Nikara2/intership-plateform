'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth, api } from '@/lib/api';
import Link from 'next/link';

interface StudentDetails {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  school?: string;
  program?: string;
  level?: string;
  cv_url?: string;
  about?: string;
  skills?: string[];
  user?: {
    id: string;
    email: string;
    is_active: boolean;
    created_at: string;
  };
  applications?: Array<{
    id: string;
    status: string;
    applied_at: string;
    offer: {
      id: string;
      title: string;
      location?: string;
      company: {
        id: string;
        name: string;
      };
    };
  }>;
  evaluations?: Array<{
    id: string;
    score: number;
    comment?: string;
    evaluated_at: string;
    application: {
      offer: {
        title: string;
        company: {
          name: string;
        };
      };
    };
  }>;
  stats?: {
    totalApplications: number;
    acceptedApplications: number;
    completedInternships: number;
    averageScore: string | null;
  };
}

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const studentId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'applications' | 'evaluations'>('info');

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

    if (studentId) {
      fetchStudentDetails();
    }
  }, [router, studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/students/${studentId}/details`);
      setStudent(data);
    } catch (error) {
      console.error('Failed to fetch student details:', error);
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
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
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
      case 'COMPLETED':
        return 'Terminé';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Icon icon="lucide:loader-2" className="text-5xl text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icon icon="lucide:user-x" className="text-6xl text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Étudiant introuvable</h2>
          <Link
            href="/admin/students"
            className="text-blue-600 hover:underline font-medium"
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
          <div className="flex items-center gap-4">
            <Link
              href="/admin/students"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icon icon="lucide:arrow-left" className="text-xl text-slate-600" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">
              {student.first_name} {student.last_name}
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Icon icon="lucide:bell" className="text-2xl" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{auth.getEmail()}</p>
                <p className="text-xs text-slate-500">Administrateur Principal</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
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
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 h-32"></div>
            <div className="px-8 pb-8">
              <div className="flex items-start gap-6 -mt-16">
                <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.first_name}`}
                    alt="Avatar"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1 mt-16">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">
                        {student.first_name} {student.last_name}
                      </h2>
                      <p className="text-slate-600 mt-1">{student.user?.email}</p>
                      {student.phone && (
                        <p className="text-slate-600 mt-1">{student.phone}</p>
                      )}
                    </div>
                    {student.user?.is_active ? (
                      <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Actif
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-lg font-bold text-sm">
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                        Inactif
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="lucide:send" className="text-2xl text-blue-600" />
                    <span className="text-3xl font-bold text-blue-900">
                      {student.stats?.totalApplications || 0}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-blue-700">Candidatures</p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="lucide:check-circle" className="text-2xl text-green-600" />
                    <span className="text-3xl font-bold text-green-900">
                      {student.stats?.acceptedApplications || 0}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-green-700">Acceptées</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="lucide:briefcase" className="text-2xl text-purple-600" />
                    <span className="text-3xl font-bold text-purple-900">
                      {student.stats?.completedInternships || 0}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-purple-700">Stages terminés</p>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="lucide:star" className="text-2xl text-amber-600" />
                    <span className="text-3xl font-bold text-amber-900">
                      {student.stats?.averageScore || '-'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-amber-700">Note moyenne</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-6 py-4 font-bold text-sm transition-all ${
                    activeTab === 'info'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon icon="lucide:user" className="inline-block mr-2 text-lg" />
                  Informations
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`flex-1 px-6 py-4 font-bold text-sm transition-all ${
                    activeTab === 'applications'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon icon="lucide:file-text" className="inline-block mr-2 text-lg" />
                  Candidatures ({student.applications?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('evaluations')}
                  className={`flex-1 px-6 py-4 font-bold text-sm transition-all ${
                    activeTab === 'evaluations'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon icon="lucide:star" className="inline-block mr-2 text-lg" />
                  Évaluations ({student.evaluations?.length || 0})
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        École
                      </label>
                      <p className="mt-1 text-lg text-slate-900">{student.school || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Programme
                      </label>
                      <p className="mt-1 text-lg text-slate-900">{student.program || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Niveau
                      </label>
                      <p className="mt-1">
                        {student.level ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                            {student.level}
                          </span>
                        ) : (
                          '-'
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        CV
                      </label>
                      <p className="mt-1">
                        {student.cv_url ? (
                          <span className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                            <Icon icon="lucide:file-text" />
                            Télécharger le CV
                          </span>
                        ) : (
                          <span className="text-slate-400">Aucun CV</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {student.about && (
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        À propos
                      </label>
                      <p className="mt-2 text-slate-700 leading-relaxed">{student.about}</p>
                    </div>
                  )}

                  {student.skills && student.skills.length > 0 && (
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                        Compétences
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Membre depuis
                    </label>
                    <p className="mt-1 text-lg text-slate-900">
                      {student.user?.created_at ? formatDate(student.user.created_at) : '-'}
                    </p>
                  </div>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  {student.applications && student.applications.length > 0 ? (
                    student.applications.map((application) => (
                      <div
                        key={application.id}
                        className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">
                              {application.offer.title}
                            </h3>
                            <p className="text-slate-600 mt-1">
                              {application.offer.company.name}
                            </p>
                            {application.offer.location && (
                              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                <Icon icon="lucide:map-pin" className="text-sm" />
                                {application.offer.location}
                              </p>
                            )}
                            <p className="text-sm text-slate-500 mt-2">
                              Postulé le {formatDate(application.applied_at)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusLabel(application.status)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Icon icon="lucide:inbox" className="text-6xl text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-semibold">Aucune candidature</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Cet étudiant n'a pas encore postulé à des offres
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Evaluations Tab */}
              {activeTab === 'evaluations' && (
                <div className="space-y-4">
                  {student.evaluations && student.evaluations.length > 0 ? (
                    student.evaluations.map((evaluation) => (
                      <div
                        key={evaluation.id}
                        className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">
                              {evaluation.application.offer.title}
                            </h3>
                            <p className="text-slate-600 mt-1">
                              {evaluation.application.offer.company.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg">
                            <Icon icon="lucide:star" className="text-amber-500" />
                            <span className="text-2xl font-bold text-amber-900">
                              {evaluation.score}
                            </span>
                            <span className="text-sm text-amber-700">/100</span>
                          </div>
                        </div>
                        {evaluation.comment && (
                          <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                            {evaluation.comment}
                          </p>
                        )}
                        <p className="text-sm text-slate-500 mt-3">
                          Évalué le {formatDate(evaluation.evaluated_at)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Icon icon="lucide:star-off" className="text-6xl text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-semibold">Aucune évaluation</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Cet étudiant n'a pas encore été évalué
                      </p>
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
