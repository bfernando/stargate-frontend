# Theming & Branding Customisation Guide

Stargate offers a highly flexible design system using **CSS Variables** combined with **Tailwind CSS**. This allows developers to fully white-label, skin, and customise the hosted checkout page and embeddable widget to match any brand identity.

---

## 1. CSS Design Tokens

The core layout and styling properties are driven by CSS custom properties (variables) defined in the `:root` block of `app/globals.css`. By modifying these variables, you can alter the brand's aesthetic without editing the underlying React components.

| CSS Variable | Default Value (Light) | Default Value (Dark) | Role / Usage |
| :--- | :--- | :--- | :--- |
| `--color-ink` | `#0d0f1a` | `#ffffff` | Primary text and high-contrast foreground color. |
| `--color-midnight` | `#1a1d2e` | `#0d0f1a` | Secondary text or panel backgrounds. |
| `--color-surface` | `#f8f9ff` | `#111421` | Global body background color. |
| `--color-violet` | `#6c5ce7` | `#6c5ce7` | Base accent color (brand primary). |
| `--color-mint` | `#00cec9` | `#00cec9` | Success/verification accent color. |
| `--color-ocean` | `#1860a5` | `#1860a5` | Secondary accent/link hover color. |
| `--color-coral` | `#e17055` | `#e17055` | Error states and destructive action color. |
| `--color-warning` | `#fdcb6e` | `#fdcb6e` | Warning banner and alert backgrounds. |
| `--radius-card` | `8px` | `8px` | Border-radius for checkout panels and inputs. |
| `--shadow-lift` | `0 18px 50px rgba(...)` | (Same) | Deep shadow for floating checkout panels. |

### Dynamic Theme Aliases

We map semantic colors directly to these variables to make theming easier:

```css
--color-success: var(--color-mint);
--color-error: var(--color-coral);
--color-accent: var(--color-violet);
```

---

## 2. Customising Brand Colours

To override CSS variables for your hosted checkout, modify [globals.css](file:///Users/admin/.pg/stellar-W5/stargate-frontend/app/globals.css).

### Example: Applying a "Fintech Slate & Emerald" Brand
If you want to brand the checkout page with a deep slate background, emerald green buttons/accents, and softer card borders, you can update `:root` and `.dark` as follows:

```css
:root {
  /* Brand Accents */
  --color-violet: #059669;       /* Emerald primary button / action */
  --color-mint: #34d399;         /* Mint / Success */
  --color-ocean: #047857;        /* Darker green for hover states */
  
  /* Layout & Cards */
  --color-surface: #f0fdf4;      /* Soft green/white background */
  --color-ink: #064e3b;          /* Forest green text */
  --radius-card: 12px;           /* Softer corners */
  
  /* Focus / Shadows */
  --shadow-glow-purple: 0 0 0 4px rgba(5, 150, 105, 0.16);
}

.dark {
  --color-surface: #022c22;      /* Deep forest green background */
  --color-ink: #f0fdf4;          /* Soft light text */
  --color-midnight: #064e3b;     /* Card background in dark mode */
}
```

---

## 3. Tailwind CSS Integration

All custom color variables are extended in Stargate's [tailwind.config.ts](file:///Users/admin/.pg/stellar-W5/stargate-frontend/tailwind.config.ts). This ensures that you can use standard utility classes while keeping them tied to your CSS variables:

```typescript
// tailwind.config.ts
extend: {
  colors: {
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
  }
}
```

This configuration maps:
- `bg-accent` / `text-accent` $\rightarrow$ `--color-accent`
- `bg-success` / `text-success` $\rightarrow$ `--color-success`
- `bg-error` / `text-error` $\rightarrow$ `--color-error`

---

## 4. Overriding Fonts

By default, the checkout page inherits the font defined in the main document layout. To switch to a custom typeface (e.g., Google Font **Inter** or **Outfit**):

1. Import the font in `app/layout.tsx` using `next/font`:
   ```typescript
   import { Inter } from 'next/font/google';

   const inter = Inter({
     subsets: ['latin'],
     variable: '--font-sans',
   });
   ```
2. Apply the font variable to the document class/body:
   ```html
   <body className={`${inter.variable} font-sans`}>
   ```
3. Update [tailwind.config.ts](file:///Users/admin/.pg/stellar-W5/stargate-frontend/tailwind.config.ts) to extend the sans-serif font family:
   ```typescript
   theme: {
     extend: {
       fontFamily: {
         sans: ['var(--font-sans)', 'sans-serif'],
       },
     },
   }
   ```
