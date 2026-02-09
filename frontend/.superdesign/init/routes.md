# Routes & Pages

## Framework
Next.js 16.1.6 with App Router

## Route Structure

### Public Routes

#### `/` - Landing Page
- **File**: `app/page.tsx`
- **Layout**: `app/layout.tsx` (root)
- **Description**: Marketing landing page with hero, features, statistics, CTA
- **Auth**: None required

#### `/login` - Login Page
- **File**: `app/login/page.tsx`
- **Layout**: `app/layout.tsx` (root)
- **Description**: Split-screen login with company/admin tabs, carousel on right side
- **Auth**: Redirects to dashboard if already authenticated
- **Features**:
  - Company/Admin tab switcher
  - Email & password fields
  - Remember me checkbox
  - Forgot password link
  - 3-slide auto-rotating carousel with stats
  - Backend integration with JWT

### Protected Routes

#### `/company/dashboard` - Company Dashboard
- **File**: `app/company/dashboard/page.tsx`
- **Layout**: `app/layout.tsx` (root)
- **Description**: Company dashboard (placeholder)
- **Auth**: Requires COMPANY role
- **Status**: Minimal implementation, needs full design

#### `/admin/dashboard` - Admin Dashboard
- **File**: `app/admin/dashboard/page.tsx`
- **Layout**: `app/layout.tsx` (root)
- **Description**: School admin dashboard (placeholder)
- **Auth**: Requires SCHOOL_ADMIN role
- **Status**: Minimal implementation, needs full design

### Planned Routes (Not Yet Implemented)

#### Company Routes
- `/company/profile` - Company profile management
- `/company/offers` - Offers management
- `/company/applications` - Applications management
- `/company/evaluations` - Intern evaluations

#### Admin Routes
- `/admin/students` - Student tracking
- `/admin/companies` - Company tracking
- `/admin/internships` - Ongoing internships
- `/admin/reports` - Statistics and reports
- `/admin/accounts` - Account management

#### Auth Routes
- `/register` - Registration page (referenced but not implemented)
- `/forgot-password` - Password reset (referenced but not implemented)

## Route Configuration

**Next.js Config**: `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

## Authentication Flow

### Login Process
1. User submits credentials on `/login`
2. POST to `http://localhost:3000/auth/login`
3. On success:
   - Store `access_token` in localStorage
   - Parse JWT to get role and email
   - Store `user_role` and `user_email` in localStorage
   - Redirect based on role:
     - `COMPANY` → `/company/dashboard`
     - `SCHOOL_ADMIN` → `/admin/dashboard`
     - Other → `/dashboard`

### Protected Route Pattern
```tsx
useEffect(() => {
  if (!auth.isAuthenticated() || auth.getRole() !== 'EXPECTED_ROLE') {
    router.push('/login');
  }
}, [router]);
```

## API Configuration
- **Base URL**: `http://localhost:3000` (from `.env.local`)
- **Auth**: JWT Bearer token in Authorization header
- **Helper**: `lib/api.ts` provides request wrappers
