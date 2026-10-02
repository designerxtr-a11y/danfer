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
      ? "Privacy policy · Danfer Tours Cusco"
      : "Política de privacidad · Danfer Tours Cusco",
    description: en
      ? "How Danfer Tours Cusco collects, uses and protects your personal data."
      : "Cómo recolectamos, usamos y protegemos tus datos personales en Danfer Tours Cusco.",
    alternates: buildAlternates("/privacidad", locale),
  };
}

export default async function PrivacidadPage({ params }: PageProps) {
  const { locale } = await params;
  return locale === "en" ? <PrivacyEn /> : <PrivacidadEs />;
}

function PrivacidadEs() {
  return (
    <LegalShell title="Política de privacidad" updatedAt="1 de octubre de 2026">
      <p>
        En <strong>Danfer Tours Cusco</strong> respetamos tu privacidad y
        cumplimos con la Ley de Protección de Datos Personales del Perú (Ley
        N° 29733) y el RGPD para clientes de la UE.
      </p>

      <h2>1. Qué datos recolectamos</h2>
      <ul>
        <li><strong>Reservas</strong>: nombre, email, teléfono, país, datos de pasaporte, fecha de viaje, número de viajeros.</li>
        <li><strong>Formularios</strong>: nombre, email, teléfono, mensaje.</li>
        <li><strong>Pagos</strong>: procesados por PayPal — no almacenamos números de tarjeta en nuestros servidores.</li>
        <li><strong>Cookies</strong>: idioma preferido, sesión de admin.</li>
        <li><strong>Analytics</strong>: páginas visitadas (anonimizado).</li>
      </ul>

      <h2>2. Cómo los usamos</h2>
      <ul>
        <li>Procesar tu reserva y enviarte confirmaciones.</li>
        <li>Coordinar el tour (recojo, guía, transporte).</li>
        <li>Responder consultas y solicitudes.</li>
        <li>Enviarte ofertas si te suscribiste (puedes darte de baja cuando quieras).</li>
        <li>Mejorar el sitio y nuestros servicios.</li>
      </ul>

      <h2>3. Con quién los compartimos</h2>
      <p>Solo con quien necesita procesarlos para tu viaje:</p>
      <ul>
        <li>PayPal (pagos)</li>
        <li>Resend (envío de emails)</li>
        <li>Supabase (almacenamiento)</li>
        <li>Operadores oficiales (PeruRail, Consettur, MINCUL) para emitir tickets</li>
        <li>Autoridades cuando lo exija la ley</li>
      </ul>
      <p>
        <strong>Nunca</strong> vendemos tus datos a terceros con fines de marketing.
      </p>

      <h2>4. Tus derechos</h2>
      <p>Tienes derecho a:</p>
      <ul>
        <li>Acceder a tus datos</li>
        <li>Rectificarlos si están desactualizados</li>
        <li>Solicitar su eliminación (excepto datos requeridos por ley contable)</li>
        <li>Oponerte al tratamiento para fines comerciales</li>
        <li>Portabilidad de datos</li>
      </ul>
      <p>
        Para ejercer estos derechos escribe a{" "}
        <a href="mailto:privacidad@danfertourscusco.com">
          privacidad@danfertourscusco.com
        </a>{" "}
        — respondemos en máximo 15 días.
      </p>

      <h2>5. Seguridad</h2>
      <p>
        Usamos SSL/TLS en todo el sitio, Supabase con Row Level Security para
        la base de datos, y autenticación segura para el panel admin.
      </p>

      <h2>6. Retención</h2>
      <p>
        Guardamos tus datos mientras seas cliente y por 5 años adicionales por
        obligaciones contables. Después se eliminan o anonimizan.
      </p>

      <h2>7. Cookies</h2>
      <p>Usamos cookies estrictamente necesarias (sesión, idioma) y opcionales (analytics). Puedes desactivar las opcionales en tu navegador.</p>

      <h2>8. Contacto</h2>
      <p>
        Datos del responsable:<br />
        Danfer Tours Cusco S.A.C.<br />
        Av. El Sol 314, Cusco, Perú<br />
        <a href="mailto:privacidad@danfertourscusco.com">
          privacidad@danfertourscusco.com
        </a>
      </p>
    </LegalShell>
  );
}

function PrivacyEn() {
  return (
    <LegalShell title="Privacy policy" updatedAt="October 1, 2026" en>
      <p>
        At <strong>Danfer Tours Cusco</strong> we respect your privacy and
        comply with Peru&apos;s Personal Data Protection Law (Law No. 29733)
        and the GDPR for customers in the EU.
      </p>

      <h2>1. What data we collect</h2>
      <ul>
        <li><strong>Bookings</strong>: name, email, phone, country, passport details, travel date, number of travelers.</li>
        <li><strong>Forms</strong>: name, email, phone, message.</li>
        <li><strong>Payments</strong>: processed by PayPal — we don&apos;t store card numbers on our servers.</li>
        <li><strong>Cookies</strong>: preferred language, admin session.</li>
        <li><strong>Analytics</strong>: pages visited (anonymized).</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>Process your booking and send you confirmations.</li>
        <li>Coordinate the tour (pickup, guide, transport).</li>
        <li>Answer questions and requests.</li>
        <li>Send you offers if you subscribed (you can unsubscribe any time).</li>
        <li>Improve the website and our services.</li>
      </ul>

      <h2>3. Who we share it with</h2>
      <p>Only with those who need it to handle your trip:</p>
      <ul>
        <li>PayPal (payments)</li>
        <li>Resend (email delivery)</li>
        <li>Supabase (storage)</li>
        <li>Official operators (PeruRail, Consettur, MINCUL) to issue tickets</li>
        <li>Authorities when required by law</li>
      </ul>
      <p>
        We <strong>never</strong> sell your data to third parties for marketing.
      </p>

      <h2>4. Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your data</li>
        <li>Correct it if it&apos;s out of date</li>
        <li>Request its deletion (except data required by accounting law)</li>
        <li>Object to its use for commercial purposes</li>
        <li>Data portability</li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a href="mailto:privacidad@danfertourscusco.com">
          privacidad@danfertourscusco.com
        </a>{" "}
        — we reply within 15 days.
      </p>

      <h2>5. Security</h2>
      <p>
        We use SSL/TLS across the whole site, Supabase with Row Level Security
        for the database, and secure authentication for the admin panel.
      </p>

      <h2>6. Retention</h2>
      <p>
        We keep your data while you are a customer and for 5 more years for
        accounting obligations. After that it is deleted or anonymized.
      </p>

      <h2>7. Cookies</h2>
      <p>We use strictly necessary cookies (session, language) and optional ones (analytics). You can disable the optional ones in your browser.</p>

      <h2>8. Contact</h2>
      <p>
        Data controller:<br />
        Danfer Tours Cusco S.A.C.<br />
        Av. El Sol 314, Cusco, Peru<br />
        <a href="mailto:privacidad@danfertourscusco.com">
          privacidad@danfertourscusco.com
        </a>
      </p>
    </LegalShell>
  );
}
