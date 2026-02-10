'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { companyAPI } from '@/lib/api';

export default function CompanyProfilePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    size: '',
    foundedYear: new Date().getFullYear(),
    employeeCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [stats, setStats] = useState({ offersCount: 0, averageRating: 0 });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const company = await companyAPI.getProfile();
      setFormData({
        companyName: company.name || '',
        sector: company.sector || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        description: company.description || '',
        size: company.size || '',
        foundedYear: company.founded_year || new Date().getFullYear(),
        employeeCount: company.employee_count || 0,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setToast({ message: 'Erreur lors du chargement du profil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await companyAPI.getStats();
      setStats({
        offersCount: data.active_offers_count || 0,
        averageRating: data.average_rating || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const getSectorLabel = (sectorCode: string): string => {
    const sectors: Record<string, string> = {
      it: 'TECH & IT',
      finance: 'FINANCE',
      marketing: 'MARKETING',
      health: 'SANTÉ',
      energy: 'ÉNERGIE',
    };
    return sectors[sectorCode] || sectorCode.toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await companyAPI.updateProfile({
        name: formData.companyName,
        sector: formData.sector,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        description: formData.description,
        size: formData.size,
        founded_year: formData.foundedYear,
        employee_count: formData.employeeCount,
      });
      setToast({ message: 'Modifications enregistrées avec succès !', type: 'success' });
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      setToast({ message: error.message || 'Erreur lors de la sauvegarde', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile(); // Reload original data
    setToast({ message: 'Modifications annulées', type: 'info' });
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-8 py-10">
        <div className="flex items-center justify-center h-96">
          <Icon icon="lucide:loader-2" className="text-5xl text-blue-600 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-8 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-display">
              Mon Profil Entreprise
            </h1>
            <p className="text-slate-500 mt-1">
              Gérez l&apos;image de votre marque et les informations visibles par les étudiants.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#1E40AF] rounded-xl hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Icon icon="lucide:loader-2" className="animate-spin" />}
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column (60%) */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            {/* Informations Générales */}
            <div className="card bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <Icon icon="lucide:info" className="text-[#1E40AF] text-2xl" />
                <h2 className="text-xl font-bold text-slate-900">Informations Générales</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-10 mb-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src="https://api.dicebear.com/7.x/shapes/svg?seed=company-logo"
                      alt="Logo"
                      className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 object-cover"
                    />
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-[#1E40AF] shadow-lg transition-all">
                      <Icon icon="lucide:camera" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                    Logo Entreprise
                  </span>
                </div>

                <div className="flex-1 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Nom de l&apos;entreprise
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Ex: TechGlobal Solutions"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Secteur d&apos;activité
                    </label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                    >
                      <option value="it">Technologies de l&apos;Information</option>
                      <option value="finance">Finance & Assurance</option>
                      <option value="marketing">Marketing & Communication</option>
                      <option value="health">Santé & Social</option>
                      <option value="energy">Énergie & Environnement</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Adresse complète
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 resize-none outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+33 1 23 45 67 89"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@entreprise.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Site web
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Icon icon="lucide:link" />
                    </span>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.entreprise.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="card bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Icon icon="lucide:file-text" className="text-[#1E40AF] text-2xl" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Description de l&apos;entreprise
                  </h2>
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Max 500 mots
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#1E40AF] focus-within:ring-1 focus-within:ring-[#1E40AF]">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-4">
                  <button className="text-slate-500 hover:text-slate-900">
                    <Icon icon="lucide:bold" />
                  </button>
                  <button className="text-slate-500 hover:text-slate-900">
                    <Icon icon="lucide:italic" />
                  </button>
                  <button className="text-slate-500 hover:text-slate-900">
                    <Icon icon="lucide:list" />
                  </button>
                  <button className="text-slate-500 hover:text-slate-900">
                    <Icon icon="lucide:link-2" />
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-4 text-slate-900 bg-white resize-none border-none outline-none focus:ring-0"
                  placeholder="Présentez votre entreprise, votre mission et votre culture..."
                />
              </div>
            </div>

            {/* Informations Supplémentaires */}
            <div className="card bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <Icon icon="lucide:plus-circle" className="text-[#1E40AF] text-2xl" />
                <h2 className="text-xl font-bold text-slate-900">Informations Supplémentaires</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Taille de l&apos;entreprise
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  >
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Année de création
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    min="1900"
                    max="2099"
                    step="1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Nb. exact d&apos;employés
                  </label>
                  <input
                    type="number"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 pb-10">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 bg-[#1E40AF] text-white font-bold rounded-2xl hover:bg-blue-900 transition-all shadow-lg flex-1 md:flex-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Icon icon="lucide:loader-2" className="animate-spin" />}
                {saving ? 'Enregistrement...' : 'Enregistrer les changements'}
              </button>
              <button
                onClick={handleCancel}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex-1 md:flex-none"
              >
                Annuler
              </button>
            </div>
          </div>

          {/* Right Column (40%) */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            {/* Aperçu du Profil */}
            <div className="card bg-slate-50 border border-slate-200 rounded-2xl p-1 overflow-hidden shadow-sm">
              <div className="bg-white p-6 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                  Aperçu Étudiant
                </span>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${formData.companyName || 'company'}`}
                    alt="Logo"
                    className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 mb-4"
                  />
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {formData.companyName || 'Nom de l\'entreprise'}
                  </h3>
                  {formData.sector && (
                    <div className="mt-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 uppercase">
                      {getSectorLabel(formData.sector)}
                    </div>
                  )}
                  <p className="mt-4 text-sm text-slate-500 line-clamp-3 px-4">
                    {formData.description || 'Aucune description pour le moment...'}
                  </p>

                  <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#1E40AF]">{stats.offersCount}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Offres Actives
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#1E40AF]">
                        {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Note Moyenne
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-center">
                <button className="text-sm font-bold text-[#1E40AF] hover:underline flex items-center gap-2">
                  <Icon icon="lucide:external-link" />
                  Voir la fiche complète
                </button>
              </div>
            </div>

            {/* Statut du Compte */}
            <div className="card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Statut du Compte</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">État du profil</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-md uppercase">
                    Actif / Vérifié
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Date d&apos;inscription</span>
                  <span className="text-sm font-bold text-slate-900">12 Octobre 2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Dernière mise à jour</span>
                  <span className="text-sm font-bold text-slate-900">Il y a 3 jours</span>
                </div>
              </div>
            </div>

            {/* Actions Rapides */}
            <div className="card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Actions Rapides</h2>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group"
                >
                  <Icon
                    icon="lucide:eye"
                    className="text-slate-400 group-hover:text-[#1E40AF] transition-colors"
                  />
                  <span className="text-sm font-bold">Voir mon profil public</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group"
                >
                  <Icon
                    icon="lucide:download"
                    className="text-slate-400 group-hover:text-[#1E40AF] transition-colors"
                  />
                  <span className="text-sm font-bold">Télécharger mes données</span>
                </a>
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors group">
                    <Icon
                      icon="lucide:trash-2"
                      className="text-red-300 group-hover:text-red-600 transition-colors"
                    />
                    <span className="text-sm font-bold">Désactiver le compte</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto w-full px-6 py-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2024 Stratos Platforms. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Assistance
            </a>
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Mentions Légales
            </a>
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Confidentialité
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
