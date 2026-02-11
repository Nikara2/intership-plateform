'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { auth, api } from '@/lib/api';
import Link from 'next/link';

interface Student {
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
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

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

    fetchStudents();
  }, [router]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.get('/students');
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.school?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Level filter
    if (filterLevel) {
      filtered = filtered.filter((student) => student.level === filterLevel);
    }

    // School filter
    if (filterSchool) {
      filtered = filtered.filter((student) => student.school === filterSchool);
    }

    setFilteredStudents(filtered);
  }, [searchQuery, filterLevel, filterSchool, students]);

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    try {
      setDeleting(true);
      await api.delete(`/students/${selectedStudent.id}`);
      setStudents(students.filter((s) => s.id !== selectedStudent.id));
      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const uniqueLevels = Array.from(new Set(students.map((s) => s.level).filter(Boolean)));
  const uniqueSchools = Array.from(new Set(students.map((s) => s.school).filter(Boolean)));

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
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Étudiants</h1>

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
                    placeholder="Rechercher par nom, email, école..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Level Filter */}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Tous les niveaux</option>
                {uniqueLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              {/* School Filter */}
              <select
                value={filterSchool}
                onChange={(e) => setFilterSchool(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Toutes les écoles</option>
                {uniqueSchools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(searchQuery || filterLevel || filterSchool) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterLevel('');
                    setFilterSchool('');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-700">{filteredStudents.length}</span> étudiant
                {filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Icon icon="lucide:loader-2" className="text-5xl text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-500">Chargement des étudiants...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center">
                <Icon icon="lucide:users-2" className="text-6xl text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">Aucun étudiant trouvé</p>
                <p className="text-sm text-slate-400 mt-1">
                  {searchQuery || filterLevel || filterSchool
                    ? 'Essayez de modifier vos filtres'
                    : 'Aucun étudiant inscrit pour le moment'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4 text-left">Étudiant</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">École</th>
                      <th className="px-6 py-4 text-left">Programme</th>
                      <th className="px-6 py-4 text-left">Niveau</th>
                      <th className="px-6 py-4 text-left">Statut</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.first_name}`}
                              className="w-10 h-10 rounded-full bg-slate-100"
                              alt="Avatar"
                            />
                            <div>
                              <p className="font-bold text-slate-900">
                                {student.first_name} {student.last_name}
                              </p>
                              {student.phone && (
                                <p className="text-xs text-slate-500">{student.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {student.user?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {student.school || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {student.program || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {student.level ? (
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                              {student.level}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {student.user?.is_active ? (
                            <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Actif
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                              <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                              Inactif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/students/${student.id}`}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir les détails"
                            >
                              <Icon icon="lucide:eye" className="text-lg" />
                            </Link>
                            <Link
                              href={`/admin/students/${student.id}/edit`}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Icon icon="lucide:pencil" className="text-lg" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(student)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Icon icon="lucide:trash-2" className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Icon icon="lucide:alert-triangle" className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirmer la suppression</h3>
                <p className="text-sm text-slate-500">Cette action est irréversible</p>
              </div>
            </div>

            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'étudiant{' '}
              <span className="font-bold">
                {selectedStudent.first_name} {selectedStudent.last_name}
              </span>{' '}
              ? Toutes ses données seront définitivement perdues.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStudent(null);
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Icon icon="lucide:loader-2" className="animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <span>Supprimer</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
