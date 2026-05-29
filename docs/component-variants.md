# Component Variant Conventions

This document describes the variant patterns for the four core UI primitives. Follow these conventions when adding new variants or components.

## Button

File: `components/ui/Button.tsx`

The `Button` component accepts a `className` prop to extend or override styles. The base style is a filled violet button.

**Variants** (pass via `className`):

| Variant | `className` |
|---------|-------------|
| Primary (default) | _(no override needed)_ |
| Secondary / outline | `bg-transparent border border-violet text-violet hover:bg-violet/10` |
| Destructive | `bg-coral hover:bg-coral/90` |
| Ghost | `bg-transparent text-slate-700 hover:bg-slate-100` |
| Small | `h-8 px-3 text-xs` |

**Rules:**
- Always keep `disabled:cursor-not-allowed disabled:opacity-60` — do not remove these from the base.
- Do not add new variant props to the component itself; use `className` composition instead.
- Icon-only buttons must include an `aria-label`.

---

## Badge

File: `components/ui/Badge.tsx`

The `Badge` component maps a `status` string to a colour style via the internal `styles` record.

**Adding a new status:**

1. Add an entry to the `styles` record using one of the approved colour pairs:

| Semantic | Tailwind classes |
|----------|-----------------|
| Success / positive | `bg-emerald-100 text-emerald-800` |
| Warning / pending | `bg-amber-100 text-amber-800` |
| Error / negative | `bg-coral text-white` |
| Neutral / inactive | `bg-slate-200 text-slate-700` |
| Brand accent | `bg-violet text-white` |
| Info | `bg-ocean/10 text-ocean` |

2. The key must be the exact string value returned by the API (e.g. `'under_review'`).
3. Do not add a `variant` prop — the `status` string is the variant selector.

---

## Input

File: `components/ui/Input.tsx`

The `Input` component forwards all native `<input>` attributes and accepts a `className` override.

**Variants** (pass via `className`):

| Variant | `className` |
|---------|-------------|
| Default | _(no override needed)_ |
| Error state | `border-coral focus:border-coral focus:ring-coral/15` |
| Disabled | Use the native `disabled` prop; styling is handled by the browser + Tailwind's `disabled:` utilities |
| Full-width | `w-full` |

**Rules:**
- Always pair an `<Input>` with a `<label>` or `aria-label` for accessibility.
- Error messages must be linked via `aria-describedby`.

---

## Card

File: `components/ui/Card.tsx`

The `Card` component renders a `<section>` with a white background, border, and shadow. It accepts a `className` override.

**Variants** (pass via `className`):

| Variant | `className` |
|---------|-------------|
| Default | _(no override needed)_ |
| Flat (no shadow) | `shadow-none` |
| Highlighted | `border-violet` |
| Dark / ink | `bg-ink border-ink/20 text-white` |

**Rules:**
- Use `<Card>` for self-contained content blocks, not for layout wrappers.
- Nest headings inside `<Card>` using `<h2>` or lower — `<h1>` belongs to the page, not a card.
- Do not add a `variant` prop; use `className` composition.
