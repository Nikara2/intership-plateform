'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { applicationsAPI, evaluationsAPI } from '@/lib/api';

interface Application {
  id: string;
  student: {
    first_name: string;
    last_name: string;
    email: string;
  };
  offer: {
    title: string;
  };
  applied_at: string;
  status: string;
}

interface Evaluation {
  id: string;
  application_id: string;
  score: number;
  comment?: string;
  evaluated_at: string;
  application?: Application;
}

interface ApplicationWithEval extends Application {
  evaluation?: Evaluation;
}

export default function CompanyEvaluationsPage() {
  const [applications, setApplications] = useState<ApplicationWithEval[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithEval | null>(null);

  const [score, setScore] = useState(85);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all applications and evaluations
      const [appsData, evalsData] = await Promise.all([
        applicationsAPI.getAll(),
        evaluationsAPI.getAll(),
      ]);

      // Filter only COMPLETED applications
      const completedApps = appsData.filter((app: Application) => app.status === 'COMPLETED');

      // Map evaluations to their applications
      const evaluationsMap = new Map(
        evalsData.map((e: Evaluation) => [e.application_id, e])
      );

      const appsWithEvals = completedApps.map((app: Application) => ({
        ...app,
        evaluation: evaluationsMap.get(app.id),
      }));

      setApplications(appsWithEvals);
      setEvaluations(evalsData);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const openEvaluateModal = (app: ApplicationWithEval) => {
    setSelectedApplication(app);
    setScore(85);
    setComment('');
    setShowEvaluateModal(true);
  };

  const openViewModal = (app: ApplicationWithEval) => {
    setSelectedApplication(app);
    setShowViewModal(true);
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;

    try {
      setSubmitting(true);
      await evaluationsAPI.create({
        application_id: selectedApplication.id,
        score,
        comment: comment.trim() || undefined,
      });

      // Refresh data
      await fetchData();
      setShowEvaluateModal(false);
      setSelectedApplication(null);
    } catch (err: any) {
      console.error('Failed to submit evaluation:', err);
      alert('Erreur lors de la soumission: ' + (err.message || 'Erreur inconnue'));
    } finally {
      setSubmitting(false);
    }
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

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Très Bien';
    if (score >= 70) return 'Bien';
    if (score >= 60) return 'Assez Bien';
    return 'Insuffisant';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icon icon="lucide:loader-2" className="text-5xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des évaluations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icon icon="lucide:alert-circle" className="text-5xl text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
              {applications.length} stage{applications.length > 1 ? 's' : ''} terminé{applications.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <Icon icon="lucide:clipboard-list" className="text-6xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun stage terminé</h3>
            <p className="text-slate-500">
              Les stagiaires dont le stage est terminé apparaîtront ici pour être évalués.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((app) => {
              const studentName = `${app.student.first_name} ${app.student.last_name}`;
              const isEvaluated = !!app.evaluation;

              return (
                <div
                  key={app.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-6"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-teal-500 shrink-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {app.student.first_name[0]}{app.student.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{studentName}</h3>
                        <p className="text-[#1E40AF] font-medium">{app.offer.title}</p>
                      </div>
                      {isEvaluated ? (
                        <div className="flex flex-col items-end">
                          <span className={`text-3xl font-black leading-none ${getScoreTextColor(app.evaluation!.score)}`}>
                            {app.evaluation!.score}
                            <span className="text-base font-medium">/100</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {getScoreLabel(app.evaluation!.score)}
                          </span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
                          À évaluer
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                      <Icon icon="lucide:calendar-check" />
                      <span>Terminé le {formatDate(app.applied_at)}</span>
                    </div>
                    <div className="mt-auto pt-6">
                      {isEvaluated ? (
                        <button
                          onClick={() => openViewModal(app)}
                          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Icon icon="lucide:eye" />
                          Voir l&apos;évaluation
                        </button>
                      ) : (
                        <button
                          onClick={() => openEvaluateModal(app)}
                          className="w-full py-2.5 bg-[#1E40AF] hover:bg-blue-900 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Icon icon="lucide:clipboard-check" />
                          Évaluer maintenant
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Evaluate Modal */}
      {showEvaluateModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Évaluer {selectedApplication.student.first_name} {selectedApplication.student.last_name}
                </h2>
                <p className="text-slate-500">{selectedApplication.offer.title}</p>
              </div>
              <button
                onClick={() => setShowEvaluateModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Icon icon="lucide:x" className="text-2xl text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitEvaluation} className="flex-1 overflow-y-auto p-8">
              <div className="space-y-8">
                {/* Global Score */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center text-sm">
                      01
                    </span>
                    Score Global
                  </h3>
                  <div className="bg-slate-50 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 w-full space-y-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-bold text-slate-700">
                          Score de performance <span className="text-red-500">*</span>
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
                        required
                      />
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Insuffisant</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div
                      className={`w-32 h-32 rounded-full border-8 border-white shadow-xl flex flex-col items-center justify-center shrink-0 ${getScoreColor(score)}`}
                    >
                      <span className="text-4xl font-black text-white">{score}</span>
                      <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                        {getScoreLabel(score)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Comments */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center text-sm">
                      02
                    </span>
                    Commentaire
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Commentaire d&apos;évaluation (optionnel)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={6}
                      placeholder="Décrivez la performance du stagiaire, ses points forts et axes d'amélioration..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E40AF] resize-none"
                    />
                  </div>
                </section>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-white border-t border-slate-200 flex flex-col md:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEvaluateModal(false)}
                disabled={submitting}
                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmitEvaluation}
                disabled={submitting}
                className="px-8 py-3 bg-[#1E40AF] text-white font-bold hover:bg-blue-900 rounded-xl shadow-lg shadow-blue-800/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Icon icon="lucide:loader-2" className="animate-spin" />
                    Soumission...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:check" />
                    Soumettre l&apos;évaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedApplication && selectedApplication.evaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Évaluation de {selectedApplication.student.first_name} {selectedApplication.student.last_name}
                </h2>
                <p className="text-slate-500">{selectedApplication.offer.title}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Icon icon="lucide:x" className="text-2xl text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div
                    className={`w-40 h-40 rounded-full border-8 border-white flex flex-col items-center justify-center shadow-xl shrink-0 ${getScoreColor(selectedApplication.evaluation.score)}`}
                  >
                    <span className="text-5xl font-black text-white">{selectedApplication.evaluation.score}</span>
                    <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                      {getScoreLabel(selectedApplication.evaluation.score)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Évalué le
                    </p>
                    <p className="text-xl font-bold text-slate-900 mb-4">
                      {formatDate(selectedApplication.evaluation.evaluated_at)}
                    </p>
                    {selectedApplication.evaluation.comment && (
                      <>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Commentaire
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                          {selectedApplication.evaluation.comment}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
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
