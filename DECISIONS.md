# Architecture & Implementation Decisions

## Phase 1: Foundation + SEO Skeleton

1. **Image Assets Organization**: Deduplicated the 31 WhatsApp `.jpeg` files (19 unique files by SHA-256 hash) and moved them into `public/assets/hotel-01.jpeg` through `public/assets/hotel-19.jpeg` so they can be served statically and optimized via `next/image`.
2. **Site URL Fallback**: `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000` when not set in `.env.local`, ensuring `metadataBase`, `sitemap.ts`, `robots.ts`, and JSON-LD URLs never crash during build.
3. **Testimonials Visibility Flag**: Added `showTestimonials` (default `false`) in `src/config/site.ts` so placeholder testimonials marked `// TODO(owner)` are hidden until replaced with verified guest reviews.
4. **Placeholder Business Facts**: All business facts (name, address, geo coordinates, phone numbers, WhatsApp, email, hours, prices, FAQs, testimonials) live in `src/config/site.ts` with `// TODO(owner)` comments.

## UI/UX Redesign Step 1: Design Tokens & Typography

5. **Primary Brand Color**: Chose **Deep Forest Green (`#1F3D2F`)** as `--primary` (with `#FAF7F2` foreground, ~10.8:1 contrast) paired with **Antique Gold (`#B8935A`)** as `--accent`. For small uppercase eyebrow text on `#FAF7F2` warm ivory, defined `--gold-text: #8A6832` (~4.8:1 contrast) to satisfy WCAG AA 4.5:1.
6. **Typography**: Loaded `Cormorant_Garamond` (weights 600, 700) for display headings (`--font-serif`) and `DM_Sans` (weights 400, 500) for body copy (`--font-sans`) via `next/font/google` (2 families, 4 weights total).
7. **Component Library**: Initialized `shadcn/ui` (`base-nova` style, Tailwind v4 CSS variables) and added the requested UI primitives. Extended `Button` with `gold`, `whatsapp`, and `outline-light` variants and 44px+ minimum tap targets.
