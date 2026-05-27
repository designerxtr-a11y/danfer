import { LegalShell } from "@/components/legal/legal-shell";

export const metadata = {
  title: "Términos y condiciones · Danfer Tours Cusco",
  description:
    "Términos y condiciones de uso del sitio y de los servicios turísticos de Danfer Tours Cusco.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <LegalShell title="Términos y condiciones" updatedAt="27 de mayo de 2026">
      <p>
        Bienvenido a <strong>Danfer Tours Cusco</strong> ("nosotros",
        "nuestra"). Al usar este sitio y reservar nuestros servicios, aceptas
        estos términos.
      </p>

      <h2>1. Quiénes somos</h2>
      <p>
        Danfer Tours Cusco S.A.C. es un operador turístico registrado en el
        Ministerio de Comercio Exterior y Turismo del Perú (MINCETUR) con sede
        en Av. El Sol 314, Cusco, Perú.
      </p>

      <h2>2. Reservas</h2>
      <ul>
        <li>Las reservas se confirman una vez recibido el pago total (o el depósito acordado).</li>
        <li>Para el Camino Inca y otros tours con cupos limitados, se requiere el pago completo al momento de reservar debido a la disponibilidad de permisos oficiales.</li>
        <li>Es responsabilidad del cliente proveer información correcta de pasaporte y datos de contacto.</li>
      </ul>

      <h2>3. Precios</h2>
      <p>
        Los precios están en dólares americanos (USD) salvo indicación. Pueden
        variar por temporada o cambios en tarifas oficiales (entradas, trenes).
        El precio mostrado al momento de reservar es el que se aplica.
      </p>

      <h2>4. Responsabilidades del viajero</h2>
      <ul>
        <li>Aclimatarse a la altitud antes de tours exigentes (mínimo 2 días en Cusco).</li>
        <li>Consultar a su médico si tiene condiciones preexistentes.</li>
        <li>Llevar pasaporte vigente y, si aplica, visa.</li>
        <li>Contratar seguro de viaje (recomendado).</li>
      </ul>

      <h2>5. Cambios de itinerario</h2>
      <p>
        Por razones de seguridad, clima o decisiones de autoridades, podríamos
        modificar el itinerario. Siempre buscaremos una alternativa equivalente
        o reembolsaremos la parte no realizada.
      </p>

      <h2>6. Cancelación</h2>
      <p>
        Consulta nuestra <a href="/cancelacion">política de cancelación</a>{" "}
        detallada.
      </p>

      <h2>7. Limitación de responsabilidad</h2>
      <p>
        Danfer Tours no se hace responsable por:
      </p>
      <ul>
        <li>Pérdida de equipaje fuera de nuestros vehículos.</li>
        <li>Lesiones derivadas de no seguir las instrucciones del guía.</li>
        <li>Cambios en horarios de proveedores terceros (trenes, vuelos).</li>
        <li>Eventos de fuerza mayor (terremotos, huelgas, pandemias).</li>
      </ul>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Todo el contenido del sitio (textos, fotos, logos) es propiedad de
        Danfer Tours Cusco S.A.C. y está protegido por derechos de autor.
      </p>

      <h2>9. Jurisdicción</h2>
      <p>
        Estos términos se rigen por las leyes del Perú. Cualquier disputa se
        someterá a los tribunales de Cusco.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para consultas legales escríbenos a{" "}
        <a href="mailto:legal@danfertourscusco.com">
          legal@danfertourscusco.com
        </a>
        .
      </p>
    </LegalShell>
  );
}
