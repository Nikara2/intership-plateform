# Design System & Theme

## Framework
- **Framework**: Next.js 16.1.6 (App Router)
- **CSS**: Tailwind CSS v4
- **Icons**: @iconify/react, lucide-react
- **Fonts**: Fontshare (Satoshi, General Sans)

## globals.css

```css
@import "tailwindcss";

:root {
  /* Design System Colors */
  --primary: #1E40AF;
  --secondary: #0F766E;
  --accent: #F59E0B;
  --background: #F8FAFC;
  --foreground: #0F172A;
  --success: #16A34A;
  --error: #DC2626;
  --warning: #F59E0B;

  /* Sidebar */
  --sidebar-dark: #0F172A;
}

@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-success: var(--success);
  --color-error: var(--error);
  --color-warning: var(--warning);
}

body {
  font-family: 'Satoshi', sans-serif;
  color: #1e293b;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'General Sans', sans-serif;
}

.glass-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.hero-gradient {
  background: radial-gradient(circle at top right, rgba(30, 64, 175, 0.05), transparent 40%),
              radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.05), transparent 40%);
}

.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

## Color Palette

### Primary Colors
- **Primary Blue**: `#1E40AF` (rgb(30, 64, 175))
- **Secondary Teal**: `#0F766E` (rgb(15, 118, 110))
- **Accent Amber**: `#F59E0B` (rgb(245, 158, 11))

### UI Colors
- **Background**: `#F8FAFC` (rgb(248, 250, 252))
- **Foreground**: `#0F172A` (rgb(15, 23, 42))
- **Success**: `#16A34A` (rgb(22, 163, 74))
- **Error**: `#DC2626` (rgb(220, 38, 38))
- **Warning**: `#F59E0B` (rgb(245, 158, 11))

### Grayscale
- **Slate 900**: `#0F172A`
- **Slate 800**: `#1E293B`
- **Slate 700**: `#334155`
- **Slate 600**: `#475569`
- **Slate 500**: `#64748B`
- **Slate 400**: `#94A3B8`
- **Slate 300**: `#CBD5E1`
- **Slate 200**: `#E2E8F0`
- **Slate 100**: `#F1F5F9`
- **Slate 50**: `#F8FAFC`

## Typography

### Font Families
- **Body**: Satoshi (400, 500, 700) from Fontshare
- **Headings**: General Sans (400, 500, 600, 700) from Fontshare

### Font Sizes (Tailwind)
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)
- `text-5xl`: 3rem (48px)
- `text-6xl`: 3.75rem (60px)

## Spacing
Tailwind default spacing scale (rem-based)

## Shadows
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **2xl**: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

## Border Radius
- **rounded-lg**: 0.5rem (8px)
- **rounded-xl**: 0.75rem (12px)
- **rounded-2xl**: 1rem (16px)
- **rounded-3xl**: 1.5rem (24px)
- **rounded-full**: 9999px

## Glass Morphism
Used for navigation and modals:
- Background: `rgba(255, 255, 255, 0.95)`
- Backdrop filter: `blur(12px)`
- Border: `1px solid rgba(226, 232, 240, 0.8)`
- Shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.05)`

## Animations
- **Float**: 6s ease-in-out infinite, translateY 0-20px
- **Card Hover**: translateY(-8px) with shadow increase
- **Transitions**: `transition-all` or `transition-colors` with default timing
