# Page Component Dependencies

This file traces the component dependency tree for key pages in the application.

## `/` - Landing Page

**Main File**: `app/page.tsx`

### Dependency Tree
```
app/page.tsx (Landing)
├── app/layout.tsx
│   ├── components/FontLoader.tsx
│   └── app/globals.css
├── next/link (Next.js)
└── @iconify/react (Icon)
```

### Sections in Landing Page
- Fixed glass navigation header
- Hero section with CTA buttons
- Value propositions (3 cards: Students, Companies, Schools)
- Features grid (6 features)
- Statistics banner
- CTA section with background effects
- Footer with links and social icons

## `/login` - Login Page

**Main File**: `app/login/page.tsx`

### Dependency Tree
```
app/login/page.tsx (Login)
├── app/layout.tsx
│   ├── components/FontLoader.tsx
│   └── app/globals.css
├── next/link (Next.js)
├── next/navigation (useRouter)
├── @iconify/react (Icon)
└── react (useState, useEffect, Fragment)
```

### Key Features
- Split-screen layout (50/50)
- Left side: Login form with company/admin tabs
- Right side: Auto-rotating carousel (3 slides)
- Backend integration via fetch to localhost:3000/auth/login
- JWT token storage in localStorage
- Role-based redirects

### Form Fields
- Email input with icon
- Password input with show/hide toggle
- Remember me checkbox
- Submit button with loading state
- Error message display

### Carousel Content
Each slide contains:
- Main icon in glass-morphism panel
- Secondary icon in smaller panel
- Title
- Description
- 3 statistics with labels
- Decorative background circles

## `/company/dashboard` - Company Dashboard

**Main File**: `app/company/dashboard/page.tsx`

### Dependency Tree
```
app/company/dashboard/page.tsx
├── app/layout.tsx
│   ├── components/FontLoader.tsx
│   └── app/globals.css
├── next/navigation (useRouter)
├── lib/api.ts (auth helper)
└── react (useEffect)
```

### Current Status
Minimal placeholder implementation with:
- Auth check for COMPANY role
- Simple welcome message
- Logout button
- Needs full dashboard design

## `/admin/dashboard` - Admin Dashboard

**Main File**: `app/admin/dashboard/page.tsx`

### Dependency Tree
```
app/admin/dashboard/page.tsx
├── app/layout.tsx
│   ├── components/FontLoader.tsx
│   └── app/globals.css
├── next/navigation (useRouter)
├── lib/api.ts (auth helper)
└── react (useEffect)
```

### Current Status
Minimal placeholder implementation with:
- Auth check for SCHOOL_ADMIN role
- Simple welcome message
- Logout button
- Needs full dashboard design

## Shared Dependencies

### All Pages Use
- `app/layout.tsx` - Root layout with FontLoader and globals.css
- `app/globals.css` - Design system, custom utilities, animations
- `components/FontLoader.tsx` - Client-side font injection

### Common Utilities
- `lib/api.ts` - API request helpers and auth utilities
  - `api.request()`, `api.get()`, `api.post()`, etc.
  - `auth.login()`, `auth.logout()`, `auth.isAuthenticated()`, etc.

### External Dependencies
- `next` (16.1.6) - Framework
- `react` (19.2.3) - UI library
- `@iconify/react` (6.0.2) - Icon components
- `lucide-react` (0.563.0) - Icon library (not yet used)
- `tailwindcss` (v4) - CSS framework

## Pages Needing Implementation

### Company Interface
- `/company/profile` - Profile management page
- `/company/offers` - Offers management page
- `/company/applications` - Applications management page
- `/company/evaluations` - Intern evaluation page

### Admin Interface
- Full `/admin/dashboard` - Complete dashboard with stats and widgets
- `/admin/students` - Student tracking page
- `/admin/companies` - Company tracking page
- `/admin/internships` - Ongoing internships page
- `/admin/reports` - Statistics and reports page
- `/admin/accounts` - Account management page

### Auth Pages
- `/register` - Registration page
- `/forgot-password` - Password reset page
