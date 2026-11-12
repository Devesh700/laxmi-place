# Laxmi Chandra Palace — Hotel & In-House Restaurant Website

SEO-first, mobile-first Next.js 15 (App Router) portfolio website with direct Call/WhatsApp booking and a **Room Master** (`/admin`) management panel backed by Firebase Firestore & Cloud Storage.

## 1. Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## 2. Replace Placeholder Business Facts

All business details (hotel name, address, geo coordinates, phone numbers, WhatsApp number, email, timings, restaurant menu, policies, FAQs, and testimonials) are centralized in `src/config/site.ts` and marked with `// TODO(owner)`.

- Set `showTestimonials: true` in `src/config/site.ts` only after replacing placeholder reviews with verified guest reviews.
- Set `googleRating.isPlaceholder: false` after entering your real Google rating & listing URL.

## 3. Firebase Setup (Firestore + Storage)

1. Create a Firebase project and enable **Firestore Database** and **Cloud Storage**.
2. Generate a Service Account key (`Project Settings -> Service Accounts -> Generate new private key`).
3. Copy the credentials into `.env.local`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (keep `\n` escaped in `.env.local`)
   - `FIREBASE_STORAGE_BUCKET` (e.g. `your-project.appspot.com`)
4. Deploy security rules using Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```
5. (Optional) Seed 3 sample rooms into Firestore:
   ```bash
   npx tsx scripts/seed.ts
   ```

## 4. Room Master Admin (`/admin`)

1. Set a long random string (12+ chars) for `ADMIN_DEV_TOKEN` in `.env.local` (never prefix with `NEXT_PUBLIC_`).
2. Visit `/admin/login` and enter `ADMIN_DEV_TOKEN`.
3. If `ADMIN_DEV_TOKEN` is missing, `/admin/**` returns `404`.

## 5. Verification

```bash
npm run lint
npm run build
npx tsx --test tests/availability.test.ts
```
