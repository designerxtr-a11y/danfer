// Recomendaciones reales de la página de Facebook de Danfer Tours
// (https://www.facebook.com/danfertours/reviews). Facebook no da estrellas,
// solo "recomienda", así que se muestran sin rating y NO alimentan el schema
// de estrellas (Google no admite reseñas copiadas de otros sitios).
export const FACEBOOK_REVIEWS_URL = "https://www.facebook.com/danfertours/reviews";

export interface FacebookReview {
  id: string;
  author_name: string;
  date: string; // YYYY-MM-DD
  body: string;
}

export const FACEBOOK_REVIEWS: FacebookReview[] = [
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
