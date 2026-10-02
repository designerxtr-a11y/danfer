import { LegalShell } from "@/components/legal/legal-shell";
import { buildAlternates } from "@/lib/seo/alternates";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en
      ? "Cancellation policy · Danfer Tours Cusco"
      : "Política de cancelación · Danfer Tours Cusco",
    description: en
      ? "Clear, fair cancellation, refund and date-change policy for Danfer Tours Cusco tours."
      : "Política clara y justa de cancelaciones, reembolsos y cambios para tours de Danfer Tours Cusco.",
    alternates: buildAlternates("/cancelacion", locale),
  };
}

export default async function CancelacionPage({ params }: PageProps) {
  const { locale } = await params;
  return locale === "en" ? <CancellationEn /> : <CancelacionEs />;
}

function CancelacionEs() {
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

function CancellationEn() {
  return (
    <LegalShell title="Cancellation policy" updatedAt="May 27, 2026" en>
      <p>
        Our policy is clear and fair: <strong>the sooner you let us know, the
        more you get back</strong>. Details depend on the type of tour.
      </p>

      <h2>Day tours (Machu Picchu Full Day, Sacred Valley, Rainbow Mountain, Humantay Lake, City Tour)</h2>
      <ul>
        <li><strong>More than 7 days before</strong>: 100% refund.</li>
        <li><strong>Between 3 and 7 days before</strong>: 50% refund.</li>
        <li><strong>Less than 72 hours</strong>: no refund (suppliers have already issued non-refundable tickets).</li>
      </ul>

      <h2>Multi-day tours (Inca Trail 4D/3N, Salkantay, Ausangate)</h2>
      <p>
        These require official permits issued in your name that cannot be
        refunded, so the policy is different:
      </p>
      <ul>
        <li><strong>More than 60 days before</strong>: deposit refunded minus a US$100 administration fee.</li>
        <li><strong>Between 30 and 60 days before</strong>: 50% refund.</li>
        <li><strong>Less than 30 days</strong>: the deposit is not refunded.</li>
        <li>Permits can only be transferred in some cases — ask us first.</li>
      </ul>

      <h2>Date changes</h2>
      <ul>
        <li>Day tours: change your date for free up to 72 hours before (subject to availability).</li>
        <li>Inca Trail: changes depend on whether the permit can be transferred (not always possible).</li>
      </ul>

      <h2>Cancellations on our side</h2>
      <p>
        If we cancel a tour for operational reasons, extreme weather, decisions
        by the Ministry of Culture (MINCUL) or force majeure:
      </p>
      <ul>
        <li>We offer to reschedule at no cost.</li>
        <li>If that isn&apos;t possible, we refund 100%.</li>
      </ul>

      <h2>No-show</h2>
      <p>
        If you aren&apos;t at the pickup point at the scheduled time, the tour
        counts as taken and there is no refund. Please be ready 15 minutes early.
      </p>

      <h2>How to request a refund</h2>
      <ol className="list-decimal pl-5 text-night/75 space-y-1 mb-4">
        <li>Email <a href="mailto:reembolsos@danfertourscusco.com">reembolsos@danfertourscusco.com</a> with your booking code.</li>
        <li>You&apos;ll get a confirmation within 24 business hours.</li>
        <li>The refund is made through the original payment method within 5–10 business days.</li>
      </ol>

      <h2>Travel insurance</h2>
      <p>
        <strong>We strongly recommend</strong> travel insurance that covers
        cancellation due to illness, emergencies or unexpected events.
      </p>
    </LegalShell>
  );
}
