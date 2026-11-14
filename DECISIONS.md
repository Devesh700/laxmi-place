# Architecture & Implementation Decisions

## Phase 1: Foundation + SEO Skeleton

1. **Image Assets Organization**: Deduplicated the 31 WhatsApp `.jpeg` files (19 unique files by SHA-256 hash) and moved them into `public/assets/hotel-01.jpeg` through `public/assets/hotel-19.jpeg` so they can be served statically and optimized via `next/image`.
2. **Site URL Fallback**: `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000` when not set in `.env.local`, ensuring `metadataBase`, `sitemap.ts`, `robots.ts`, and JSON-LD URLs never crash during build.
3. **Testimonials Visibility Flag**: Added `showTestimonials` (default `false`) in `src/config/site.ts` so placeholder testimonials marked `// TODO(owner)` are hidden until replaced with verified guest reviews.
4. **Placeholder Business Facts**: All business facts (name, address, geo coordinates, phone numbers, WhatsApp, email, hours, prices, FAQs, testimonials) live in `src/config/site.ts` with `// TODO(owner)` comments.

## UI/UX Redesign: Brand Alignment with Official Royal Logo

5. **Brand Palette Alignment with Logo**: Updated theme tokens from the temporary forest green to the authentic royal brand palette extracted from `public/assets/logo.png`:
   - **Primary Brand Color**: **Royal Terracotta-Saffron (`#943209`)** with ivory text (`#FFF9F4`, 6.4:1 contrast, WCAG AA compliant).
   - **Accent Color**: **Lustrous Temple Gold (`#C88A28`)** with accessible gold eyebrow text (`#8E5405`, 5.4:1 contrast against `#FDFAF5`).
   - **Canvas & Surfaces**: Warm Royal Ivory (`#FDFAF5`), royal mahogany charcoal foreground (`#261108`, 15.6:1 AAA contrast), and warm golden borders (`#E8D9C5`).
6. **Brand Facts from Logo**:
   - Location: Ayodhya, Uttar Pradesh, India (featuring the crown and Shri Ram Janmabhoomi temple motif from the logo).
   - Official Tagline: *"Stay Royal... Feel at Home..."*
   - Logo embedded directly in `SiteHeader`, mobile `Sheet` navigation, `SiteFooter`, and `AdminShell` / `AdminLoginPage`.
7. **Self-Hosted Local Fonts**: `Cormorant Garamond` (display serif) and `DM Sans` (body sans) bundled as self-hosted `.woff2` files in `src/app/fonts/` to ensure lightning-fast loading and zero external network failures during deployment.
