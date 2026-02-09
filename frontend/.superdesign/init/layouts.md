# Layout Components

## Root Layout

**Path**: `app/layout.tsx`

**Description**: Root layout for all pages, includes FontLoader and metadata

**Complete Source**:
```tsx
import type { Metadata } from "next";
import FontLoader from "@/components/FontLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "StagiaireConnect - Gestion de Stages",
  description: "La plateforme tout-en-un pour la gestion des stages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <FontLoader />
        {children}
      </body>
    </html>
  );
}
```

## Landing Page Navigation

**Integrated in**: `app/page.tsx`

**Pattern**: Fixed glass-morphism header with logo, nav links, and auth buttons

```tsx
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
        S'inscrire
      </Link>
    </div>
  </div>
</nav>
```

## Landing Page Footer

**Integrated in**: `app/page.tsx`

```tsx
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
          Connecter le monde de l'éducation et de l'entreprise pour des stages de qualité.
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
        Fait avec <Icon icon="lucide:heart" className="text-red-500" /> pour l'éducation.
      </div>
    </div>
  </div>
</footer>
```

## Dashboard Layout (Placeholder)

**Note**: Dashboard layouts for Company and Admin are currently minimal placeholders with simple auth checks. They will need proper sidebar navigation and header layouts.

**Current Pattern** (to be expanded):
```tsx
<div className="min-h-screen bg-slate-50 p-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-slate-900 mb-8">
      Dashboard Title
    </h1>
    <div className="bg-white p-8 rounded-xl shadow-sm">
      {/* Content */}
    </div>
  </div>
</div>
```

## Layout Patterns

### Full-Height Split Screen (Login Page)
```tsx
<div className="h-screen flex bg-gray-50 overflow-hidden">
  {/* Left Side - 50% */}
  <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
    {/* Content */}
  </div>

  {/* Right Side - 50% */}
  <div className="hidden lg:flex lg:w-1/2 h-screen bg-gradient-to-br from-[#1E40AF] to-[#0F766E] relative flex-col justify-center items-center text-white overflow-hidden">
    {/* Content */}
  </div>
</div>
```

### Full-Width Marketing Layout (Landing Page)
```tsx
<div className="min-h-screen bg-white">
  <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
    {/* Navigation */}
  </nav>

  <section className="pt-32 pb-20 hero-gradient">
    {/* Hero Section */}
  </section>

  <section className="py-24 bg-slate-50">
    {/* Content Sections */}
  </section>

  <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
    {/* Footer */}
  </footer>
</div>
```
