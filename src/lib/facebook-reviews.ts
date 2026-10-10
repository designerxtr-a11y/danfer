// Recomendaciones reales de la página de Facebook de Danfer Tours
// (https://www.facebook.com/danfertours/reviews). Facebook no da estrellas,
// solo "recomienda", así que se muestran sin rating y NO alimentan el schema
// de estrellas (Google no admite reseñas copiadas de otros sitios).
export const FACEBOOK_REVIEWS_URL = "https://www.facebook.com/danfertours/reviews";

// Página de origen de las recomendaciones de 2026 (antes cargadas como reseñas
// 5★ en la migración 00012; se despublicaron de `reviews` el 2026-10-09).
const FACEBOOK_REVIEWS_URL_2026 = "https://www.facebook.com/Danfertourscusco/reviews";

export interface FacebookReview {
  id: string;
  author_name: string;
  date: string; // YYYY-MM-DD
  body: string;
  url?: string; // por defecto FACEBOOK_REVIEWS_URL
}

export const FACEBOOK_REVIEWS: FacebookReview[] = [
  {
    id: "fb-avi-porras-zevallos",
    author_name: "Avi Porras Zevallos",
    date: "2026-04-20",
    body: "Súper recomendado, desde inicio a fin muy puntuales con todo lo ofrecido. Los guías muy amables y divertidos.",
    url: FACEBOOK_REVIEWS_URL_2026,
  },
  {
    id: "fb-yoel-alexander",
    author_name: "Yoel Alexander",
    date: "2026-04-14",
    body: "100% recomendado. Tuvimos una experiencia increíble; cumplieron con cada detalle del itinerario al pie de la letra. Desde el inicio hasta el final, el servicio fue impecable y profesional.",
    url: FACEBOOK_REVIEWS_URL_2026,
  },
  {
    id: "fb-margeory-castaneda-ramos",
    author_name: "Margeory Castañeda Ramos",
    date: "2026-03-29",
    body: "Muy recomendado, súper atentos desde que te recogen del aeropuerto hasta que finaliza el tour. Lo mejor es que te ayudan a planificar el tour de acuerdo a la disponibilidad de cada turista.",
    url: FACEBOOK_REVIEWS_URL_2026,
  },
  {
    id: "fb-lucy-chavez-esquivel",
    author_name: "Lucy Chavez Esquivel",
    date: "2026-03-17",
    body: "Si tienen pensado viajar a este hermoso lugar, la mejor opción es con esta empresa. No te tienes que preocupar por nada, tienen las mejores guías A1. Una empresa muy seria.",
    url: FACEBOOK_REVIEWS_URL_2026,
  },
  {
    id: "fb-angy-valentin",
    author_name: "Angy Valentín",
    date: "2026-02-26",
    body: "Súper recomendado, realizaron una excelente planificación de nuestro itinerario. Las personas son muy amables y están en constante comunicación. Todo lo mencionado en el itinerario se cumplió al 100%.",
    url: FACEBOOK_REVIEWS_URL_2026,
  },
  {
    id: "fb-lori-cristina-pinto",
    author_name: "Lori Cristina Pinto",
    date: "2022-06-03",
    body: "En mi primera visita a Cusco, tenía miedo de no encontrar una buena agencia turística o no disfrutar bien de esta hermosa ciudad, sin embargo Danfer Tours me ayudó desde el primer día a organizar mi estancia al máximo. Tienen excelentes guías, promociones, paquetes, puntualidad y compromiso. Súper recomendado!!! Gracias a todo el equipo, en especial al señor Juan Carlos quien estuvo pendiente de nosotros en todo momento.",
  },
  {
    id: "fb-carlos-francia-yaya",
    author_name: "Carlos Francia Yaya",
    date: "2021-10-01",
    body: "Excelente servicios de primera calidad con guías super carismáticos y amigables super profesionales 100%, se los recomiendo... saludos especiales para la sra. Luz y su esposo por el buen servicio... éxitos y bendiciones.",
  },
  {
    id: "fb-m-teresa-sasso",
    author_name: "M Teresa Sasso",
    date: "2018-08-18",
    body: "La amabilidad. Confiabilidad. Excelente.",
  },
  {
    id: "fb-sara-janeth",
    author_name: "Sara Janeth",
    date: "2018-08-06",
    body: "Excelente servicio, buena atención por parte del señor Carlos y su esposa. Servicio recomendado. Gracias Danfer Tours...",
  },
];
