'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'company' | 'student'>('company');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      icon: 'lucide:users',
      iconSecondary: 'lucide:sparkles',
      title: 'Rejoignez notre communauté',
      description: 'Connectez-vous avec des milliers d\'étudiants et entreprises pour des opportunités de stage enrichissantes.',
      stats: [
        { value: '2k+', label: 'Membres' },
        { value: '500+', label: 'Entreprises' },
        { value: '98%', label: 'Satisfaction' },
      ],
    },
    {
      icon: 'lucide:rocket',
      iconSecondary: 'lucide:trending-up',
      title: 'Démarrez en quelques minutes',
      description: 'Créez votre compte gratuitement et accédez immédiatement à toutes les fonctionnalités de la plateforme.',
      stats: [
        { value: '5min', label: 'Inscription' },
        { value: 'Gratuit', label: 'Toujours' },
        { value: '24/7', label: 'Support' },
      ],
    },
    {
      icon: 'lucide:shield-check',
      iconSecondary: 'lucide:lock',
      title: 'Vos données sont protégées',
      description: 'Nous utilisons les dernières technologies de sécurité pour protéger vos informations personnelles.',
      stats: [
        { value: '100%', label: 'Sécurisé' },
        { value: 'RGPD', label: 'Conforme' },
        { value: 'SSL', label: 'Cryptage' },
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: activeTab === 'company' ? 'COMPANY' : 'STUDENT',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Inscription réussie, rediriger vers la page de login
      router.push('/login?registered=true');
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
      {/* Left Side - Register Form */}
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
              Créer un compte
            </h1>
            <p className="text-gray-500 mt-2">
              {activeTab === 'company'
                ? "Rejoignez-nous en tant qu'entreprise"
                : "Rejoignez-nous en tant qu'étudiant"}
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
              onClick={() => setActiveTab('student')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'student'
                  ? 'text-[#1E40AF] border-b-2 border-[#1E40AF]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Étudiant
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800">
              <Icon icon="lucide:alert-circle" className="text-xl flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Register Form */}
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
                  placeholder={activeTab === 'company' ? 'nom@entreprise.fr' : 'prenom.nom@ecole.fr'}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-50 focus:border-[#1E40AF] text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
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
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirmer le mot de passe</label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-[#1E40AF]">
                  <Icon icon="lucide:lock" className="text-xl" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-50 focus:border-[#1E40AF] text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon icon={showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'} className="text-xl" />
                </button>
              </div>
            </div>

            {/* Accept Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-5 h-5 text-[#1E40AF] border-gray-300 rounded focus:ring-[#1E40AF] mt-0.5"
              />
              <label className="ml-3 text-sm text-gray-600">
                J'accepte les{' '}
                <Link href="/terms" className="text-[#1E40AF] font-bold hover:underline">
                  conditions d'utilisation
                </Link>
                {' '}et la{' '}
                <Link href="/privacy" className="text-[#1E40AF] font-bold hover:underline">
                  politique de confidentialité
                </Link>
              </label>
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
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte</span>
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

            {/* Login Link */}
            <p className="text-center text-gray-600 font-medium">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-[#1E40AF] font-bold hover:underline decoration-2 underline-offset-4">
                Se connecter
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
