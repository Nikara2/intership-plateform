'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'company' | 'admin'>('company');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Check if user just registered
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
    }
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      icon: 'lucide:rocket',
      iconSecondary: 'lucide:users-2',
      title: 'Gérez vos stages efficacement',
      description: 'Connectez étudiants et entreprises sur une plateforme moderne conçue pour simplifier le recrutement et le suivi.',
      stats: [
        { value: '2k+', label: 'Étudiants' },
        { value: '500+', label: 'Entreprises' },
        { value: '98%', label: 'Réussite' },
      ],
    },
    {
      icon: 'lucide:briefcase',
      iconSecondary: 'lucide:check-circle',
      title: 'Publiez vos offres en quelques clics',
      description: 'Créez et gérez vos offres de stage facilement. Recevez des candidatures qualifiées et suivez chaque étape du processus.',
      stats: [
        { value: '300+', label: 'Offres publiées' },
        { value: '24h', label: 'Temps moyen' },
        { value: '95%', label: 'Satisfaction' },
      ],
    },
    {
      icon: 'lucide:chart-line',
      iconSecondary: 'lucide:award',
      title: 'Suivez et évaluez vos stagiaires',
      description: 'Tableau de bord complet avec statistiques en temps réel. Évaluez les performances et générez des rapports détaillés.',
      stats: [
        { value: '100%', label: 'Suivi en temps réel' },
        { value: '4.8/5', label: 'Note moyenne' },
        { value: '1000+', label: 'Évaluations' },
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      localStorage.setItem('access_token', data.access_token);
      const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
      localStorage.setItem('user_role', tokenPayload.role);
      localStorage.setItem('user_email', tokenPayload.email);

      if (tokenPayload.role === 'COMPANY') {
        router.push('/company/dashboard');
      } else if (tokenPayload.role === 'SCHOOL_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
        {/* Abstract Background Detail */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="w-full max-w-md relative">
          {/* Back to Home Button */}
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1E40AF] transition-colors">
              <Icon icon="lucide:arrow-left" className="text-lg" />
              <span>Retour à l'accueil</span>
            </Link>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center text-white">
                <Icon icon="lucide:graduation-cap" className="text-2xl" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Stage<span className="text-[#F59E0B]">Connect</span>
              </span>
            </div>
          </div>

          {/* Welcome Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {activeTab === 'company' ? 'Connexion Entreprise' : 'Connexion Admin École'}
            </h1>
            <p className="text-gray-500 mt-2">
              {activeTab === 'company'
                ? "Accédez à votre espace pour gérer vos offres"
                : "Accédez au panneau d'administration"}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-center space-x-8 mb-6 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('company')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'company'
                  ? 'text-[#1E40AF] border-b-2 border-[#1E40AF]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Entreprise
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'admin'
                  ? 'text-[#1E40AF] border-b-2 border-[#1E40AF]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Admin École
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-800">
              <Icon icon="lucide:check-circle" className="text-xl flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800">
              <Icon icon="lucide:alert-circle" className="text-xl flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email</label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-[#1E40AF]">
                  <Icon icon="lucide:mail" className="text-xl" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="nom@entreprise.fr"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-50 focus:border-[#1E40AF] text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Mot de passe</label>
              </div>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-[#1E40AF]">
                  <Icon icon="lucide:lock" className="text-xl" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-50 focus:border-[#1E40AF] text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} className="text-xl" />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#1E40AF] border-gray-300 rounded focus:ring-[#1E40AF]"
                />
                <span className="ml-3 text-sm font-medium text-gray-600">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-bold text-[#1E40AF] hover:text-blue-700 transition-colors">
                Mot de passe oublié?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] disabled:bg-amber-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-200 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon icon="lucide:loader-2" className="animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <Icon icon="lucide:arrow-right" className="text-lg" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">OU</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-600 font-medium">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#1E40AF] font-bold hover:underline decoration-2 underline-offset-4">
                S&apos;inscrire
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-400">
          &copy; 2024 StageConnect — Propulsé par la Modernité.
        </div>
      </div>

      {/* Right Side - Brand Visual with Carousel */}
      <div className="hidden lg:flex lg:w-1/2 h-screen bg-gradient-to-br from-[#1E40AF] to-[#0F766E] relative flex-col justify-center items-center text-white overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        {/* Carousel Content */}
        <div className="relative z-10 px-16 text-center max-w-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              {/* Abstract Illustration Element */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-110"></div>
                  <div className="backdrop-blur-md bg-white/10 w-56 h-56 rounded-3xl flex items-center justify-center relative transform -rotate-6 hover:rotate-0 transition-transform duration-700 border border-white/20">
                    <Icon icon={slide.icon} className="text-7xl text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -bottom-5 -right-5 backdrop-blur-md bg-white/10 p-5 rounded-2xl transform rotate-12 shadow-2xl border border-white/20">
                    <Icon icon={slide.iconSecondary} className="text-3xl text-amber-400" />
                  </div>
                </div>
              </div>

              <h2 className="text-4xl font-bold leading-tight mb-4">{slide.title}</h2>
              <p className="text-lg text-blue-100 font-light leading-relaxed mb-6">
                {slide.description}
              </p>

              <div className="flex justify-center items-center gap-12">
                {slide.stats.map((stat, statIndex) => (
                  <Fragment key={`stat-${statIndex}`}>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-bold text-amber-400">{stat.value}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                        {stat.label}
                      </span>
                    </div>
                    {statIndex < slide.stats.length - 1 && (
                      <div className="w-px h-12 bg-white/20"></div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-2 rounded-full bg-amber-400'
                  : 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

