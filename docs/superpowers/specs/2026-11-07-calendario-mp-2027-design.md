# Calendario Machu Picchu 2027 con pre-reserva y pago PayPal

Fecha: 2026-11-07 · Sitio: danfertourscusco.com (ES / EN / JA).

## Objetivo

Captar a quienes buscan "disponibilidad / entradas Machu Picchu 2027" antes de que abra la venta oficial (mediados de diciembre). El cliente elige fecha, ruta y horario, carga los datos y pasaportes de cada pasajero y paga el tour completo por PayPal. Cuando abre la venta, Danfer compra los boletos.

## Producto y precio

- Tour **Machu Picchu 2D/1N**, **US$380 por persona** (entrada incluida). Precio igual al del tour en la BD.
- **Pago completo** por PayPal / tarjeta. **+5% por pago con tarjeta**, igual que en las cotizaciones. *(Supuesto: confirmar con el usuario.)*
- **Política** (visible antes de pagar): si al abrir la venta no hay cupo en la fecha, ruta u hora elegida, se ofrece otra opción o se **reembolsa el 100%**. *(Supuesto: confirmar con el usuario.)*

## Página

`/machu-picchu-2027`, `/en/machu-picchu-2027`, `/ja/machu-picchu-2027`. Estática (●). El formulario y el pago corren en el cliente y en server actions, así que la página no se vuelve dinámica.

### 1. Cabecera
- Título y aviso: "La venta oficial 2027 abre en diciembre. Pre-reserva hoy y compramos tu entrada apenas abra."
- Insignias de confianza: Tripadvisor 5.0 (`src/lib/social-proof.ts`) y MINCETUR.

### 2. Calendario 2027
- Navegación mes a mes, de enero a diciembre de 2027.
- Temporada por fecha: alta de mayo a septiembre ("alta demanda, reserva ya") y regular el resto del año.
- No se muestran cupos: no existen hasta que abra la venta.

### 3. Ruta y horario
- Rutas oficiales agrupadas por circuito, con una línea de descripción cada una:
  - Circuito 1: 1A Montaña Machupicchu, 1B Terraza superior, 1C Portada Intipunku, 1D Puente Inca.
  - Circuito 2: 2A Clásico (recomendada para primera vez), 2B Terraza inferior.
  - Circuito 3: 3A Huayna Picchu, 3B Realeza, 3C Gran Caverna, 3D Huchuy Picchu.
- Las rutas con montaña (1A, 3A, 3D) se marcan como "cupos muy limitados". Con US$380, el precio es el mismo para todas en esta versión.
- **Horario de ingreso:** selector por hora, de 06:00 a 14:00 en general. Las rutas con montaña ofrecen solo los turnos de la mañana (de 07:00 a 10:00). Es una **preferencia**: la hora final se confirma al comprar. Los rangos van en un único archivo de datos para poder ajustarlos sin tocar la interfaz.

### 4. Pasajeros (repetible)
- Una tarjeta por pasajero con: nombre y apellidos (como en el documento), tipo de documento (Pasaporte / DNI), número, nacionalidad, fecha de nacimiento y **foto del pasaporte o DNI**.
- **"+ Agregar pasajero"** suma otra tarjeta (máximo 10). Cada tarjeta, salvo la primera, tiene un botón para quitarla.
- Las fotos se suben con el mismo sistema que las cotizaciones: compresión en el navegador y bucket privado `client-documents`, en la carpeta `mp2027/<código de reserva>/`. Se ven en el admin, en Pasaportes.
- **Titular:** email, WhatsApp y hospedaje en Cusco (opcional, para el recojo).

### 5. Resumen y pago
- Muestra fecha, ruta, hora, n.º de pasajeros, US$380 × n, el 5% y el total.
- Hay que aceptar la política antes de pagar.
- El botón de PayPal reutiliza `src/lib/paypal.ts`. **El servidor recalcula el monto** a partir del número de pasajeros: nunca confía en el monto que manda el navegador.
- Al capturar el pago se guarda la reserva en `bookings` (o en una tabla nueva si `bookings` no admite estos campos: se decide en el plan tras revisar el esquema) con estado `confirmed`, la fecha, ruta, hora y los datos de los pasajeros. Aparece en Admin › Reservas.
- Después del pago, pantalla de confirmación con el código de reserva y un enlace a WhatsApp.
- Si el pago falla o se cancela, el cliente ve un mensaje y la salida por WhatsApp, y no se guarda nada como pagado.

### 6. Validación
- No se puede pagar sin fecha, ruta, hora, datos completos de todos los pasajeros y aceptación de la política.
- La foto del documento es obligatoria por pasajero. Se puede subir antes de pagar y queda asociada a un código de borrador.

## Enlaces internos
- Menú: Machu Picchu.
- Página del tour `machu-picchu-2d-1n`.
- Posts de entradas: `entradas-machu-picchu-circuitos` y `entradas-machu-picchu-agotadas`.
- Sitemap con hreflang es/en/ja.

## Fuera de alcance
- Cupos en vivo (cuando abra la venta: fase aparte con la fuente oficial).
- Precios distintos por ruta.
- Correo automático al cliente. Danfer confirma por WhatsApp y el correo hola@ ya existe.
- Corregir la tabla de rutas del post `entradas-machu-picchu-circuitos` (tarea aparte).
