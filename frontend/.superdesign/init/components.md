# Shared UI Components

## Overview
This project uses a custom component approach with Iconify and Lucide React for icons. No component library is installed (no shadcn/ui, MUI, etc.).

## FontLoader Component

**Path**: `components/FontLoader.tsx`

**Description**: Client-side font loader that dynamically injects Fontshare fonts

**Source Code**:
```tsx
'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Créer et injecter le link pour les polices
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.fontshare.com/v2/css?f[]=general-sans@700,600,500,400&f[]=satoshi@400,500,700&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
```

## Icon Components

### Iconify React
**Package**: `@iconify/react`
**Usage**: `<Icon icon="lucide:icon-name" />`

Common icons used:
- `lucide:graduation-cap` - Logo, education
- `lucide:building-2` - Company
- `lucide:school` - School/admin
- `lucide:mail` - Email
- `lucide:lock` - Password
- `lucide:eye` / `lucide:eye-off` - Password visibility
- `lucide:arrow-right` - Navigation
- `lucide:loader-2` - Loading spinner
- `lucide:rocket` - Launch/growth
- `lucide:users-2` - Team/users
- `lucide:briefcase` - Work/jobs
- `lucide:check-circle` - Success
- `lucide:chart-line` - Analytics
- `lucide:award` - Achievement

### Lucide React
**Package**: `lucide-react`
**Usage**: Direct component imports (not currently used in existing pages)

## Common UI Patterns

### Button Patterns

**Primary Button (Amber)**:
```tsx
<button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xl shadow-amber-500/30 transition-all">
  Button Text
</button>
```

**Secondary Button (Blue)**:
```tsx
<button className="px-8 py-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl shadow-xl shadow-blue-800/30 transition-all">
  Button Text
</button>
```

**Ghost Button**:
```tsx
<button className="px-4 py-2 font-semibold text-blue-800 hover:bg-blue-50 rounded-lg transition-all">
  Button Text
</button>
```

### Input Field Pattern

```tsx
<div className="relative flex items-center group">
  <div className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-[#1E40AF]">
    <Icon icon="lucide:mail" className="text-xl" />
  </div>
  <input
    type="email"
    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-50 focus:border-[#1E40AF] text-gray-900 placeholder:text-gray-400"
    placeholder="nom@entreprise.fr"
  />
</div>
```

### Card Pattern

```tsx
<div className="bg-white p-8 rounded-2xl border border-slate-200 card-hover">
  {/* Card content */}
</div>
```

### Glass Navigation Pattern

```tsx
<nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    {/* Nav content */}
  </div>
</nav>
```

### Logo Pattern

```tsx
<div className="flex items-center gap-2">
  <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center text-white">
    <Icon icon="lucide:graduation-cap" className="text-2xl" />
  </div>
  <span className="text-2xl font-bold tracking-tight text-gray-900">
    Stage<span className="text-[#F59E0B]">Connect</span>
  </span>
</div>
```

### Loading State Pattern

```tsx
{loading ? (
  <>
    <Icon icon="lucide:loader-2" className="animate-spin" />
    <span>Loading...</span>
  </>
) : (
  <>
    <span>Submit</span>
    <Icon icon="lucide:arrow-right" className="text-lg" />
  </>
)}
```

### Error Message Pattern

```tsx
{error && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800">
    <Icon icon="lucide:alert-circle" className="text-xl flex-shrink-0" />
    <span className="text-sm">{error}</span>
  </div>
)}
```

## No Component Library
This project does not use a pre-built component library. All UI elements are custom-built with Tailwind CSS utilities.
