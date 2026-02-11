'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth, api } from '@/lib/api';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'platform'>(
    'general'
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newApplications: true,
    newAccounts: true,
    weeklyReport: true,
    systemUpdates: false,
  });

  // Platform Settings
  const [platformSettings, setPlatformSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: false,
    defaultOfferDuration: 30,
    maxApplicationsPerStudent: 10,
    autoCloseExpiredOffers: true,
  });

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

    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const settings = await api.get('/settings');

      // Map backend settings to frontend state
      setGeneralSettings({
        language: settings.language || 'fr',
        timezone: settings.timezone || 'Europe/Paris',
        dateFormat: settings.date_format || 'DD/MM/YYYY',
        theme: settings.theme || 'light',
      });

      setNotificationSettings({
        emailNotifications: settings.email_notifications ?? true,
        newApplications: settings.new_applications ?? true,
        newAccounts: settings.new_accounts ?? true,
        weeklyReport: settings.weekly_report ?? true,
        systemUpdates: settings.system_updates ?? false,
      });

      setPlatformSettings({
        allowRegistration: settings.allow_registration ?? true,
        requireEmailVerification: settings.require_email_verification ?? false,
        defaultOfferDuration: settings.default_offer_duration || 30,
        maxApplicationsPerStudent: settings.max_applications_per_student || 10,
        autoCloseExpiredOffers: settings.auto_close_expired_offers ?? true,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
      showToast('Erreur lors du chargement des paramètres', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await api.patch('/settings', {
        language: generalSettings.language,
        timezone: generalSettings.timezone,
        date_format: generalSettings.dateFormat,
        theme: generalSettings.theme,
      });
      showToast('Paramètres généraux enregistrés', 'success');
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (securitySettings.newPassword.length < 6) {
      showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    try {
      setSaving(true);
      await api.post('/auth/change-password', {
        currentPassword: securitySettings.currentPassword,
        newPassword: securitySettings.newPassword,
      });
      showToast('Mot de passe modifié avec succès', 'success');
      setSecuritySettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      showToast(error.message || 'Erreur lors du changement de mot de passe', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await api.patch('/settings', {
        email_notifications: notificationSettings.emailNotifications,
        new_applications: notificationSettings.newApplications,
        new_accounts: notificationSettings.newAccounts,
        weekly_report: notificationSettings.weeklyReport,
        system_updates: notificationSettings.systemUpdates,
      });
      showToast('Préférences de notification enregistrées', 'success');
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlatform = async () => {
    setSaving(true);
    try {
      await api.patch('/settings', {
        allow_registration: platformSettings.allowRegistration,
        require_email_verification: platformSettings.requireEmailVerification,
        default_offer_duration: platformSettings.defaultOfferDuration,
        max_applications_per_student: platformSettings.maxApplicationsPerStudent,
        auto_close_expired_offers: platformSettings.autoCloseExpiredOffers,
      });
      showToast('Paramètres de la plateforme enregistrés', 'success');
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <Icon
              icon={toast.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'}
              className="text-2xl"
            />
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

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
          <h1 className="text-2xl font-bold text-slate-800">Paramètres</h1>

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
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="border-b border-slate-200 px-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === 'general'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-500 border-transparent hover:text-slate-700'
                    }`}
                  >
                    <Icon icon="lucide:sliders" />
                    Général
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === 'security'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-500 border-transparent hover:text-slate-700'
                    }`}
                  >
                    <Icon icon="lucide:shield" />
                    Sécurité
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === 'notifications'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-500 border-transparent hover:text-slate-700'
                    }`}
                  >
                    <Icon icon="lucide:bell" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab('platform')}
                    className={`py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === 'platform'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-500 border-transparent hover:text-slate-700'
                    }`}
                  >
                    <Icon icon="lucide:server" />
                    Plateforme
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* General Settings Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-4">Préférences Générales</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Langue de l'interface
                          </label>
                          <select
                            value={generalSettings.language}
                            onChange={(e) =>
                              setGeneralSettings({ ...generalSettings, language: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Fuseau horaire
                          </label>
                          <select
                            value={generalSettings.timezone}
                            onChange={(e) =>
                              setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                            <option value="America/New_York">America/New York (GMT-5)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Format de date
                          </label>
                          <select
                            value={generalSettings.dateFormat}
                            onChange={(e) =>
                              setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Thème</label>
                          <select
                            value={generalSettings.theme}
                            onChange={(e) =>
                              setGeneralSettings({ ...generalSettings, theme: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="light">Clair</option>
                            <option value="dark">Sombre</option>
                            <option value="auto">Automatique</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveGeneral}
                        disabled={saving}
                        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Icon icon="lucide:loader-2" className="animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Icon icon="lucide:save" />
                            Enregistrer les Modifications
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Settings Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-4">Changer le Mot de Passe</h2>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Mot de passe actuel
                          </label>
                          <input
                            type="password"
                            value={securitySettings.currentPassword}
                            onChange={(e) =>
                              setSecuritySettings({
                                ...securitySettings,
                                currentPassword: e.target.value,
                              })
                            }
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            value={securitySettings.newPassword}
                            onChange={(e) =>
                              setSecuritySettings({
                                ...securitySettings,
                                newPassword: e.target.value,
                              })
                            }
                            required
                            minLength={6}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                          />
                          <p className="text-xs text-slate-500 mt-1">Minimum 6 caractères</p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Confirmer le nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            value={securitySettings.confirmPassword}
                            onChange={(e) =>
                              setSecuritySettings({
                                ...securitySettings,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                            minLength={6}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={saving}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving ? (
                            <>
                              <Icon icon="lucide:loader-2" className="animate-spin" />
                              Modification...
                            </>
                          ) : (
                            <>
                              <Icon icon="lucide:lock" />
                              Modifier le Mot de Passe
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <h3 className="text-base font-bold text-slate-900 mb-3">Sécurité du Compte</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Icon icon="lucide:info" className="text-blue-600 text-xl mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Conseils de sécurité
                            </p>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Utilisez un mot de passe unique et complexe</li>
                              <li>• Changez votre mot de passe régulièrement</li>
                              <li>• Ne partagez jamais vos identifiants</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-4">
                        Préférences de Notification
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">Notifications par Email</p>
                            <p className="text-sm text-slate-600">
                              Recevoir des notifications par email
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailNotifications}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  emailNotifications: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">Nouvelles Candidatures</p>
                            <p className="text-sm text-slate-600">
                              Notification lors de nouvelles candidatures
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.newApplications}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  newApplications: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">Nouveaux Comptes</p>
                            <p className="text-sm text-slate-600">
                              Notification lors de l'inscription de nouveaux utilisateurs
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.newAccounts}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  newAccounts: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">Rapport Hebdomadaire</p>
                            <p className="text-sm text-slate-600">
                              Recevoir un résumé hebdomadaire des activités
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.weeklyReport}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  weeklyReport: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">Mises à Jour du Système</p>
                            <p className="text-sm text-slate-600">
                              Notification lors de mises à jour de la plateforme
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.systemUpdates}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  systemUpdates: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveNotifications}
                        disabled={saving}
                        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Icon icon="lucide:loader-2" className="animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Icon icon="lucide:save" />
                            Enregistrer les Préférences
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Platform Settings Tab */}
                {activeTab === 'platform' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-4">
                        Configuration de la Plateforme
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">Autoriser les Inscriptions</p>
                            <p className="text-sm text-slate-600">
                              Permettre aux nouveaux utilisateurs de s'inscrire
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={platformSettings.allowRegistration}
                              onChange={(e) =>
                                setPlatformSettings({
                                  ...platformSettings,
                                  allowRegistration: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">Vérification Email Requise</p>
                            <p className="text-sm text-slate-600">
                              Les nouveaux utilisateurs doivent vérifier leur email
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={platformSettings.requireEmailVerification}
                              onChange={(e) =>
                                setPlatformSettings({
                                  ...platformSettings,
                                  requireEmailVerification: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-900">
                              Fermeture Automatique des Offres Expirées
                            </p>
                            <p className="text-sm text-slate-600">
                              Fermer automatiquement les offres après leur date d'expiration
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={platformSettings.autoCloseExpiredOffers}
                              onChange={(e) =>
                                setPlatformSettings({
                                  ...platformSettings,
                                  autoCloseExpiredOffers: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg">
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Durée par Défaut des Offres (jours)
                          </label>
                          <input
                            type="number"
                            value={platformSettings.defaultOfferDuration}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                defaultOfferDuration: Number(e.target.value),
                              })
                            }
                            min={1}
                            max={365}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Nombre de jours avant qu'une offre expire automatiquement
                          </p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg">
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Candidatures Maximum par Étudiant
                          </label>
                          <input
                            type="number"
                            value={platformSettings.maxApplicationsPerStudent}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                maxApplicationsPerStudent: Number(e.target.value),
                              })
                            }
                            min={1}
                            max={50}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Nombre maximum de candidatures simultanées par étudiant
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleSavePlatform}
                        disabled={saving}
                        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Icon icon="lucide:loader-2" className="animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Icon icon="lucide:save" />
                            Enregistrer la Configuration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:info" className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Note Importante</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Les modifications apportées aux paramètres de la plateforme affecteront tous les
                    utilisateurs. Assurez-vous de bien comprendre l'impact de chaque paramètre avant de
                    les modifier. Les préférences personnelles (langue, thème) n'affectent que votre
                    compte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
