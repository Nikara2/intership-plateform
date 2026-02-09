'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { applicationsAPI } from '@/lib/api';

interface ApplicationData {
  id: string;
  student_id: string;
  offer_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  applied_at: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    school?: string;
    program?: string;
    level?: string;
    cv_url?: string;
    user?: { email: string };
  };
  offer: {
    id: string;
    title: string;
    description: string;
    location?: string;
    duration?: string;
    requirements?: string;
    deadline: string;
    status: string;
    company?: {
      name: string;
    };
  };
}

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'offer'>('info');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationsAPI.getAll();
      setApplications(data);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      setUpdatingStatus(id);
      await applicationsAPI.updateStatus(id, status);
      await fetchApplications();
      if (showModal && selectedApplication?.id === id) {
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(err.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openModal = (application: ApplicationData) => {
    setSelectedApplication(application);
    setShowModal(true);
    setActiveTab('info');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setActiveTab('info');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-[#F59E0B]';
      case 'ACCEPTED':
        return 'bg-green-100 text-[#16A34A]';
      case 'REJECTED':
        return 'bg-red-100 text-[#DC2626]';
      case 'COMPLETED':
        return 'bg-blue-100 text-[#1E40AF]';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En Attente';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'REJECTED':
        return 'Refusée';
      case 'COMPLETED':
        return 'Terminée';
      default:
        return status;
    }
  };

  const getStudentName = (app: ApplicationData) => {
    if (app.student) {
      return `${app.student.first_name || ''} ${app.student.last_name || ''}`.trim() || 'Étudiant';
    }
    return 'Étudiant';
  };

  const getStudentEmail = (app: ApplicationData) => {
    return app.student?.user?.email || '—';
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = !filterStatus || app.status === filterStatus;
    const name = getStudentName(app).toLowerCase();
    const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-[1440px] mx-auto px-8 py-10 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E40AF]"></div>
          <span className="ml-3 text-slate-500">Chargement des candidatures...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 max-w-[1440px] mx-auto px-8 py-10 w-full">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <Icon icon="lucide:alert-circle" className="text-red-500 text-3xl mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchApplications}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 max-w-[1440px] mx-auto px-8 py-10 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Candidatures Reçues
            </h1>
            <p className="text-slate-500">
              Gérez et examinez les talents qui souhaitent rejoindre votre équipe.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-[#1E40AF] rounded-xl flex items-center justify-center">
              <Icon icon="lucide:users-2" className="text-2xl" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Candidatures</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 text-[#F59E0B] rounded-xl flex items-center justify-center">
              <Icon icon="lucide:clock" className="text-2xl" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                En Attente
              </p>
              <p className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                {stats.pending}
                {stats.pending > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#F59E0B]">
                    Action Requise
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 text-[#16A34A] rounded-xl flex items-center justify-center">
              <Icon icon="lucide:check-circle-2" className="text-2xl" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                Acceptées
              </p>
              <p className="text-3xl font-bold text-slate-900">{stats.accepted}</p>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
          {/* Filters */}
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Icon
                icon="lucide:search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"
              />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En Attente</option>
                <option value="ACCEPTED">Acceptées</option>
                <option value="REJECTED">Refusées</option>
                <option value="COMPLETED">Terminées</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Étudiant</th>
                  <th className="px-6 py-4">Offre Concernée</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Statut</th>
                  <th className="px-6 py-4 text-center">CV</th>
                  <th className="px-10 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <Icon icon="lucide:inbox" className="text-4xl mx-auto mb-2 text-slate-300" />
                      <p className="font-medium">Aucune candidature trouvée</p>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className={app.status === 'ACCEPTED' ? 'bg-slate-50/30' : ''}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-[#1E40AF] flex items-center justify-center text-white font-bold text-sm">
                            {getStudentName(app).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{getStudentName(app)}</p>
                            <p className="text-xs text-slate-500">
                              {app.student?.school || app.student?.program || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {app.offer?.title || '—'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="text-sm text-slate-900">{getStudentEmail(app)}</p>
                          <p className="text-xs text-slate-500">{app.student?.phone || '—'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(app.applied_at)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {getStatusLabel(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        {app.student?.cv_url ? (
                          <a
                            href={app.student.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center mx-auto rounded-lg text-[#1E40AF] hover:bg-blue-50 transition-all"
                          >
                            <Icon icon="lucide:file-text" className="text-lg" />
                          </a>
                        ) : (
                          <span className="w-9 h-9 flex items-center justify-center mx-auto rounded-lg text-slate-300">
                            <Icon icon="lucide:file-x" className="text-lg" />
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(app)}
                            className="px-3 py-1.5 text-xs font-bold text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Détails
                          </button>
                          {app.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                                disabled={updatingStatus === app.id}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#16A34A]/90 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === app.id ? '...' : 'Accepter'}
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                disabled={updatingStatus === app.id}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#DC2626]/90 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === app.id ? '...' : 'Refuser'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-bold">{filteredApplications.length}</span> candidature{filteredApplications.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-[#1E40AF] p-10 text-white">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Icon icon="lucide:x" className="text-xl" />
              </button>
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-lg bg-white/10 flex items-center justify-center text-4xl font-bold">
                  {getStudentName(selectedApplication).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-extrabold">{getStudentName(selectedApplication)}</h2>
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                        selectedApplication.status === 'PENDING'
                          ? 'bg-[#F59E0B] text-white'
                          : selectedApplication.status === 'ACCEPTED'
                          ? 'bg-[#16A34A] text-white'
                          : selectedApplication.status === 'REJECTED'
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-blue-300 text-white'
                      }`}
                    >
                      {getStatusLabel(selectedApplication.status)}
                    </span>
                  </div>
                  <p className="text-blue-100 flex items-center gap-2">
                    <Icon icon="lucide:graduation-cap" />
                    {selectedApplication.student?.program || selectedApplication.student?.school || 'Étudiant'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-10">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-5 text-sm font-bold ${
                  activeTab === 'info'
                    ? 'border-b-2 border-[#1E40AF] text-[#1E40AF]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Informations
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-6 py-5 text-sm font-medium ${
                  activeTab === 'docs'
                    ? 'border-b-2 border-[#1E40AF] text-[#1E40AF]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                CV et Documents
              </button>
              <button
                onClick={() => setActiveTab('offer')}
                className={`px-6 py-5 text-sm font-medium ${
                  activeTab === 'offer'
                    ? 'border-b-2 border-[#1E40AF] text-[#1E40AF]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Offre Concernée
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-10 overflow-y-auto flex-1">
              {activeTab === 'info' && (
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Email
                      </label>
                      <p className="font-bold text-slate-900">{getStudentEmail(selectedApplication)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Téléphone
                      </label>
                      <p className="font-bold text-slate-900">{selectedApplication.student?.phone || '—'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        École
                      </label>
                      <p className="font-bold text-slate-900">
                        {selectedApplication.student?.school || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Programme
                      </label>
                      <p className="font-bold text-slate-900">
                        {selectedApplication.student?.program || '—'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Date de Candidature
                      </label>
                      <p className="font-bold text-slate-900">
                        {formatDate(selectedApplication.applied_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Niveau d&apos;études
                      </label>
                      <p className="font-bold text-slate-900">{selectedApplication.student?.level || '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-6">
                  {selectedApplication.student?.cv_url ? (
                    <a
                      href={selectedApplication.student.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-between hover:border-[#1E40AF]/30 transition-colors group block"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                          <Icon icon="lucide:file-text" className="text-2xl" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">CV</p>
                          <p className="text-xs text-slate-500">Télécharger le CV</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-[#1E40AF] group-hover:text-white transition-all">
                        <Icon icon="lucide:download" />
                      </div>
                    </a>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <Icon icon="lucide:file-x" className="text-3xl text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 font-medium">Aucun document disponible</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'offer' && selectedApplication.offer && (
                <div className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h4 className="font-extrabold text-[#1E40AF] mb-2">
                      {selectedApplication.offer.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      {[
                        selectedApplication.offer.duration,
                        selectedApplication.offer.location,
                      ]
                        .filter(Boolean)
                        .join(' • ') || '—'}
                    </p>
                    <p className="text-sm text-slate-700">{selectedApplication.offer.description}</p>
                    {selectedApplication.offer.requirements && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Prérequis</p>
                        <p className="text-sm text-slate-600">{selectedApplication.offer.requirements}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              {selectedApplication.status === 'PENDING' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'REJECTED')}
                    disabled={updatingStatus === selectedApplication.id}
                    className="px-8 py-3 bg-[#DC2626] text-white font-bold rounded-xl shadow-lg shadow-red-500/10 hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {updatingStatus === selectedApplication.id ? 'En cours...' : 'Refuser la candidature'}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'ACCEPTED')}
                    disabled={updatingStatus === selectedApplication.id}
                    className="px-8 py-3 bg-[#16A34A] text-white font-bold rounded-xl shadow-lg shadow-green-500/10 hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {updatingStatus === selectedApplication.id ? 'En cours...' : 'Accepter la candidature'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
