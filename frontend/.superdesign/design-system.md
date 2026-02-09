# StageConnect Design System

## Product Context

**Product Name**: StageConnect (StagiaireConnect)
**Purpose**: Internship management platform connecting students, companies, and schools

### Key Features
- Student internship search and applications
- Company offer posting and candidate management
- School admin oversight and reporting
- Evaluation and tracking systems
- Role-based dashboards (Company, School Admin)

### User Roles
1. **Students**: Search offers, apply, track applications
2. **Companies**: Post offers, manage applications, evaluate interns
3. **School Admins**: Oversee students and companies, generate reports

## Brand Identity

### Color Palette

#### Primary Colors
- **Primary Blue** `#1E40AF`: Main brand color, primary actions, headings
- **Secondary Teal** `#0F766E`: Secondary accent, supporting elements
- **Accent Amber** `#F59E0B`: Call-to-action buttons, highlights, success states

#### Functional Colors
- **Success Green** `#16A34A`: Success states, confirmations
- **Error Red** `#DC2626`: Error states, destructive actions
- **Warning Amber** `#F59E0B`: Warnings, important notices

#### Neutral Palette
- **Background** `#F8FAFC`: Page backgrounds (Slate 50)
- **Foreground** `#0F172A`: Primary text (Slate 900)
- **Sidebar Dark** `#0F172A`: Dark sidebar background

#### Grayscale (Tailwind Slate)
- Slate 900: `#0F172A` - Primary text
- Slate 800: `#1E293B` - Secondary text
- Slate 700: `#334155` - Muted text
- Slate 600: `#475569` - Placeholder text
- Slate 500: `#64748B` - Disabled text
- Slate 400: `#94A3B8` - Border hover
- Slate 300: `#CBD5E1` - Borders
- Slate 200: `#E2E8F0` - Light borders
- Slate 100: `#F1F5F9` - Hover backgrounds
- Slate 50: `#F8FAFC` - Page background

### Typography

#### Font Families
- **Body Text**: Satoshi (400, 500, 700) - Modern, clean, readable
- **Headings**: General Sans (400, 500, 600, 700) - Bold, professional
- **Source**: Fontshare CDN

#### Type Scale
- **h1**: 3.75rem (60px) - Page heroes, landing page titles
- **h2**: 2.25rem (36px) - Section headings
- **h3**: 1.875rem (30px) - Subsection headings
- **h4**: 1.5rem (24px) - Card titles
- **h5**: 1.25rem (20px) - Small headings
- **h6**: 1.125rem (18px) - Tiny headings
- **Body Large**: 1.25rem (20px) - Lead paragraphs
- **Body**: 1rem (16px) - Default text
- **Body Small**: 0.875rem (14px) - Secondary text
- **Caption**: 0.75rem (12px) - Labels, metadata

#### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing System
Based on Tailwind's default spacing scale (0.25rem increments)

Common spacing values:
- `space-2`: 0.5rem (8px)
- `space-3`: 0.75rem (12px)
- `space-4`: 1rem (16px)
- `space-6`: 1.5rem (24px)
- `space-8`: 2rem (32px)
- `space-12`: 3rem (48px)
- `space-16`: 4rem (64px)
- `space-24`: 6rem (96px)

### Border Radius
- **Small** `rounded-lg`: 0.5rem (8px) - Buttons, inputs
- **Medium** `rounded-xl`: 0.75rem (12px) - Cards, modals
- **Large** `rounded-2xl`: 1rem (16px) - Large cards, sections
- **Extra Large** `rounded-3xl`: 1.5rem (24px) - Hero sections
- **Full** `rounded-full`: 9999px - Pills, avatars, icon containers

### Shadows
- **Small**: `shadow-sm` - Subtle depth
- **Medium**: `shadow-md` - Default cards
- **Large**: `shadow-lg` - Elevated cards
- **Extra Large**: `shadow-xl` - Modals, popovers
- **2XL**: `shadow-2xl` - Maximum elevation
- **Colored**: `shadow-amber-500/30` - Brand-colored shadows for CTAs

### Effects

#### Glass Morphism
Used for navigation bars and overlay elements:
- Background: `rgba(255, 255, 255, 0.95)`
- Backdrop blur: `blur(12px)`
- Border: `1px solid rgba(226, 232, 240, 0.8)`
- Shadow: Subtle `shadow-sm`

#### Gradients
- **Hero Gradient**: Radial gradients with primary blue and accent amber
- **Button Gradients**: Solid colors with hover transitions
- **Background Gradients**: `from-[#1E40AF] to-[#0F766E]` for feature sections

## Component Patterns

### Buttons

#### Primary (Amber)
- Background: `bg-amber-500` → `hover:bg-amber-600`
- Text: `text-white`
- Font: `font-bold`
- Radius: `rounded-xl`
- Shadow: `shadow-xl shadow-amber-500/30`
- Padding: `px-8 py-4` (large), `px-6 py-3` (medium), `px-4 py-2` (small)

#### Secondary (Blue)
- Background: `bg-blue-800` → `hover:bg-blue-900`
- Text: `text-white`
- Font: `font-bold`
- Radius: `rounded-xl`
- Shadow: `shadow-xl shadow-blue-800/30`

#### Ghost
- Background: `transparent` → `hover:bg-blue-50`
- Text: `text-blue-800`
- Font: `font-semibold`
- Radius: `rounded-lg`

#### Destructive
- Background: `bg-red-500` → `hover:bg-red-600`
- Text: `text-white`
- Radius: `rounded-lg`

### Form Inputs

#### Text Input
- Background: `bg-gray-50`
- Border: `border border-gray-200` → `focus:border-[#1E40AF]`
- Focus ring: `focus:ring-4 focus:ring-blue-50`
- Radius: `rounded-xl`
- Padding: `px-4 py-3` (with icon: `pl-12`)
- Icon position: Absolute left with `left-4`

#### Select/Dropdown
Similar styling to text inputs

#### Checkbox
- Color: `text-[#1E40AF]`
- Border: `border-gray-300`
- Radius: `rounded`
- Focus: `focus:ring-[#1E40AF]`

### Cards

#### Default Card
- Background: `bg-white`
- Border: `border border-slate-200`
- Radius: `rounded-2xl`
- Padding: `p-8`
- Hover: `.card-hover` class (translateY + shadow increase)

#### Stat Card
- Background: `bg-white`
- Border: None or light border
- Radius: `rounded-xl`
- Padding: `p-6`
- Icon container: Colored background with rounded corners

### Navigation

#### Top Navigation (Glass)
- Class: `.glass-nav`
- Position: `fixed top-0 left-0 right-0 z-50`
- Height: `h-20`
- Content: Logo, nav links, auth buttons
- Max width: `max-w-7xl mx-auto`

#### Sidebar (Planned)
- Background: `#0F172A` (dark)
- Width: Fixed or collapsible
- Icons: White with hover states
- Active state: Amber accent

### Icons
- **Library**: @iconify/react with Lucide icon set
- **Size**: `text-xl` (20px) for inline, `text-2xl` (24px) for standalone
- **Logo**: `text-2xl` to `text-3xl`
- **Color**: Inherit from parent or use brand colors

### Badges/Pills
- Radius: `rounded-full`
- Padding: `px-3 py-1`
- Font: `text-sm font-semibold`
- Background: Light colored (`bg-blue-50`) with matching text (`text-blue-700`)

### Tables (Planned)
- Header: Dark background with white text
- Rows: Alternating or hover states
- Borders: Light slate borders
- Padding: Comfortable spacing

## Animation & Motion

### Transitions
- Default: `transition-all` or `transition-colors`
- Duration: Default 300ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Animations
- **Float**: 6s ease-in-out infinite, translateY(0-20px)
- **Spin**: For loading states (`animate-spin`)
- **Card Hover**: `translateY(-8px)` with shadow increase

### Hover States
- Buttons: Background color darkens
- Cards: Lift up with shadow increase
- Links: Color change to brand blue
- Icons: Background fill on icon containers

## Layout Patterns

### Marketing Layout
- Fixed glass navigation
- Full-width sections with max-width container (`max-w-7xl`)
- Alternating background colors (white, slate-50)
- Generous padding (`py-20` to `py-24`)

### Dashboard Layout (To Be Designed)
- Sidebar navigation (left)
- Top header with search and user menu
- Content area with cards and widgets
- Background: `bg-slate-50`

### Split-Screen Auth
- 50/50 split on desktop
- Left: Form content, white background
- Right: Brand visual, gradient background
- Mobile: Stack vertically, hide right side

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Primary blue on white: 8.59:1
- White on primary blue: 11.63:1

### Focus States
- Visible focus rings on all interactive elements
- Blue ring color: `ring-blue-50` or `ring-[#1E40AF]`

### Typography
- Minimum text size: 14px (0.875rem)
- Adequate line height for readability
- Sufficient spacing between interactive elements

## Responsive Design

### Breakpoints (Tailwind Default)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
- Default styles for mobile
- Progressive enhancement with breakpoint classes
- Hide/show navigation on mobile (`hidden md:flex`)
- Stack layouts vertically on mobile

## Brand Voice
- **Tone**: Professional, modern, approachable
- **Language**: Clear, concise, action-oriented
- **French**: Primary language for UI
- **Style**: Clean, minimalist, data-driven
