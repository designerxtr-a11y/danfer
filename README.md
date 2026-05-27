# CuscoTours v2

Sitio premium de tours en Cusco con Next.js 15 + Supabase + Tailwind v4.

## Stack
- **Next.js 16** (App Router, RSC, Turbopack)
- **Supabase** Postgres + Auth + RLS
- **Tailwind CSS v4** + tipografías serif/handwritten/sans
- **Framer Motion** + **GSAP ScrollTrigger** + **Lenis** smooth scroll
- **i18n** light (es/en) con cookie

## Estructura
```
src/
├── app/
│   ├── (public)/         Sitio público (Navbar + Footer)
│   │   ├── page.tsx
│   │   ├── tours/
│   │   └── reservar/
│   ├── admin/            Panel admin (sidebar, sin nav pública)
│   │   ├── login/
│   │   ├── tours/
│   │   ├── bookings/
│   │   ├── inquiries/
│   │   ├── users/
│   │   └── settings/
│   ├── layout.tsx        Root (fonts + html/body)
│   └── globals.css       Palette + Tailwind theme
├── components/
│   ├── layout/           Navbar, Footer
│   ├── providers/        SmoothScroll (Lenis+GSAP)
│   ├── sections/         Hero, Stats, Featured, Destinations, Testimonials, ScrollVideo
│   └── tours/            Gallery, Itinerary, Booking widget, Reviews
├── lib/
│   ├── i18n/             Provider, messages, server helper
│   ├── queries/          Tours, categories, reviews
│   └── supabase/         client.ts, server.ts, admin.ts
├── types/database.ts     Tour, Review, Category types + t() helper
└── middleware.ts         Protege /admin
```

## Setup local

```bash
npm install
cp .env.example .env.local   # rellenar con tus credenciales de Supabase
npm run dev
```

Sitio en http://localhost:3000

## Crear primer admin

1. Ve a https://supabase.com/dashboard/project/pgzrzvvdrldlwiyopqgh/auth/users
2. Click **Add user** → Email + Password (sin email magic link)
3. Abre el SQL editor y ejecuta `supabase/migrations/00004_promote_admin.sql` **reemplazando tu email**
4. Login en http://localhost:3000/admin/login

## Deploy a Vercel

### 1. Push a GitHub
```bash
git init
git add .
git commit -m "Initial CuscoTours v2"
git remote add origin https://github.com/TU_USER/cuscotours-v2.git
git push -u origin main
```

### 2. Conectar Vercel
1. Ve a https://vercel.com/new
2. Importa el repo
3. **Environment Variables** (copia de tu .env.local):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → `https://tu-dominio.vercel.app`
4. Deploy

### 3. Dominio custom (opcional)
- En Vercel → Project Settings → Domains → Add `cuscotours.com`
- Apunta el DNS A record a `76.76.21.21`

## Lo que queda pendiente

| Feature | Status | Cómo activarlo |
|---------|--------|----------------|
| **Stripe pago real** | Mock | Crear cuenta en stripe.com, copiar `STRIPE_SECRET_KEY` al `.env.local`, descomentar el webhook en `actions.ts` |
| **Emails (confirmación, voucher PDF)** | TODO | Cuenta en resend.com → `RESEND_API_KEY` + plantillas en `components/emails/` |
| **i18n con URLs (/es, /en)** | Cookie-only | Refactor con `next-intl` y `[locale]` segments si SEO en inglés es prioridad |
| **Mapa Mapbox** | TODO | Integrar Mapbox GL con coords de `tour.starting_point` |
| **Reviews con foto upload** | TODO | Supabase Storage bucket + UI |
| **Admin: upload imagenes, rich text editor** | Básico | Integrar Tiptap o Lexical para descripción rica |

## Scripts útiles

```bash
node scripts/test-supabase.mjs    # ping a Supabase
node scripts/verify-data.mjs      # contar tablas y listar tours
```
