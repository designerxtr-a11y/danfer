// Licencias y asociaciones de Danfer Tours. Agregar SOLO las que la agencia
// tenga de verdad (logo en /public/certifications/). Vacía = no se muestra la
// sección.
export interface Certification {
  name: string;
  logo: string;
}

export const CERTIFICATIONS: Certification[] = [];
