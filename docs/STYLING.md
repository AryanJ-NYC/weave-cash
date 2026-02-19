# Styling Guidelines

Design system and styling conventions for Weave Cash.

## Color Psychology for Fintech

### Primary Palette

| Color                   | Usage                            | Psychology                   |
| ----------------------- | -------------------------------- | ---------------------------- |
| **Blue (blue-600/500)** | Primary actions, links           | Trust, reliability, security |
| **Green (green-600)**   | Success states, positive numbers | Growth, money, approval      |
| **Slate (50-950)**      | Text, backgrounds, borders       | Professionalism, clarity     |

### Dark Mode

Uses system preference via `prefers-color-scheme`. Tailwind 4 handles this automatically.

### Color Application

```
Backgrounds:  white (light) / slate-950 (dark)
Surface:      slate-50 (light) / slate-900 (dark)
Cards:        white (light) / slate-900 (dark)
Text:         slate-900 (light) / white (dark)
Muted text:   slate-600 (light) / slate-400 (dark)
Borders:      slate-200 (light) / slate-800 (dark)
Primary:      blue-600 (light) / blue-500 (dark)
Success:      green-600 (positive states)
```

## Typography Scale

### Headings

```
Hero:        text-4xl md:text-5xl lg:text-6xl font-bold
Section:     text-3xl md:text-4xl font-bold
Subsection:  text-xl md:text-2xl font-semibold
Card title:  text-lg font-semibold
```

### Body

```
Large:       text-lg md:text-xl
Default:     text-base
Small:       text-sm
Caption:     text-xs
```

### Line Height

- Headings: `leading-tight` (1.25)
- Body: `leading-relaxed` (1.625) for readability

## Spacing System

### Section Spacing

```
Between sections:  py-24 md:py-32
Container padding: px-4 md:px-6
Max width:         max-w-7xl mx-auto
```

### Component Spacing

```
Card padding:      p-6 md:p-8
Stack gap:         space-y-4 md:space-y-6
Grid gap:          gap-6 md:gap-8
Button padding:    px-6 py-3 (large) / px-4 py-2 (default)
```

### Max Widths

```
Content:     max-w-4xl (prose, centered content)
Wide:        max-w-6xl (feature grids)
Full:        max-w-7xl (page container)
```

## Component Patterns

### Buttons

```tsx
// Primary (high emphasis)
className =
  'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors';

// Secondary (medium emphasis)
className =
  'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-lg font-semibold transition-colors';

// Ghost (low emphasis)
className =
  'hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors';
```

### Cards

```tsx
className =
  'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm';
```

### Invoice Payment Tracker (Progressive Single-Card Pattern)

Use one continuous card for the invoice payment journey instead of multiple step cards.

```tsx
// Tracker container
className =
  'rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm';

// Subsection blocks inside tracker
className =
  'rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4';

// Timeline rows
className =
  'flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2';
```

Tracker content order:

- Summary + status badge
- Timeline/progress block
- Quote form (when selecting payment method)
- Payment instructions (awaiting deposit / processing)
- Terminal result (completed, failed, refunded, expired)

Status treatment:

- `PENDING` / `AWAITING_DEPOSIT`: yellow status styles
- `PROCESSING`: blue status styles
- `COMPLETED`: green status styles
- `FAILED` / `EXPIRED`: red status styles
- `REFUNDED`: gray status styles

### Inputs

```tsx
className =
  'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600';
```

## Responsive Design

### Breakpoints (Tailwind defaults)

```
sm:  640px   (large phones)
md:  768px   (tablets)
lg:  1024px  (laptops)
xl:  1280px  (desktops)
2xl: 1536px  (large screens)
```

### Mobile-First Approach

Always write base styles for mobile, then layer on responsive modifiers:

```tsx
// Good: Mobile-first
className = 'text-2xl md:text-3xl lg:text-4xl';

// Bad: Desktop-first with mobile overrides
className = 'lg:text-4xl md:text-3xl text-2xl';
```

### Common Responsive Patterns

```tsx
// Stack to grid
className = 'flex flex-col md:flex-row';
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

// Hide/show
className = 'hidden md:block';
className = 'md:hidden';

// Spacing adjustments
className = 'py-16 md:py-24 lg:py-32';
```

## Shadows & Depth

```
Subtle:      shadow-sm (cards at rest)
Default:     shadow-md (elevated cards, dropdowns)
Prominent:   shadow-lg (modals, popovers)
Dramatic:    shadow-xl (hero elements)
```

## Border Radius

```
Buttons:     rounded-lg
Cards:       rounded-xl
Avatars:     rounded-full
Inputs:      rounded-lg
Badges:      rounded-full
```

## Accessibility

### Color Contrast

- Text on backgrounds: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Interactive elements: visible focus states

### Focus States

```tsx
className =
  'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2';
```

### Touch Targets

- Minimum 44x44px for interactive elements
- Adequate spacing between tap targets

### Motion

- Respect `prefers-reduced-motion`
- Keep animations subtle and purposeful
