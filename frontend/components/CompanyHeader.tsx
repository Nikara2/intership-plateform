'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { auth, applicationsAPI, evaluationsAPI } from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'application' | 'evaluation' | 'system';
  time: string;
  read: boolean;
  link?: string;
}

export default function CompanyHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserEmail(auth.getEmail() || '');
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [applications, evaluations] = await Promise.all([
        applicationsAPI.getAll(),
        evaluationsAPI.getAll().catch(() => []), // Fallback if evaluations fail
      ]);

      const notifs: Notification[] = [];
      const now = new Date();

      // Get application IDs that have been evaluated
      const evaluatedAppIds = new Set(evaluations.map((e: any) => e.application_id));

      // Recent applications (last 7 days)
      const recentApps = applications
        .filter((app: any) => {
          const appliedDate = new Date(app.applied_at);
          const daysDiff = (now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7 && app.status === 'PENDING';
        })
        .slice(0, 5); // Limit to 5 most recent

      recentApps.forEach((app: any) => {
        const appliedDate = new Date(app.applied_at);
        const timeAgo = getTimeAgo(appliedDate);

        notifs.push({
          id: `app-${app.id}`,
          title: 'Nouvelle candidature',
          message: `${app.student?.first_name} ${app.student?.last_name} a postulé pour ${app.offer?.title}`,
          type: 'application',
          time: timeAgo,
          read: false,
          link: '/company/applications',
        });
      });

      // Applications completed but not evaluated
      const needsEvaluation = applications.filter(
        (app: any) => app.status === 'COMPLETED' && !evaluatedAppIds.has(app.id)
      );

      needsEvaluation.forEach((app: any) => {
        notifs.push({
          id: `eval-${app.id}`,
          title: 'Évaluation requise',
          message: `Le stage de ${app.student?.first_name} ${app.student?.last_name} est terminé`,
          type: 'evaluation',
          time: 'En attente',
          read: false,
          link: '/company/evaluations',
        });
      });

      // Sort by type priority and time
      const sortedNotifs = notifs.sort((a, b) => {
        const typePriority: any = { evaluation: 0, application: 1, system: 2 };
        return typePriority[a.type] - typePriority[b.type];
      });

      setNotifications(sortedNotifs);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [notificationsOpen]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    auth.logout();
    router.push('/');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
      setNotificationsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return 'lucide:user-plus';
      case 'evaluation':
        return 'lucide:clipboard-check';
      case 'system':
        return 'lucide:bell';
      default:
        return 'lucide:bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'text-blue-600 bg-blue-50';
      case 'evaluation':
        return 'text-green-600 bg-green-50';
      case 'system':
        return 'text-slate-600 bg-slate-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const navLinks = [
    { href: '/company/dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
    { href: '/company/offers', label: 'Mes Offres', icon: 'lucide:briefcase' },
    { href: '/company/applications', label: 'Candidatures', icon: 'lucide:users' },
    { href: '/company/evaluations', label: 'Évaluations', icon: 'lucide:clipboard-check' },
    { href: '/company/profile', label: 'Mon Profil', icon: 'lucide:user' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/company/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center text-white">
              <Icon icon="lucide:graduation-cap" className="text-xl sm:text-2xl" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Stage<span className="text-[#F59E0B]">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-slate-900 font-semibold border-b-2 border-[#1E40AF] py-1'
                    : 'text-slate-500 hover:text-[#1E40AF]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) {
                    fetchNotifications(); // Refresh on open
                  }
                }}
                className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
              >
                <Icon icon="lucide:bell" className="text-xl sm:text-2xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                      <p className="text-xs text-slate-500">
                        {loading
                          ? 'Chargement...'
                          : unreadCount > 0
                          ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
                          : 'Tout lu'}
                      </p>
                    </div>
                    {unreadCount > 0 && !loading && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Tout marquer lu
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                      <div className="px-6 py-12 text-center">
                        <Icon icon="lucide:loader-2" className="text-4xl text-blue-600 mx-auto mb-3 animate-spin" />
                        <p className="text-slate-500 text-sm">Chargement des notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-6 py-12 text-center">
                        <Icon icon="lucide:bell-off" className="text-5xl text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">Aucune notification</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getNotificationColor(
                                notification.type
                              )}`}
                            >
                              <Icon icon={getNotificationIcon(notification.type)} className="text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4
                                  className={`text-sm font-semibold ${
                                    !notification.read ? 'text-slate-900' : 'text-slate-700'
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-slate-400">{notification.time}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && !loading && (
                    <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
                      <button
                        onClick={() => {
                          fetchNotifications();
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold w-full text-center flex items-center justify-center gap-2"
                      >
                        <Icon icon="lucide:refresh-cw" className="text-base" />
                        Actualiser
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile - Desktop */}
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{userEmail}</p>
                <p className="text-xs text-slate-500">Recruteur</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-100 hover:border-[#1E40AF] transition-all"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}&backgroundColor=1e40af`}
                  alt="User avatar"
                />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Icon
                icon={mobileMenuOpen ? 'lucide:x' : 'lucide:menu'}
                className="text-2xl transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-100">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}&backgroundColor=1e40af`}
                  alt="User avatar"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{userEmail}</p>
                <p className="text-xs text-slate-500">Recruteur</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icon icon="lucide:x" className="text-xl" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-[#1E40AF] font-semibold border-r-4 border-[#1E40AF]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={link.icon} className="text-xl" />
                <span className="text-base">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="px-6 py-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-colors"
            >
              <Icon icon="lucide:log-out" className="text-xl" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
