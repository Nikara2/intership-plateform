'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Header/Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center">
              <Icon icon="lucide:graduation-cap" className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-blue-800 tracking-tight">StagiaireConnect</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="font-medium text-slate-600 hover:text-blue-800 transition-colors">Accueil</a>
            <a href="#" className="font-medium text-slate-600 hover:text-blue-800 transition-colors">Fonctionnalités</a>
            <a href="#" className="font-medium text-slate-600 hover:text-blue-800 transition-colors">À Propos</a>
            <a href="#" className="font-medium text-slate-600 hover:text-blue-800 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 font-semibold text-blue-800 hover:bg-blue-50 rounded-lg transition-all">
              Connexion
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/20 transition-all">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              Nouvelle version 2.0 disponible
            </div>
            <h1 className="text-6xl font-bold leading-[1.1] text-slate-900">
              Simplifiez la Gestion de vos <span className="text-blue-800">Stages</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              La plateforme tout-en-un qui connecte intelligemment les étudiants, les entreprises et les établissements scolaires pour une expérience de stage réussie.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/company/register" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xl shadow-amber-500/30 transition-all flex items-center gap-2">
                <Icon icon="lucide:building-2" />
                Inscription Entreprise
              </Link>
              <Link href="/admin/register" className="px-8 py-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl shadow-xl shadow-blue-800/30 transition-all flex items-center gap-2">
                <Icon icon="lucide:school" />
                Inscription École
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" alt="User" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Rejoignez plus de <span className="text-blue-800 font-bold">500+</span> étudiants satisfaits
              </p>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-blue-100/50 rounded-3xl blur-2xl"></div>
            <img
              src="/images/502491791_1274080558050557_3304542214959109297_n.jpg"
              alt="Dashboard Preview"
              className="relative z-10 rounded-2xl shadow-2xl animate-float border border-slate-200"
            />
            <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Icon icon="lucide:check-circle" className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Nouvelle offre</p>
                <p className="text-sm font-bold">UX Designer @Google</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Une solution pour chaque acteur</h2>
            <p className="text-lg text-slate-600">Notre plateforme s&apos;adapte à vos besoins spécifiques pour fluidifier les échanges.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Students */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 card-hover">
              <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-6">
                <Icon icon="lucide:graduation-cap" className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Pour les Étudiants</h3>
              <p className="text-slate-600 mb-6 italic">Trouvez votre stage idéal sans effort et lancez votre carrière.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:search" className="text-blue-800" />
                  Recherche facile par critères
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:file-text" className="text-blue-800" />
                  Candidature simple en 1 clic
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:clock" className="text-blue-800" />
                  Suivi en temps réel des étapes
                </li>
              </ul>
            </div>

            {/* Companies */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 card-hover">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Icon icon="lucide:building-2" className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Pour les Entreprises</h3>
              <p className="text-slate-600 mb-6 italic">Recrutez les meilleurs talents et automatisez votre gestion.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:megaphone" className="text-amber-500" />
                  Publication d&apos;offres ciblées
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:users" className="text-amber-500" />
                  Gestion simplifiée des candidatures
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:star" className="text-amber-500" />
                  Évaluation intuitive des stagiaires
                </li>
              </ul>
            </div>

            {/* Schools */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 card-hover">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Icon icon="lucide:school" className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Pour les Écoles</h3>
              <p className="text-slate-600 mb-6 italic">Pilotez efficacement le parcours de vos élèves.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:layout-dashboard" className="text-green-600" />
                  Tableau de bord global
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:bar-chart-3" className="text-green-600" />
                  Statistiques de placement détaillées
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Icon icon="lucide:shield-check" className="text-green-600" />
                  Suivi complet et validation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Fonctionnalités Puissantes</h2>
              <p className="text-lg text-slate-600">Tout ce dont vous avez besoin pour une gestion sans friction.</p>
            </div>
            <div className="hidden md:block">
              <a href="#" className="text-blue-800 font-bold flex items-center gap-2 group hover:gap-3 transition-all">
                Voir toutes les fonctionnalités <Icon icon="lucide:arrow-right" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <Icon icon="lucide:send" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Candidature Simplifiée</h4>
                <p className="text-slate-500">Un processus fluide pour postuler en quelques secondes.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <Icon icon="lucide:activity" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Suivi en Temps Réel</h4>
                <p className="text-slate-500">Sachez exactement où en est chaque dossier à tout moment.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <Icon icon="lucide:award" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Évaluations Intégrées</h4>
                <p className="text-slate-500">Grilles de notation personnalisables pour chaque stage.</p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <Icon icon="lucide:pie-chart" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Rapports Détaillés</h4>
                <p className="text-slate-500">Générez des PDF complets pour vos rapports de fin d&apos;année.</p>
              </div>
            </div>
            {/* Feature 5 */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <Icon icon="lucide:message-square" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Messagerie Intégrée</h4>
                <p className="text-slate-500">Communiquez directement sans sortir de la plateforme.</p>
              </div>
            </div>
            {/* Feature 6 */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <Icon icon="lucide:shield" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Gestion Multi-rôles</h4>
                <p className="text-slate-500">Droits d&apos;accès précis pour tuteurs, admins et professeurs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Showcase */}
      <section className="py-20 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-5xl font-bold">500+</p>
              <p className="text-blue-200 font-medium">Étudiants actifs</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold">100+</p>
              <p className="text-blue-200 font-medium">Entreprises Partenaires</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold">300+</p>
              <p className="text-blue-200 font-medium">Stages Réalisés</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold">95%</p>
              <p className="text-blue-200 font-medium">Taux de Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-800 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-20"></div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Prêt à Commencer ?</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
              Rejoignez l&apos;écosystème leader pour la gestion des stages et transformez vos processus dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/company/register" className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all">
                S&apos;inscrire Entreprise
              </Link>
              <Link href="/admin/register" className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold border border-white/20 rounded-xl transition-all">
                S&apos;inscrire École
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                  <Icon icon="lucide:graduation-cap" className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold text-blue-800">StagiaireConnect</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Connecter le monde de l&apos;éducation et de l&apos;entreprise pour des stages de qualité.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Plateforme</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-blue-800 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">À Propos</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Légal</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-blue-800 transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Politique de cookies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Réseaux Sociaux</h5>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-800 hover:text-white transition-all">
                  <Icon icon="lucide:linkedin" className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-800 hover:text-white transition-all">
                  <Icon icon="lucide:twitter" className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-800 hover:text-white transition-all">
                  <Icon icon="lucide:instagram" className="text-xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2024 StagiaireConnect. Tous droits réservés.</p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              Fait avec <Icon icon="lucide:heart" className="text-red-500" /> pour l&apos;éducation.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
