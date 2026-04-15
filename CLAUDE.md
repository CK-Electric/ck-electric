# CK Electric — Project Guide

## Architecture

Headless WordPress + Next.js monorepo:

- `client/` — Next.js 16 frontend (App Router, TypeScript, Tailwind v4)
- CMS — WordPress on Kinsta, managed separately (not in this repo)

The frontend is deployed on Netlify. The CMS is a headless WordPress instance accessed via WPGraphQL. The frontend fetches all data server-side using GraphQL queries.

---

## Frontend Stack (`client/`)

| Tool | Version | Notes |
|------|---------|-------|
| Next.js | 16 | App Router, RSC, SSG |
| React | 19 | |
| TypeScript | 5 | Strict mode |
| Tailwind CSS | v4 | CSS-first config via `@theme inline` |
| Material-UI | Latest | Icons + MUI components only |
| Fonts | — | Inter (body), Playfair Display (headings) |
| Forms | — | Netlify Forms |
| CMS | — | WordPress via WPGraphQL |

---

## Design System

### Colors

Defined in `src/app/tokens/colors.css`. All colors are CSS custom properties surfaced as Tailwind theme tokens via `@theme inline`.

**Palettes** (each has shades 50–950):

| Scale | Use |
|-------|-----|
| `neutral` | Grays, backgrounds, borders |
| `primary` | Gold/amber brand color |
| `positive` | Success/green |
| `negative` | Error/red |
| `warning` | Warning/amber |
| `info` | Info/blue |

**Usage:** Always use the token names — never hardcode hex values.

```tsx
// Correct
className="bg-primary-500 text-neutral-950"

// Wrong — never hardcode
className="bg-[#E0AA36]"
```

### Typography

Defined in `src/app/tokens/typography.css`. All type styles are CSS utility classes. **Never use arbitrary Tailwind font sizes** — always use these classes.

**Display (Playfair Display — serif, for headings):**

| Class | Size | Weight | Notes |
|-------|------|--------|-------|
| `text-display-1` | 96px | 900 | Hero headings |
| `text-display-1-underline` | 96px | 900 | Italic + underline accent variant |
| `text-display-2` | 48px | 900 | Section headings |
| `text-display-2-italic` | 48px | 900 | Italic section headings |
| `text-display-3` | 32px | 900 | Sub-section headings |
| `text-display-3-italic` | 32px | 900 | Italic sub-section headings |
| `text-display-4` | 24px | 900 | Card headings |
| `text-display-5` | 16px | 900 | Small headings |
| `text-display-5-upper` | 16px | 900 | Small uppercase labels |
| `text-regular-italic` | 24px | 400 | Playfair italic body accent |

**Body (Inter — sans-serif):**

| Class | Size | Weight | Notes |
|-------|------|--------|-------|
| `text-large` | 32px | 500 | Large body/intro |
| `text-medium` | 24px | 500 | Medium body |
| `text-base` | 16px | 500 | Default body |
| `text-base-bold` | 16px | 700 | Bold body |
| `text-base-upper` | 16px | 900 | Uppercase label |
| `text-small` | 14px | 400 | Small text |
| `text-small-bold` | 14px | 700 | Small bold |
| `text-small-upper` | 14px | 700 | Small uppercase |

**Responsive semantic classes** (use for page sections — they scale from `display-3` on mobile to `display-2` on `md:`):

- `about-title`, `services-title`, `team-title`, `portfolio-title`, `testimonials-title`
- `hero-title` — scales from `display-2` to `display-1` at `md:`

---

## Component Patterns

### File locations

```
client/src/
  app/                    # Next.js App Router pages and layouts
    tokens/               # CSS design token files
  components/             # All shared React components
  lib/                    # Data fetching, GraphQL, utilities
```

### Server vs Client Components

- **Default to Server Components.** Pages and layouts are async Server Components that fetch data.
- **Mark `'use client'` only when needed** — forms, stateful UI, interactive carousels.
- Server Components fetch from WordPress via `fetchWordPressGraphQL()` in `lib/wordpress-ssr.ts` and pass data as props to Client Components.

### Naming

- **Components:** PascalCase (`HomeHeroSection`, `ServiceCard`, `BlogArticle`)
- **Page sections:** `{Page}{Section}` (e.g., `HomeAboutSection`, `HomeStatsSection`)
- **CSS classes:** kebab-case Tailwind utilities; custom classes descriptively named (`clip-diagonal`, `skew-panel`)
- **Props:** camelCase; use descriptive names over generic ones

### Button variants

Three variants exist in `Button.tsx` — use them; do not create ad-hoc button styles:

- `primary` — filled gold/amber, offset shadow
- `secondary` — outlined
- `tertiary` — text-only / ghost

Button shadow pattern (platform-style effect, preserve on all buttons):
```tsx
shadow-[4px_4px_0px_var(--color-primary-900)]
hover:shadow-[2px_2px_0px_var(--color-primary-900)]
hover:translate-x-[2px] hover:translate-y-[2px]
```

### Visual effects (preserve these — part of the brand)

```css
/* Diagonal section cuts */
.clip-diagonal      { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
.clip-diagonal-reverse { clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%); }

/* Skewed panels */
.skew-panel   { transform: skewY(-2deg); }
.skew-content { transform: skewY(2deg); }  /* counter-skew inner content */
```

---

## Data Fetching

All GraphQL queries live in `lib/wordpress-queries.ts` as tagged template literals.

- Fetch on the server with `fetchWordPressGraphQL()` from `lib/wordpress-ssr.ts` (sets `revalidate: 300`)
- TypeScript types for all WP post types are in `lib/wordpress-types.ts`
- Every query that returns a page includes the `SEO_FIELDS` fragment for Yoast metadata
- Dynamic routes implement `generateStaticParams()` to pre-render at build time

```ts
// Pattern for a page file
export async function generateStaticParams() { ... }

export default async function Page({ params }) {
  const data = await fetchWordPressGraphQL(MY_QUERY, { slug: params.slug });
  return <MyComponent data={data} />;
}
```

---

## SEO

- `buildMetadata()` in `lib/seo-utils.ts` maps Yoast fields to Next.js `Metadata`
- All pages export `generateMetadata()` calling `buildMetadata()`
- JSON-LD schemas: LocalBusiness in root layout, Service schema on service pages, Article schema on blog posts
- Never add SEO fields to GraphQL queries that aren't in the `SEO_FIELDS` fragment — the WPGraphQL SEO plugin only exposes what's defined there

---

## Forms

Forms submit to Netlify Forms. Three form names: `contact`, `estimate`, `estimate-request`.

- Static HTML detection files are in `public/` (required for Netlify to detect forms at build time)
- Form components are Client Components (`'use client'`) that manage state with `useState`
- Submit via `fetch` to the corresponding static HTML file URL
- Validate with `lib/form-validation.ts`

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/services` | Services listing |
| `/services/[slug]` | Service detail |
| `/projects` | Portfolio listing |
| `/projects/[slug]` | Project detail |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/contact` | Contact form |
| `/request-estimate` | Estimate request form |
| `/service-areas/[slug]` | Location-specific pages |

---

## Rules

1. **Use design tokens.** No hardcoded hex colors. No arbitrary `text-[px]` font sizes.
2. **Typography classes only.** Use `text-display-*`, `text-base`, `text-small`, etc. — never raw `text-3xl`.
3. **Server Components by default.** Only add `'use client'` when genuinely required.
4. **No new GraphQL fields** outside of the `SEO_FIELDS` fragment for SEO queries.
5. **Preserve visual effects.** Clip paths, skew panels, and button shadow patterns are intentional brand elements — do not remove or simplify them.
6. **Reuse existing components.** Check `components/` before creating new ones — `ServiceCard`, `ProjectCard`, `DetailView`, `Button`, `CtaBox` are all reusable.
7. **Phone numbers.** Display as `(XXX) XXX-XXXX` in UI text; use `tel:+1XXXXXXXXXX` in `href` attributes.
8. **No git commit/push without explicit user request.**
