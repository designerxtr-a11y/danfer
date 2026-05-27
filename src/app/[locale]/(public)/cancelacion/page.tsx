import { LegalShell } from "@/components/legal/legal-shell";

export const metadata = {
  title: "Política de cancelación · Danfer Tours Cusco",
  description:
    "Política clara y justa de cancelaciones, reembolsos y cambios para tours de Danfer Tours Cusco.",
  alternates: { canonical: "/cancelacion" },
};

export default function CancelacionPage() {
  return (
    <LegalShell title="Política de cancelación" updatedAt="27 de mayo de 2026">
      <p>
        Nuestra política es clara y justa: <strong>cuanto antes nos avises,
        más reembolso recibes</strong>. Los detalles varían por tipo de tour.
      </p>

      <h2>Tours de un día (Machu Picchu Full Day, Valle Sagrado, Rainbow Mountain, Laguna Humantay, City Tour)</h2>
      <ul>
        <li><strong>Más de 7 días antes</strong>: reembolso del 100%.</li>
        <li><strong>Entre 3 y 7 días antes</strong>: reembolso del 50%.</li>
        <li><strong>Menos de 72 horas</strong>: sin reembolso (los proveedores ya emitieron tickets no reembolsables).</li>
      </ul>

      <h2>Tours multidía (Camino Inca 4D/3N, Salkantay, Ausangate)</h2>
      <p>
        Estos requieren permisos oficiales nominativos que no se devuelven,
        por lo que la política es distinta:
      </p>
      <ul>
        <li><strong>Más de 60 días antes</strong>: reembolso del depósito menos US$ 100 de gastos administrativos.</li>
        <li><strong>Entre 30 y 60 días antes</strong>: reembolso del 50%.</li>
        <li><strong>Menos de 30 días</strong>: sin reembolso del depósito.</li>
        <li>El permiso es transferible solo en algunos casos — consulta antes.</li>
      </ul>

      <h2>Cambios de fecha</h2>
      <ul>
        <li>Tours de un día: puedes cambiar fecha gratis hasta 72 horas antes (sujeto a disponibilidad).</li>
        <li>Camino Inca: el cambio depende de transferencia del permiso (no siempre posible).</li>
      </ul>

      <h2>Cancelaciones por nuestra parte</h2>
      <p>
        Si por razones operativas, clima extremo, decisiones del MINCUL o
        eventos de fuerza mayor cancelamos el tour:
      </p>
      <ul>
        <li>Te ofrecemos reagendar sin costo.</li>
        <li>Si no es posible, reembolsamos el 100%.</li>
      </ul>

      <h2>No-show</h2>
      <p>
        Si no llegas al punto de recojo en el horario indicado, el tour se
        considera tomado y no hay reembolso. Llega 15 minutos antes.
      </p>

      <h2>Cómo solicitar tu reembolso</h2>
      <ol className="list-decimal pl-5 text-night/75 space-y-1 mb-4">
        <li>Escribe a <a href="mailto:reembolsos@danfertourscusco.com">reembolsos@danfertourscusco.com</a> con tu código de reserva.</li>
        <li>Recibirás confirmación en máximo 24 horas hábiles.</li>
        <li>El reembolso se procesa por la misma vía del pago en 5–10 días hábiles.</li>
      </ol>

      <h2>Seguro de viaje</h2>
      <p>
        <strong>Recomendamos encarecidamente</strong> contratar un seguro de
        viaje que cubra cancelación por enfermedad, emergencias o eventos
        imprevistos.
      </p>
    </LegalShell>
  );
}
