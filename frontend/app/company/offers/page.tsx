'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { offersAPI, companyAPI, auth } from '@/lib/api';
import Toast from '@/components/Toast';

interface JobOffer {
  id: string;
  title: string;
  location?: string;
  duration?: string;
  description: string;
  requirements?: string;
  deadline: string;
  created_at: string;
  status: string;
  _count?: { applications: number };
}

export default function CompanyOffersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '3-6 mois',
    description: '',
    requirements: '',
    deadline: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated() || auth.getRole() !== 'COMPANY') {
      router.push('/login');
      return;
    }
    fetchOffers();
  }, [router]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await offersAPI.getAll();
      setOffers(data);
    } catch (error: any) {
      console.error('Error fetching offers:', error);

      // Si le profil d'entreprise n'existe pas, le créer automatiquement
      if (error?.message?.includes('Company not found')) {
        try {
          await companyAPI.setupProfile();
          setToast({ message: 'Profil d\'entreprise créé. Rechargement...', type: 'success' });
          // Réessayer de charger les offres
          setTimeout(() => fetchOffers(), 1000);
        } catch (setupError) {
          console.error('Error setting up profile:', setupError);
          setToast({ message: 'Erreur lors de la création du profil', type: 'error' });
        }
      } else {
        setToast({ message: 'Erreur lors du chargement des offres', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.deadline) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    // Vérifier l'authentification
    if (!auth.isAuthenticated()) {
      setToast({ message: 'Session expirée. Veuillez vous reconnecter.', type: 'error' });
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    try {
      setSubmitting(true);
      await offersAPI.create({
        ...formData,
        requirements: skills.join(', '),
      });
      setToast({ message: 'Offre publiée avec succès !', type: 'success' });
      setShowModal(false);
      resetForm();
      fetchOffers();
    } catch (error: any) {
      console.error('Error creating offer:', error);

      // Gérer les erreurs d'authentification
      if (error?.message === 'Unauthorized' || error?.message?.includes('401')) {
        setToast({ message: 'Session expirée. Veuillez vous reconnecter.', type: 'error' });
        setTimeout(() => router.push('/login'), 2000);
      } else if (error?.message?.includes('Company not found')) {
        // Si le profil d'entreprise n'existe pas, le créer et réessayer
        try {
          await companyAPI.setupProfile();
          setToast({ message: 'Profil créé. Veuillez réessayer.', type: 'info' });
          setSubmitting(false);
          // Réessayer automatiquement après 1 seconde
          setTimeout(() => handleSubmit(new Event('submit') as any), 1000);
          return;
        } catch (setupError) {
          setToast({ message: 'Erreur lors de la création du profil', type: 'error' });
        }
      } else {
        setToast({
          message: error?.message || 'Erreur lors de la publication de l\'offre',
          type: 'error'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      duration: '3-6 mois',
      description: '',
      requirements: '',
      deadline: '',
    });
    setSkills([]);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main className="flex-grow max-w-[1440px] mx-auto px-8 py-10 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Mes Offres de Stage
            </h1>
            <p className="text-slate-500">
              Gérez vos opportunités et suivez les candidatures en temps réel.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200/50 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Icon icon="lucide:plus-circle" className="text-xl" />
            Publier une Nouvelle Offre
          </button>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Icon
                icon="lucide:search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl"
              />
              <input
                type="text"
                placeholder="Rechercher une offre..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white transition-all outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
              />
            </div>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 min-w-[160px] outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]">
                <option value="all">Tous les Statuts</option>
                <option value="open">Ouvertes</option>
                <option value="closed">Fermées</option>
              </select>
              <Icon
                icon="lucide:chevron-down"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#1E40AF] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon icon="lucide:layout-grid" className="text-lg" />
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-[#1E40AF] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon icon="lucide:list" className="text-lg" />
              Liste
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (<>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-20 mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Icon icon="lucide:briefcase" className="text-6xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune offre publiée</h3>
              <p className="text-slate-500 mb-6">Commencez par créer votre première offre de stage</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
              >
                <Icon icon="lucide:plus-circle" />
                Publier une Offre
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`group bg-white rounded-3xl border border-slate-200 p-6 card-hover flex flex-col ${
                  offer.status === 'CLOSED' ? 'opacity-75 grayscale-[0.5]' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                      offer.status === 'OPEN'
                        ? 'bg-green-50 text-[#16A34A] border-green-100'
                        : 'bg-red-50 text-[#DC2626] border-red-100'
                    }`}
                  >
                    {offer.status === 'OPEN' ? 'Ouverte' : 'Fermée'}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-[#1E40AF]">
                      <Icon icon="lucide:edit-3" className="text-lg" />
                    </button>
                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-[#DC2626]">
                      <Icon icon="lucide:trash-2" className="text-lg" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#1E40AF] transition-colors">
                  {offer.title}
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Icon icon="lucide:map-pin" className="text-base" />
                    <span>{offer.location || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Icon icon="lucide:clock" className="text-base" />
                    <span>{offer.duration || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Icon icon="lucide:calendar" className="text-base" />
                    <span>Publiée le {formatDate(offer.created_at)}</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                        offer.status === 'OPEN'
                          ? 'bg-[#1E40AF]/10 text-[#1E40AF]'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {offer._count?.applications || 0}
                    </div>
                    <span className="text-sm font-medium text-slate-600">Candidatures</span>
                  </div>
                  {offer.status === 'OPEN' ? (
                    <Link
                      href={`/company/applications?offer=${offer.id}`}
                      className="text-sm font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
                    >
                      Voir détails <Icon icon="lucide:arrow-right" className="text-sm" />
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-slate-400 cursor-not-allowed flex items-center gap-1">
                      Offre Expirée
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </>)}

        {/* List View */}
        {viewMode === 'list' && (<>
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 animate-pulse">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : offers.filter((offer) => offer.status === 'OPEN').length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Icon icon="lucide:inbox" className="text-6xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune offre active</h3>
              <p className="text-slate-500">Toutes vos offres sont fermées ou expirées</p>
            </div>
          ) : (
          <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Titre de l&apos;offre
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Localisation
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight text-center">
                    Durée
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight text-center">
                    Candidatures
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offers.filter((offer) => offer.status === 'OPEN').map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-slate-900">{offer.title}</td>
                    <td className="px-6 py-5 text-slate-500">{offer.location || 'Non spécifié'}</td>
                    <td className="px-6 py-5 text-slate-500 text-center">{offer.duration || 'Non spécifié'}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-green-50 text-[#16A34A] text-[10px] font-bold uppercase rounded-full border border-green-100">
                        Ouverte
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-[#1E40AF]">
                      {offer._count?.applications || 0}
                    </td>
                    <td className="px-6 py-5 text-slate-500">{formatDate(offer.created_at)}</td>
                    <td className="px-6 py-5 text-right space-x-2">
                      <button className="text-[#1E40AF] hover:bg-[#1E40AF]/5 p-2 rounded-lg">
                        <Icon icon="lucide:edit-3" />
                      </button>
                      <button className="text-[#DC2626] hover:bg-red-50 p-2 rounded-lg">
                        <Icon icon="lucide:trash-2" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </>)}
      </main>

      {/* Create Offer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-2xl font-display font-extrabold text-slate-900">
                Publier une Nouvelle Offre
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Icon icon="lucide:x" className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Titre du poste <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: UI/UX Designer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Paris (Télétravail possible)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Durée</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  >
                    <option>1-3 mois</option>
                    <option>3-6 mois</option>
                    <option>6+ mois</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Date limite de candidature <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description du poste <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Détaillez les missions et l'environnement de travail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Compétences requises
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium text-slate-700"
                    >
                      {skill}
                      <Icon
                        icon="lucide:x"
                        className="text-slate-400 cursor-pointer text-sm hover:text-red-500"
                        onClick={() => removeSkill(index)}
                      />
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Ajouter une compétence..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className="bg-transparent border-none outline-none text-sm min-w-[120px] flex-1"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Appuyez sur Entrée pour ajouter une compétence
                </p>
              </div>
            </form>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                disabled={submitting}
                className="px-6 py-3 font-bold text-slate-600 hover:text-slate-900 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#1E40AF] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Publication...
                  </>
                ) : (
                  'Publier l\'Offre'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
