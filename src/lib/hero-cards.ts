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
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
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
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/valle-sagrado-1789099156026.webp",
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
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/rainbow-mountain-1789091035693.webp",
  },
  {
    country: "Perú",
    region: "Cusco",
    title: "Camino Inca",
    slug: "camino-inca",
    rating: 4.9,
    reviews: 410,
    days: "4D/3N",
    price: 750,
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/camino-inca-1789091394992.webp",
  },
  {
    country: "Perú",
    region: "Salkantay",
    title: "Laguna Humantay",
    slug: "laguna-humantay",
    rating: 4.8,
    reviews: 780,
    days: "Full day",
    price: 80,
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/laguna-humantay-1789091396425.webp",
  },
];
