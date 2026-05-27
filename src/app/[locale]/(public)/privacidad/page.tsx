import { LegalShell } from "@/components/legal/legal-shell";

export const metadata = {
  title: "Política de privacidad · Danfer Tours Cusco",
  description:
    "Cómo recolectamos, usamos y protegemos tus datos personales en Danfer Tours Cusco.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <LegalShell title="Política de privacidad" updatedAt="27 de mayo de 2026">
      <p>
        En <strong>Danfer Tours Cusco</strong> respetamos tu privacidad y
        cumplimos con la Ley de Protección de Datos Personales del Perú (Ley
        N° 29733) y el RGPD para clientes de la UE.
      </p>

      <h2>1. Qué datos recolectamos</h2>
      <ul>
        <li><strong>Reservas</strong>: nombre, email, teléfono, país, datos de pasaporte, fecha de viaje, número de viajeros.</li>
        <li><strong>Formularios</strong>: nombre, email, teléfono, mensaje.</li>
        <li><strong>Pagos</strong>: procesados por Stripe — no almacenamos números de tarjeta en nuestros servidores.</li>
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
        <li>Stripe (pagos)</li>
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
