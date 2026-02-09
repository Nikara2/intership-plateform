'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

interface Intern {
  id: number;
  name: string;
  role: string;
  avatar: string;
  period: string;
  status: 'pending' | 'evaluated';
  score?: number;
  scoreLabel?: string;
}

export default function CompanyEvaluationsPage() {
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [score, setScore] = useState(85);

  const interns: Intern[] = [
    {
      id: 1,
      name: 'Thomas Bernard',
      role: 'Développeur Fullstack Junior',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
      period: '01 Juin 2024 - 31 Août 2024',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Clara Morel',
      role: 'Designer UX/UI',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara',
      period: '15 Mai 2024 - 15 Août 2024',
      status: 'evaluated',
      score: 92,
      scoreLabel: 'Excellent',
    },
    {
      id: 3,
      name: 'Julian Vazquez',
      role: 'Assistant Marketing',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
      period: '01 Mars 2024 - 30 Juin 2024',
      status: 'evaluated',
      score: 74,
      scoreLabel: 'Bon',
    },
    {
      id: 4,
      name: 'Emma Lemoine',
      role: 'Chargée de Recrutement',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      period: '01 Juin 2024 - 31 Déc 2024',
      status: 'pending',
    },
  ];

  const openEvaluateModal = (intern: Intern) => {
    setSelectedIntern(intern);
    setShowEvaluateModal(true);
  };

  const openViewModal = (intern: Intern) => {
    setSelectedIntern(intern);
    setShowViewModal(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-600';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-600';
  };

  return (
    <>
      <main className="flex-1 max-w-[1440px] mx-auto px-8 py-10 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Évaluation des Stagiaires
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Suivez et évaluez la performance de vos talents en formation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Icon icon="lucide:download" />
              Exporter (.csv)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Icon
                icon="lucide:search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl"
              />
              <input
                type="text"
                placeholder="Rechercher un stagiaire..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1E40AF] outline-none transition-all"
              />
            </div>
            <select className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1E40AF] outline-none transition-all appearance-none cursor-pointer">
              <option value="all">Tous les status</option>
              <option value="pending">À évaluer</option>
              <option value="done">Évalués</option>
            </select>
            <div className="relative">
              <Icon
                icon="lucide:calendar"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl"
              />
              <input
                type="text"
                placeholder="Période de stage"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1E40AF] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Interns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {interns.map((intern) => (
            <div
              key={intern.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-6"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <img src={intern.avatar} alt={intern.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{intern.name}</h3>
                    <p className="text-[#1E40AF] font-medium">{intern.role}</p>
                  </div>
                  {intern.status === 'pending' ? (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      À évaluer
                    </span>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className={`text-3xl font-black leading-none ${getScoreTextColor(intern.score!)}`}>
                        {intern.score}
                        <span className="text-base font-medium">/100</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        {intern.scoreLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                  <Icon icon="lucide:calendar-range" />
                  <span>{intern.period}</span>
                </div>
                <div className="mt-auto pt-6">
                  {intern.status === 'pending' ? (
                    <button
                      onClick={() => openEvaluateModal(intern)}
                      className="w-full py-2.5 bg-[#1E40AF] hover:bg-blue-900 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Icon icon="lucide:clipboard-check" />
                      Évaluer maintenant
                    </button>
                  ) : (
                    <button
                      onClick={() => openViewModal(intern)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Icon icon="lucide:eye" />
                      Voir l&apos;évaluation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Evaluate Modal */}
      {showEvaluateModal && selectedIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedIntern.avatar}
                  alt={selectedIntern.name}
                  className="w-14 h-14 rounded-xl border border-white shadow-sm"
                />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Évaluer {selectedIntern.name}
                  </h2>
                  <p className="text-slate-500">
                    {selectedIntern.role} • {selectedIntern.period}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEvaluateModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Icon icon="lucide:x" className="text-2xl text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <form className="space-y-10">
                {/* Supervisor Info */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center text-sm">
                      01
                    </span>
                    Informations Superviseur
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nom du superviseur</label>
                      <input
                        type="text"
                        placeholder="Ex: Jean Dupont"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Poste du superviseur
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: CTO"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                  </div>
                </section>

                {/* Global Score */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center text-sm">
                      02
                    </span>
                    Évaluation Globale
                  </h3>
                  <div className="bg-slate-50 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 w-full space-y-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-bold text-slate-700">
                          Score de performance
                        </label>
                        <span className="text-[#1E40AF] font-black">{score}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E40AF]"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Insuffisant</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div
                      className={`w-40 h-40 rounded-full border-8 border-white shadow-xl flex flex-col items-center justify-center shrink-0 ${getScoreColor(score)}`}
                    >
                      <span className="text-4xl font-black text-white">{score}</span>
                      <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                        Score
                      </span>
                    </div>
                  </div>
                </section>

                {/* Criteria */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center text-sm">
                      03
                    </span>
                    Critères détaillés
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Compétences techniques</span>
                      <div className="flex gap-1 text-xl text-amber-400">
                        {[1, 2, 3, 4].map((i) => (
                          <Icon key={i} icon="ic:round-star" />
                        ))}
                        <Icon icon="ic:round-star-outline" className="text-slate-300" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Communication</span>
                      <div className="flex gap-1 text-xl text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Icon key={i} icon="ic:round-star" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Comportement professionnel</span>
                      <div className="flex gap-1 text-xl text-amber-400">
                        {[1, 2, 3].map((i) => (
                          <Icon key={i} icon="ic:round-star" />
                        ))}
                        <Icon icon="ic:round-star-half" />
                        <Icon icon="ic:round-star-outline" className="text-slate-300" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Travail d&apos;équipe</span>
                      <div className="flex gap-1 text-xl text-amber-400">
                        {[1, 2, 3, 4].map((i) => (
                          <Icon key={i} icon="ic:round-star" />
                        ))}
                        <Icon icon="ic:round-star-outline" className="text-slate-300" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Comments */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center text-sm">
                      04
                    </span>
                    Commentaires
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Commentaire général <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Décrivez la progression globale du stagiaire..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF] resize-none"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-green-700">Points forts</label>
                        <textarea
                          rows={3}
                          placeholder="Qu'est-ce qui a été particulièrement bien fait ?"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-600 resize-none"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-amber-700">
                          Axes d&apos;amélioration
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Quels sont les points à travailler ?"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recommendation */}
                <section className="bg-blue-50 p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h4 className="font-bold text-slate-900">Recommandation finale</h4>
                      <p className="text-sm text-slate-600">
                        Souhaitez-vous retravailler avec ce profil ?
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <label className="cursor-pointer flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-slate-200 hover:border-[#1E40AF] transition-all">
                        <input type="radio" name="recommend" className="w-4 h-4 text-[#1E40AF]" />
                        <span className="font-bold text-slate-700">Oui</span>
                      </label>
                      <label className="cursor-pointer flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-slate-200 hover:border-[#1E40AF] transition-all">
                        <input type="radio" name="recommend" className="w-4 h-4 text-[#1E40AF]" />
                        <span className="font-bold text-slate-700">Non</span>
                      </label>
                    </div>
                  </div>
                </section>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-white border-t border-slate-200 flex flex-col md:flex-row justify-end gap-3">
              <button
                onClick={() => setShowEvaluateModal(false)}
                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
              >
                Annuler
              </button>
              <button className="px-6 py-3 text-[#1E40AF] bg-blue-50 border border-blue-200 font-bold hover:bg-blue-100 rounded-xl transition-all">
                Enregistrer brouillon
              </button>
              <button className="px-8 py-3 bg-[#1E40AF] text-white font-bold hover:bg-blue-900 rounded-xl shadow-lg shadow-blue-800/20 transition-all">
                Soumettre l&apos;évaluation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedIntern.avatar}
                  alt={selectedIntern.name}
                  className="w-14 h-14 rounded-xl border border-white shadow-sm"
                />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Évaluation de {selectedIntern.name}
                  </h2>
                  <p className="text-slate-500">
                    {selectedIntern.role} • {selectedIntern.period}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <Icon icon="lucide:edit-3" className="text-2xl text-slate-500" />
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <Icon icon="lucide:x" className="text-2xl text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div
                    className={`w-40 h-40 rounded-full border-8 border-green-50 flex flex-col items-center justify-center shadow-inner shrink-0 ${getScoreColor(selectedIntern.score!)}`}
                  >
                    <span className="text-5xl font-black text-white">{selectedIntern.score}</span>
                    <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                      {selectedIntern.scoreLabel}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Rapport du superviseur
                    </p>
                    <p className="text-xl font-bold text-slate-900 mb-2">Sarah Jenkins — Creative Director</p>
                    <p className="text-slate-600 italic leading-relaxed">
                      &ldquo;{selectedIntern.name} a été un atout majeur pour l&apos;équipe. Sa capacité à
                      comprendre les problématiques complexes et à proposer des solutions élégantes est
                      remarquable pour son niveau.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Compétences techniques</span>
                    <span className="font-bold text-slate-900">4.5 / 5</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Communication</span>
                    <span className="font-bold text-slate-900">5.0 / 5</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Travail d&apos;équipe</span>
                    <span className="font-bold text-slate-900">4.8 / 5</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Autonomie</span>
                    <span className="font-bold text-slate-900">4.2 / 5</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-green-700 font-bold mb-3 flex items-center gap-2">
                      <Icon icon="lucide:check-circle" />
                      Points Forts
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Prototypage rapide, excellente maîtrise de Figma, grand sens de l&apos;empathie
                      utilisateur et ponctualité exemplaire.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-amber-700 font-bold mb-3 flex items-center gap-2">
                      <Icon icon="lucide:trending-up" />
                      Axes d&apos;amélioration
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Prendre plus de leadership lors des présentations client, continuer à approfondir
                      les connaissances en design system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2">
                <Icon icon="lucide:file-text" />
                Télécharger PDF
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-8 py-3 bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
