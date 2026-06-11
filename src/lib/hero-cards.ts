/**
 * Tarjetas flotantes del hero de la portada: valores por defecto.
 * Texto/precio se sobreescriben desde /admin/settings (key jsonb
 * `hero_cards`) y la foto con `hero_images`; campo vacío = este default.
 */
export interface HeroCard {
  country: string;
  region: string;
  title: string;
  slug: string;
  rating: number;
  reviews: number;
  days: string;
  price: number;
  img: string;
}

export const HERO_CARD_DEFAULTS: HeroCard[] = [
  {
    country: "Perú",
    region: "Cusco",
    title: "Machu Picchu",
    slug: "machu-picchu",
    rating: 4.9,
    reviews: 1840,
    days: "Full day",
    price: 380,
    img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
  },
  {
    country: "Perú",
    region: "Valle Sagrado",
    title: "Pisac & Ollanta",
    slug: "valle-sagrado",
    rating: 4.8,
    reviews: 920,
    days: "Full day",
    price: 195,
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop",
  },
  {
    country: "Perú",
    region: "Cusco",
    title: "Rainbow Mountain",
    slug: "rainbow-mountain",
    rating: 4.7,
    reviews: 640,
    days: "Full day",
    price: 85,
    img: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=800&auto=format&fit=crop",
  },
];
