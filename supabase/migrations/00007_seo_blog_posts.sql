-- =============================================================
-- Migración 00007 — 5 blog posts SEO para Cusco/Machu Picchu
-- Target: keywords de cola larga (informacional) con alto volumen
-- =============================================================

-- ===== 1. CLIMA EN CUSCO MES A MES =====================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'clima-en-cusco-mes-a-mes',
  jsonb_build_object('es', 'Clima en Cusco mes a mes: cuándo viajar a Cusco y Machu Picchu'),
  jsonb_build_object('es', 'Guía completa del clima en Cusco mes a mes. Temperaturas, lluvias, festividades y la mejor época para visitar Machu Picchu, el Valle Sagrado y hacer trekking en los Andes peruanos.'),
  jsonb_build_object('es', $body$
# Clima en Cusco mes a mes: la guía definitiva para planificar tu viaje

Cusco tiene **dos estaciones bien marcadas**: temporada seca (mayo a septiembre) y temporada de lluvias (octubre a abril). La temperatura promedio anual es de **12°C**, pero la sensación térmica varía hasta 25 grados entre la noche y el mediodía. Si vas a hacer trekking, visitar Machu Picchu o Rainbow Mountain, el mes que elijas cambia totalmente la experiencia.

## TL;DR — La respuesta corta

**Mejor época para visitar Cusco**: mayo, junio, septiembre y octubre. **Peor mes**: febrero (lluvias intensas, Camino Inca cerrado). **Mes más concurrido**: julio (vacaciones de verano hemisferio norte + Fiestas Patrias en Perú).

| Mes | Lluvia | Temp. día/noche | Recomendado para |
|-----|--------|----------------|------------------|
| Enero | Alta | 19°C / 7°C | Selva, verde intenso |
| Febrero | **Muy alta** | 19°C / 7°C | ❌ Camino Inca cerrado |
| Marzo | Alta | 19°C / 7°C | Fin de lluvias, paisaje verde |
| Abril | Baja | 20°C / 6°C | ✅ Sweet spot, pocos turistas |
| Mayo | Mínima | 20°C / 3°C | ✅ Cielos despejados |
| Junio | Cero | 20°C / 0°C | ✅ Pico de calidad climática |
| Julio | Cero | 20°C / -1°C | ⚠ Mucha gente, Inti Raymi |
| Agosto | Cero | 21°C / 1°C | ⚠ Mucha gente, viento |
| Septiembre | Baja | 21°C / 4°C | ✅ Sweet spot post-pico |
| Octubre | Media | 22°C / 6°C | ✅ Buen clima, menos gente |
| Noviembre | Media-alta | 21°C / 7°C | Lluvias empiezan |
| Diciembre | Alta | 20°C / 7°C | Festividades, Santuranticuy |

## Cusco mes a mes en detalle

### Enero — Verde, lluvioso, romántico
Lluvias casi diarias por la tarde (10-15 mm/día), mañanas habitualmente despejadas. El campo está espectacular: terrazas verdes, río Urubamba caudaloso, orquídeas en bosque nubloso. Machu Picchu sigue abierto, el [Camino Inca](/destinos/camino-inca) también. **Pro**: precios bajos, menos turistas. **Contra**: caminos resbaladizos, vistas a veces tapadas por nubes.

### Febrero — El mes que mejor evitas
Pico de lluvias (~140 mm en el mes). El [Camino Inca cierra](/destinos/camino-inca) todo febrero por mantenimiento del SERNANP. El tren a Aguas Calientes puede sufrir cancelaciones por crecidas del río. No imposible visitar — el Salkantay y el tren a Machu Picchu siguen operativos — pero la experiencia es la peor del año. Si tu única opción es febrero, prioriza tour Full Day a [Machu Picchu](/destinos/machu-picchu) y deja Rainbow Mountain para otra visita.

### Marzo — Las lluvias se despiden
Las lluvias bajan a partir de la segunda quincena. Paisaje en su punto más verde justo cuando los turistas no han llegado. Excelente relación calidad/precio. Llueve aún 2-3 veces por semana pero menos intenso. **Recomendado**: Valle Sagrado (terrazas explotando de verde) y Machu Picchu con vegetación máxima.

### Abril — Empieza la temporada dorada
Sweet spot oficial: ya casi no llueve, cielos cada vez más despejados, Andes con vegetación todavía verde antes de secarse. Semana Santa es el único pico turístico, después baja la demanda. Reservas más flexibles, precios todavía moderados. **Mejor mes** para [Rainbow Mountain](/destinos/rainbow-mountain) sin lluvia ni multitudes.

### Mayo — El mejor mes del año
Temperatura agradable de día (20°C), noches frías pero soportables (3-5°C). Cero lluvia, cielos azul intenso, visibilidad ilimitada. Andes secos con tonos dorados/marrones. Punto óptimo entre buen clima y baja afluencia. **Recomendado**: Camino Inca, Salkantay 5D, Choquequirao.

### Junio — Pico de calidad climática (y heladas)
Cielos sin una nube, temperatura cómoda al sol, pero **las noches bajan a 0°C o menos** (especialmente en campamentos del Camino Inca a 3,600 m). Inicio de temporada alta turística. Reserva con 2-3 meses de anticipación. **24 de junio: Inti Raymi**, la fiesta inca del sol — espectacular pero hoteles 3x más caros y todo lleno.

### Julio — Mucha gente, mucho sol
Mes más turístico del año. Vacaciones de verano EE.UU./Europa + Fiestas Patrias del Perú (28-29 julio). Hoteles llenos, vuelos caros, [Machu Picchu](/destinos/machu-picchu) con cupo limitado agotado meses antes. Si vas en julio, **reserva en marzo o abril**.

### Agosto — Sol intenso, viento, polvo
Climáticamente parecido a julio pero con vientos fuertes en zonas altas (Rainbow Mountain, Salkantay). Las heladas matinales en el Camino Inca llegan a -5°C. **Tip**: si haces Inca Trail en agosto, lleva saco de dormir de -10°C.

### Septiembre — Nuevo sweet spot
La gran multitud se va pero el clima sigue perfecto. Días templados (21°C), noches menos frías que junio (3-5°C). Empieza a haber alguna nube ocasional. **Recomendado** si quieres clima ideal sin pelear por una entrada.

### Octubre — Última ventana antes de lluvias
Aparecen lluvias intermitentes pero pocas. Vegetación empieza a reverdecer. Precios bajan, hoteles disponibles. **Pro tip**: combina Cusco + Amazonía en este mes (Madre de Dios tiene clima ideal en octubre).

### Noviembre — Primeras lluvias serias
Lluvias regulares por la tarde, mañanas todavía despejadas. Paisaje verde rápido. Festividades religiosas en pueblos del Valle Sagrado.

### Diciembre — Lluvia + magia decembrina
Lluvias frecuentes (~130 mm/mes). 24 de diciembre se celebra **Santuranticuy** (mercado navideño tradicional) en la Plaza de Armas — uno de los eventos culturales más auténticos del año. Si no te molesta el clima cambiante, es un mes con mucho carácter.

## ¿Qué llevar según el mes?

**Mayo a septiembre (seco)**: ropa por capas (térmica + polar + cortavientos), guantes y gorro para las noches, lentes de sol UV400, protector solar SPF 50+, labial con SPF, hidratante.

**Octubre a abril (lluvias)**: todo lo anterior + casaca impermeable de calidad (no poncho ligero), pantalón impermeable para trekking, zapatos con grip, repelente de mosquitos (selva alta), bolsas plásticas para proteger electrónicos.

## Festividades clave para considerar

- **24 junio — Inti Raymi**: el evento turístico más grande del año en Cusco. Espectacular pero costoso.
- **28-29 julio — Fiestas Patrias**: feriado nacional en Perú, todo lleno.
- **Semana Santa (abril variable)**: procesiones de Cristo Morado en Cusco, tradicional.
- **24 diciembre — Santuranticuy**: mercado navideño en Plaza de Armas.
- **6 enero — Bajada de Reyes**: Cusco celebra con misa y bandas.

## La decisión final

**Si tu prioridad es CLIMA PERFECTO**: junio o septiembre.
**Si tu prioridad es POCA GENTE**: abril, mayo, octubre.
**Si tu prioridad es PRESUPUESTO**: marzo, octubre, noviembre.
**Si tu prioridad es CULTURA**: junio (Inti Raymi) o diciembre (Santuranticuy).
**Si quieres EVITAR LO PEOR**: no vayas en febrero.

¿Listo para reservar? Mira nuestros [tours a Machu Picchu](/destinos/machu-picchu), [Camino Inca](/destinos/camino-inca) o [Valle Sagrado](/destinos/valle-sagrado), o explora [todos los tours](/tours) disponibles.
$body$),
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  9,
  '["clima", "cusco", "machu-picchu", "guia-viaje", "mejor-epoca"]'::jsonb,
  true,
  now() - interval '5 days',
  jsonb_build_object('es', 'Clima en Cusco mes a mes 2026: cuándo viajar a Machu Picchu'),
  jsonb_build_object('es', 'Guía completa del clima en Cusco mes a mes. Temperaturas, lluvias, festividades y la mejor época para Machu Picchu, Camino Inca y Rainbow Mountain.')
) on conflict (slug) do nothing;

-- ===== 2. CAMINO INCA PASO A PASO =====================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'camino-inca-paso-a-paso-4-dias',
  jsonb_build_object('es', 'Camino Inca paso a paso: guía completa del trek de 4 días a Machu Picchu'),
  jsonb_build_object('es', 'Todo lo que necesitas saber para hacer el Camino Inca clásico de 4 días: itinerario día a día, permisos SERNANP, entrenamiento, qué llevar y cómo elegir operador.'),
  jsonb_build_object('es', $body$
# Camino Inca paso a paso: guía completa del trek de 4 días a Machu Picchu

El **Camino Inca clásico** es la caminata más famosa de Sudamérica: 43 kilómetros por el sendero original del Imperio Inca, cruzando tres pasos de montaña, ocho sitios arqueológicos y llegando al **Intipunku** (Puerta del Sol) al amanecer del cuarto día, con la ciudadela de Machu Picchu apareciendo entre la niebla. No es un trek cualquiera — es una peregrinación física y espiritual que solo 500 personas por día (incluyendo porteadores) pueden hacer, gracias a la regulación del SERNANP.

Esta guía es para quien está planificando su Camino Inca o está dudando si hacerlo. Te explico día a día, qué debes llevar, cómo entrenar y qué decisiones tomar antes de reservar.

## ¿Qué es el Camino Inca exactamente?

El Camino Inca clásico (Inka Ñan en quechua) es el tramo de 43 km de la red vial inca **Qhapaq Ñan** que conecta el kilómetro 82 de la línea férrea Cusco–Aguas Calientes con la ciudadela de Machu Picchu. Forma parte del Patrimonio Cultural de la Humanidad por la UNESCO desde 2014. La ruta cruza ecosistemas únicos — puna alto-andina, bosque nubloso, selva alta — y conecta 8 sitios arqueológicos: Llaqtapata, Runkuracay, Sayacmarca, Phuyupatamarca, Wiñay Wayna y el propio Intipunku, además de campamentos como Wayllabamba y Pacaymayo.

## Itinerario día a día

### Día 1 — KM 82 a Wayllabamba (12 km, 6 horas, fácil)
**Recojo en Cusco a las 4:30 am** en bus privado. 2h de viaje hasta el km 82 (Piscacucho, 2,720 msnm), donde está el control oficial del SERNANP. Aquí presentas pasaporte original y permiso. La caminata empieza cruzando el puente colgante sobre el río Vilcanota. Sendero amplio y con desnivel suave durante 4 horas — buen calentamiento. Visita al sitio arqueológico de **Llaqtapata** (vista panorámica del valle del Vilcanota). Almuerzo en el camino. Llegada a **Wayllabamba (3,000 msnm)** alrededor de las 4 pm. Acampe, cena caliente y descanso para el día más exigente.

### Día 2 — Wayllabamba a Pacaymayo (12 km, 7 horas, exigente)
**El día más duro del trek.** Despertar 5:30 am, desayuno fuerte (avena, pan, huevos, mate de coca). Ascenso de 1,200 metros de desnivel hasta el **Paso de la Mujer Muerta (Warmiwañusca, 4,215 msnm)** — el punto más alto del trek. La subida es por escaleras incas regulares pero la altitud te golpea. Plan: caminar muy lento, paradas cada 10 min, hidratarse constantemente. Una vez en el paso, vista 360° de los Andes peruanos. Descenso de 700 m a **Pacaymayo (3,600 msnm)** por sendero empedrado original. Llegada a media tarde, café caliente, cena, dormir temprano.

### Día 3 — Pacaymayo a Wiñay Wayna (16 km, 8 horas, moderado)
Día más largo en distancia pero técnicamente más amable. Subida al segundo paso (3,950 msnm) con visita a **Runkuracay** (puesto de vigilancia inca circular). Descenso y subida al tercer paso (3,650 msnm) con **Sayacmarca** (ciudad inca colgada en la roca). Por la tarde, descenso por bosque nubloso a **Phuyupatamarca** ("ciudad sobre las nubes", 3,650 msnm) — uno de los sitios más impresionantes del trek. Bajada final de 1,000 m por escaleras incas hasta **Wiñay Wayna (2,700 msnm)**. Cena de celebración y propinas a porteadores.

### Día 4 — Wiñay Wayna a Machu Picchu (6 km, 3 horas, fácil)
**Despertar a las 3:30 am.** Desayuno rápido. Caminata en oscuridad a la luz de linterna frontal por sendero plano. Llegada al control del Intipunku al amanecer (~5:45 am). Si el cielo está despejado, el sol entra justo entre los picos del Salkantay y Veronica, iluminando Machu Picchu desde atrás. **Esto es lo que esperaste 4 días.** Descenso al complejo de Machu Picchu por el sendero superior, tour guiado de 2 horas dentro del santuario, bus a Aguas Calientes, almuerzo y tren de retorno a Cusco. Llegada a Cusco entre 9 y 11 pm.

## Permisos SERNANP: el dato más importante

El Estado peruano regula estrictamente el Camino Inca:

- **500 permisos por día**: 200 para turistas + 300 para porteadores, guías y cocineros.
- **Cupos se abren en octubre** del año anterior y se agotan rápido para junio-agosto.
- **Permiso es personal e intransferible**: nombre y número de pasaporte vinculados.
- **No reembolsable** una vez emitido.
- **Febrero CERRADO** por mantenimiento de senderos.
- Solo **operadores autorizados** pueden tramitar permisos — los individuos no pueden comprarlos directamente.

**Recomendación de Danfer Tours**: reservar con **4-6 meses** de anticipación para junio-agosto, **2-3 meses** para mayo y septiembre, **1-2 meses** para abril, octubre y noviembre.

## Cómo entrenar antes del Camino Inca

No necesitas ser atleta, pero no llegues con cero preparación. Plan recomendado de **8 semanas**:

- **Semanas 1-2**: 3 caminatas/semana de 1 hora con mochila ligera (5 kg). Subir escaleras 15 min/día.
- **Semanas 3-4**: 2 caminatas largas/semana (2-3 horas) + 1 sesión de fuerza para piernas.
- **Semanas 5-6**: 1 caminata de 4-5 horas/semana con mochila de 8 kg en terreno variado.
- **Semanas 7-8**: descarga, caminatas más cortas para llegar fresco.

**Imprescindible**: 2 días mínimo de aclimatación en Cusco (3,400 m) antes del trek. Ideal 3-4 días.

## Qué llevar — lista oficial

Lo que da Danfer Tours (incluido en el precio):
- Permiso SERNANP, entrada a Machu Picchu
- Transporte (bus al km 82 + tren de retorno)
- Todas las comidas (16 en total) + agua hervida
- Carpas dobles, colchonetas inflables
- Porteadores oficiales con seguro (cargan equipo común)
- Cocinero, guía bilingüe certificado
- Tanque de oxígeno de emergencia, botiquín
- Baños químicos portátiles en campamentos

Lo que llevas tú:
- **Mochila de día** (30-40L)
- **Saco de dormir** -10°C (alquilable con nosotros US$20)
- **Bastones de trekking** (alquilables US$15)
- **Botas o zapatos de trekking** ya probados
- **Ropa por capas**: térmica, polar, cortavientos impermeable
- **Pantalón de trekking** + 2 pares de medias de lana
- Linterna frontal, lentes de sol UV400, gorro térmico, guantes
- Protector solar SPF 50+, labial SPF
- 2L de agua (rellenas en cada campamento)
- Snacks personales (chocolate, frutos secos, barras)
- Pasaporte original (te lo piden en cada control)
- Efectivo en soles para propinas (~US$60-80 sugerido)

## Cómo elegir operador del Camino Inca

Tres criterios no negociables:

1. **Licencia oficial SERNANP**: cualquier operador legítimo te muestra su número de operador. Sin esto, no pueden emitir permisos.
2. **Trato a porteadores**: lo más importante éticamente. Pregunta cuánto cargan (máximo 25 kg por la ley desde 2002), si tienen seguro de salud, si comen lo mismo que los turistas. En Danfer Tours nuestros porteadores ganan por encima del salario mínimo del SERNANP, tienen seguro de salud completo y comen exactamente la misma cena que los grupos.
3. **Tamaño de grupo y equipo**: máximo 16 personas por grupo, idealmente 8-12. Carpas dobles (no triples), colchonetas inflables (no esponjas finas), comida balanceada de cocinero capacitado.

**Bandera roja**: si te ofrecen Camino Inca por menos de US$650, algo se está cortando — probablemente porteadores mal pagados o falta de permiso oficial.

## Alternativas si no consigues permiso

- **Salkantay 5D/4N** (US$550-700): la mejor alternativa, no requiere permiso SERNANP, paisajes incluso más variados.
- **Lares 4D/3N** (US$500-650): más cultural (comunidades quechuas, baños termales).
- **Choquequirao 5D/4N** (US$700-900): la "hermana sagrada" de Machu Picchu, casi sin turistas.
- **Inca Trail corto 2D/1N** (US$450-550): los últimos 14 km del clásico, llegas al Intipunku el día 2.

## La decisión final

Si tienes la condición física, presupuesto y consigues permiso, el Camino Inca es **una experiencia que cambia perspectivas de vida**. No es para todos, pero quienes lo completan describen el momento del Intipunku al amanecer como uno de los más impresionantes de su vida.

¿Listo para reservar? Mira nuestras opciones de [Camino Inca con Danfer Tours](/destinos/camino-inca) o explora [todos los tours](/tours) disponibles. Cualquier duda, escríbenos a hola@danfertourscusco.com.
$body$),
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  12,
  '["camino-inca", "trekking", "machu-picchu", "guia-completa", "preparacion"]'::jsonb,
  true,
  now() - interval '4 days',
  jsonb_build_object('es', 'Camino Inca 4 días paso a paso 2026: guía completa para reservar'),
  jsonb_build_object('es', 'Itinerario día a día del Camino Inca clásico de 4 días a Machu Picchu. Permisos SERNANP, entrenamiento, qué llevar, cómo elegir operador y alternativas.')
) on conflict (slug) do nothing;

-- ===== 3. ITINERARIO 7 DIAS EN CUSCO =====================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'itinerario-7-dias-cusco',
  jsonb_build_object('es', 'Qué hacer en Cusco en 7 días: itinerario perfecto día por día'),
  jsonb_build_object('es', 'Itinerario detallado de 7 días en Cusco: Machu Picchu, Valle Sagrado, Rainbow Mountain, Humantay, city tour y selva. Con tiempos, costos y consejos de aclimatación.'),
  jsonb_build_object('es', $body$
# Qué hacer en Cusco en 7 días: itinerario perfecto día por día

Una semana en Cusco es el **tiempo ideal** para combinar la ciudad colonial, [Machu Picchu](/destinos/machu-picchu), el [Valle Sagrado](/destinos/valle-sagrado) y dos excursiones de alta montaña sin sentirte apurado ni mal por la altitud. Después de 12 años operando aquí en Danfer Tours, este es el itinerario que más nos piden y mejor funciona.

## La regla de oro: ACLIMATARSE PRIMERO

Cusco está a **3,400 msnm**. Llegar de Lima (nivel del mar) directo a un trek a 5,000 m es la receta perfecta para el [mal de altura](/blog/soroche-cusco-mal-de-altura). El itinerario está diseñado para subir gradualmente.

## Día 1 — Llegada y aclimatación pasiva

**Mañana**: Vuelo a Cusco (mejor antes de las 12 pm, después suele haber turbulencia por vientos andinos). Llegada al aeropuerto Velasco Astete, traslado al hotel (15-20 min).

**Tarde**: NO HAGAS NADA EXIGENTE. Descansa 2-3 horas en el hotel. Hidrátate (3L de agua), toma mate de coca, comida ligera (sopa, arroz, pollo — evita carnes pesadas y alcohol). Caminata corta y muy lenta por la **Plaza de Armas**: Catedral, Iglesia de la Compañía, balcones coloniales. No subas escaleras innecesarias.

**Noche**: Cena temprano y a la cama. Dormirás mal la primera noche — es normal, el cuerpo está procesando la altitud.

**Costo aprox día 1**: hotel US$50-150 + comidas US$30.

## Día 2 — Valle Sagrado clásico

El valle está más bajo que Cusco (2,800 vs 3,400 m), así que es la actividad ideal para el día 2.

**Tour Full Day Valle Sagrado**: salida 8 am, retorno 7 pm. Cubre Pisac (mercado + ruinas), almuerzo buffet en Urubamba, Ollantaytambo (fortaleza). Costo US$95-140. [Ver tours Valle Sagrado](/destinos/valle-sagrado).

**Tip clave**: si vas a Machu Picchu al día siguiente, considera dormir en **Ollantaytambo** (2,792 m) en vez de regresar a Cusco. Tren a Aguas Calientes sale temprano, te ahorras 2 horas de bus y duermes más bajo (mejor para altitud).

## Día 3 — Machu Picchu

**Opción A — Full Day desde Ollantaytambo o Cusco**: Tren panorámico a Aguas Calientes (1.5h), bus de subida a Machu Picchu, tour guiado 2 horas, tiempo libre, retorno. Costo US$380-450. [Ver tours Machu Picchu](/destinos/machu-picchu).

**Opción B — 2D/1N**: noche en Aguas Calientes, entras al amanecer del día siguiente. Más relajado, sube Huayna Picchu. Costo US$550-700.

Si tienes condición física y permiso del SERNANP, considera reemplazar este día por el [Camino Inca 4D/3N](/destinos/camino-inca).

**Tip**: lleva pasaporte original SIEMPRE en Machu Picchu — te lo piden a la entrada y para sellar el "Machu Picchu passport stamp" gratuito.

## Día 4 — Descanso activo + City Tour Cusco

Después de Machu Picchu necesitas descansar. **City Tour Cusco** medio día (4 horas): Catedral, Qoricancha (Templo del Sol), Sacsayhuamán, Q'enqo, Tambomachay. Costo US$30-45.

Por la tarde: **San Pedro Market** para frutas exóticas, jugos naturales (papaya, lúcuma, chirimoya). **San Blas** (barrio bohemio): galerías de arte, cafés. Cena con vista en **Limbus Resto Bar** o **Pachapapa** (cocina andina).

## Día 5 — Laguna Humantay (calentamiento de altitud)

[Humantay](/destinos/laguna-humantay) está a 4,200 msnm — más alto que Cusco pero más bajo que Rainbow Mountain. Sirve como calentamiento perfecto.

**Tour Full Day**: salida 4 am, retorno 7 pm. Trekking 1.5h subida + 1h bajada. Caballo opcional US$30. Costo US$80.

Si te sientes mal en altitud durante este día, NO vayas a Rainbow Mountain mañana. Reemplaza por algo más bajo.

## Día 6 — Rainbow Mountain (Vinicunca)

El día más exigente. [Vinicunca](/destinos/rainbow-mountain) está a **5,200 msnm**.

**Tour Full Day**: salida 4 am, retorno 7 pm. Trekking 2h subida + 1.5h bajada. Caballo opcional. Costo US$85.

**Alternativa**: si dudas de la altitud, reemplaza por **Palccoyo** (4,900 m, menos turistas, caminata mucho más fácil) — mismo costo aprox.

Por la tarde: descanso, masaje andino (US$30-50 en hoteles), cena ligera, dormir temprano.

## Día 7 — Cierre suave y vuelo de salida

Mañana libre para compras de última hora en San Pedro o el Centro Artesanal (Avenida El Sol). Brunch en **Green Point** (vegano) o **Cicciolina** (italiano fino). Traslado al aeropuerto.

Si tu vuelo es por la tarde, opción de visitar **Pisac mercado** en la mañana (los domingos y jueves es el día grande). Si tienes 1 día extra, considera **Maras + Moray** (Tour Mañana).

## Variantes del itinerario

**Si tienes 5 días**: salta Humantay o Rainbow Mountain, mantén el resto.

**Si tienes 10 días**: agrega **Camino Inca 4D/3N** entre día 2 y día 6, y un día en **Tambopata** (selva).

**Si llegas en grupo familiar con niños**: cambia Rainbow Mountain por **Maras + Moray Full Day**, y Humantay por **Tipón + Pikillaqta**.

**Si eres aventurero**: cambia el Valle Sagrado clásico por el **Tour VIP** (incluye Maras, Moray, Chinchero) y Rainbow Mountain por el **Trek Salkantay 5D/4N**.

## Presupuesto estimado 7 días (por persona, USD)

| Concepto | Backpacker | Estándar | Premium |
|----------|-----------|----------|---------|
| Hotel (6 noches) | $180 | $480 | $1,400 |
| Tour Machu Picchu | $380 | $450 | $700 |
| Tour Camino Inca/Valle | $95 | $140 | $195 |
| Tour Rainbow Mountain | $85 | $85 | $130 |
| Tour Humantay | $80 | $80 | $130 |
| City Tour Cusco | $30 | $45 | $60 |
| Comidas (7 días) | $140 | $280 | $500 |
| Transporte local | $50 | $80 | $200 |
| **Total** | **$1,040** | **$1,640** | **$3,315** |

No incluye vuelo internacional ni vuelo Lima-Cusco.

## Lo que debes reservar con anticipación

- **Hotel**: 1-2 meses (mayo-agosto), 2-3 semanas (otros meses).
- **Tren a Machu Picchu**: 2 meses mínimo en temporada alta.
- **Entrada a Machu Picchu**: 1-2 meses (cupos limitados).
- **Camino Inca**: 4-6 meses (cupos SERNANP).
- **Tours generales**: 1-2 semanas suelen ser suficiente.

## Resumen ejecutivo

| Día | Actividad | Altitud | Dificultad |
|-----|-----------|---------|------------|
| 1 | Llegada + aclimatación | 3,400 m | Cero |
| 2 | Valle Sagrado | 2,800 m | Baja |
| 3 | Machu Picchu | 2,430 m | Media |
| 4 | City Tour Cusco | 3,400 m | Baja |
| 5 | Humantay | 4,200 m | Media-alta |
| 6 | Rainbow Mountain | 5,200 m | Alta |
| 7 | Compras + vuelo | 3,400 m | Cero |

¿Quieres que armemos este itinerario para ti? Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o mira nuestros [paquetes completos](/tours).
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  10,
  '["itinerario", "cusco", "7-dias", "machu-picchu", "viaje-completo"]'::jsonb,
  true,
  now() - interval '3 days',
  jsonb_build_object('es', 'Qué hacer en Cusco 7 días 2026: itinerario perfecto + presupuesto'),
  jsonb_build_object('es', 'Itinerario detallado de 7 días en Cusco día por día: Machu Picchu, Valle Sagrado, Rainbow Mountain, Humantay y city tour. Con presupuestos y tips.')
) on conflict (slug) do nothing;

-- ===== 4. SOROCHE / MAL DE ALTURA =====================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'soroche-cusco-mal-de-altura',
  jsonb_build_object('es', 'Soroche en Cusco: cómo evitar el mal de altura (guía médica)'),
  jsonb_build_object('es', 'Guía completa del soroche o mal de altura en Cusco. Síntomas, prevención, qué hacer si te ataca, cuándo es grave y consejos de aclimatación validados por médicos andinos.'),
  jsonb_build_object('es', $body$
# Soroche en Cusco: cómo evitar el mal de altura (guía médica)

El **soroche** (en quechua: "borrachera de altura") es el mal agudo de montaña que afecta a 1 de cada 4 visitantes que llegan a Cusco (3,400 msnm) desde el nivel del mar. En la mayoría de casos es leve y se pasa en 24-48 horas. Pero **ignorado o tratado mal, puede escalar** a edema pulmonar o cerebral — condiciones potencialmente mortales. Esta guía te dice exactamente qué hacer.

## ¿Qué es el soroche y por qué te ataca?

A 3,400 m hay **~65% del oxígeno** que respirarías a nivel del mar. A 5,200 m (Rainbow Mountain), solo **~50%**. Tu cuerpo responde aumentando frecuencia respiratoria y cardíaca, y produciendo más glóbulos rojos — pero ese proceso toma días. En las primeras 24-48 horas, el desequilibrio causa los síntomas del soroche.

## Síntomas leves (el 90% de los casos)

- Dolor de cabeza moderado (frontal o nuca)
- Cansancio mayor del normal al subir escaleras
- Falta de apetito
- Nausea ligera
- Dificultad para dormir profundamente
- Mareo al levantarse rápido

**Estos son normales** las primeras 24-48 horas. Si descansas, te hidratas y no fuerzas, pasan solos.

## Síntomas graves (busca ayuda médica YA)

- Dolor de cabeza intenso que no responde a analgésicos
- Vómitos repetidos
- Falta de coordinación al caminar (como ebrio)
- Confusión mental, somnolencia extrema
- Sensación de "burbujeo" en el pecho al respirar
- Tos seca persistente con espuma o flema rosada
- Labios o uñas azulados

**Si tienes uno de estos, bajar de altitud es la única solución segura.** Llama al hotel para que te lleven a la clínica, o pide oxígeno de inmediato.

## Prevención: las 10 reglas que sí funcionan

### 1. Llega progresivamente
Si vienes desde Lima (nivel del mar) o un vuelo intercontinental, **no programes actividades exigentes el primer día**. Tu cuerpo necesita 24-48 horas de adaptación pasiva.

### 2. Hidrátate como atleta
**3-4 litros de agua al día** desde el primer día. El aire andino es seco y deshidrata más rápido de lo que sientes. Evita refrescos azucarados (te deshidratan).

### 3. Cero alcohol las primeras 48 horas
El alcohol amplifica los síntomas del soroche al doble. Y la cerveza Cusqueña sigue ahí en el día 3.

### 4. Come ligero y carbohidratos
Sopas, arroz, papa, pollo, pasta. Evita carnes rojas pesadas, frituras y postres muy dulces los primeros días. La digestión consume oxígeno y tu cuerpo lo necesita para adaptarse.

### 5. Mate de coca y hoja de coca
Es la medicina tradicional andina y **sí funciona**. La coca tiene alcaloides que oxigenan ligeramente y reducen la fatiga. Mastica una pelotita (3-5 hojas) durante el día o toma 3-4 mates al día. Disponible gratis en cualquier hotel de Cusco. *Nota: la cocaína se sintetiza de la coca pero la hoja en sí no es droga ni causa adicción. Es legal en Perú.*

### 6. Caramelo de coca para emergencias rápidas
Ideal para excursiones — Rainbow Mountain, Humantay, Camino Inca. Llevarte 1 caja.

### 7. Diamox (acetazolamida) si tu médico lo aprueba
**Solo bajo prescripción médica.** Es el medicamento más usado para prevenir soroche. Dosis típica: 125-250 mg cada 12 horas, empezando 1 día antes de subir. Efectos secundarios: hormigueo en manos/pies, ganas de orinar más, gusto extraño en bebidas gaseosas. **No tomar si**: alergia a sulfas, embarazo, insuficiencia renal.

### 8. Dormir más bajo si puedes
Si tu itinerario lo permite, dormir en el **Valle Sagrado (2,800 m)** las primeras 2 noches es mucho mejor que en Cusco (3,400 m). Tu cuerpo se aclimata mejor durmiendo más bajo.

### 9. No fumes
El tabaco reduce aún más la oxigenación. Si fumas habitualmente, baja al mínimo en Cusco.

### 10. Duerme con la cabeza elevada
Si te despiertas con ahogo nocturno, eleva la cabecera 20-30 cm con almohadas extra. Reduce la sensación de falta de aire.

## Qué llevar en la maleta

- **Ibuprofeno o paracetamol** (no aspirina si tomas Diamox)
- **Diamox** si tu médico lo recetó
- **Hojas de coca o caramelos de coca** (los compras al llegar al aeropuerto de Cusco, US$2-5)
- **Pastillas para nausea** (Dramamine, Vontrol)
- **Termómetro pequeño**
- **Pulsioxímetro digital** (US$20 en Amazon) — mide saturación de oxígeno. Lo normal en Cusco es 88-92%. Por debajo de 85% en reposo, busca médico.

## El "Día 1" exacto: qué hacer hora por hora

**8 am — Llegada al aeropuerto de Cusco**: respira tranquilo, camina lento al taxi. No cargues maletas pesadas.

**9 am — Llegada al hotel**: pide un mate de coca, descansa 1 hora acostado. NO duermas — solo descansa.

**11 am — Desayuno ligero**: sopa de quinua, pan integral, fruta. Evita café cargado (puede agravar dolor de cabeza).

**12 pm a 3 pm**: caminata MUY lenta por la Plaza de Armas. NO subas a Sacsayhuamán todavía. Si te cansas, regresa al hotel.

**3 pm**: descanso en hotel. Hidratación constante. Lee, ve TV, no hagas esfuerzo.

**6 pm — Cena**: arroz, pollo a la plancha, sopa caliente. Evita lácteos pesados.

**8 pm — A la cama**: temprano. La primera noche dormirás mal — es normal. Si necesitas, toma un té de manzanilla con miel.

**Día siguiente**: ya puedes hacer **Valle Sagrado** o **City Tour Cusco**. NO programes Rainbow Mountain ni Camino Inca todavía.

## Cuándo NO debes viajar a altura

Consulta a tu médico antes si tienes:
- Enfermedad cardiovascular (infarto previo, arritmia, hipertensión severa no controlada)
- Anemia grave
- Insuficiencia respiratoria crónica (EPOC, fibrosis)
- Embarazo de alto riesgo o último trimestre
- Cirugía mayor reciente (< 6 meses)

Para personas con asma estable o hipertensión controlada, generalmente está OK con medicación de mantenimiento + Diamox preventivo.

## Si te ataca el soroche en pleno trek (Camino Inca, Salkantay)

Síntomas leves: **bajar 200-500 metros de altitud** si es posible. Hidratar, descansar 2-4 horas. Oxígeno portátil si está disponible.

Síntomas graves: **evacuación inmediata a altitud menor**. Los operadores serios (incluyendo Danfer Tours) llevan tanque de oxígeno, radio satelital, plan de evacuación con caballo + traslado a Aguas Calientes o Cusco.

## Mitos comunes

- **"Tomar alcohol antes ayuda"**: FALSO. Empeora todo.
- **"Ducharse con agua fría aclimata más rápido"**: FALSO. Solo añade estrés al cuerpo.
- **"Si eres joven y deportista no te ataca"**: FALSO. La altitud no discrimina por edad ni fitness.
- **"Comer mucha papa o quinua ayuda"**: parcialmente cierto — los carbohidratos andinos son fáciles de digerir, pero comer en exceso es contraproducente.

## La regla de oro

**Escucha a tu cuerpo.** Si estás peor que ayer, baja altitud. Si estás mejor, sigue con cuidado. **No hay foto de Rainbow Mountain que valga un edema pulmonar.**

¿Vas a viajar a Cusco? Lee también nuestras guías:
- [Itinerario perfecto 7 días en Cusco](/blog/itinerario-7-dias-cusco)
- [Clima en Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes)
- [Camino Inca paso a paso](/blog/camino-inca-paso-a-paso-4-dias)

O reserva tu tour con [Danfer Tours](/tours) — operamos con tanque de oxígeno en todas las excursiones de altura y nuestros guías están capacitados en primeros auxilios de montaña.
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  11,
  '["soroche", "mal-de-altura", "salud", "cusco", "prevencion"]'::jsonb,
  true,
  now() - interval '2 days',
  jsonb_build_object('es', 'Soroche en Cusco: cómo evitar el mal de altura (guía médica 2026)'),
  jsonb_build_object('es', 'Guía completa para prevenir el soroche en Cusco. Síntomas, prevención, Diamox, hoja de coca y qué hacer ante una emergencia de altitud.')
) on conflict (slug) do nothing;

-- ===== 5. MEJOR EPOCA PARA MACHU PICCHU =====================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'mejor-epoca-machu-picchu',
  jsonb_build_object('es', 'Mejor época para visitar Machu Picchu: análisis mes a mes (2026)'),
  jsonb_build_object('es', 'Análisis detallado de la mejor época para ir a Machu Picchu. Clima, cupos, precios y multitudes mes a mes, con recomendaciones específicas según tu perfil de viajero.'),
  jsonb_build_object('es', $body$
# Mejor época para visitar Machu Picchu: análisis mes a mes (2026)

"¿Cuál es la mejor época para ir a Machu Picchu?" es la pregunta que más nos hacen en Danfer Tours. La respuesta no es única — depende de qué priorizas: **clima**, **multitudes**, **precio**, **cupos de entrada** o **experiencia fotográfica**. Aquí está el análisis honesto mes a mes.

## La respuesta corta

- **Mejor clima**: junio, julio, agosto (temporada seca alta)
- **Mejor relación calidad/multitud**: mayo y septiembre
- **Mejor precio**: marzo y noviembre
- **Mejor fotografía**: abril y octubre (paisaje verde + cielo despejado)
- **Evitar a toda costa**: febrero (Camino Inca cerrado, lluvias máximas)

## Las dos temporadas de Machu Picchu

### Temporada seca (mayo a septiembre)
- Días soleados, cielos azul intenso
- Temperatura: 18-22°C de día, 0-8°C de noche
- Lluvia casi cero
- Vistas panorámicas máximas
- **Pero**: más turistas, precios más altos, cupos limitados

### Temporada de lluvias (octubre a abril)
- Lluvias por la tarde generalmente
- Paisaje verde intenso, vegetación explotando
- Temperatura: 16-21°C de día, 6-9°C de noche
- Niebla puede tapar las vistas
- **Pero**: menos gente, precios bajos, experiencia más íntima

## Análisis mes a mes para Machu Picchu

### Enero — Vegetación máxima, riesgo de cierre
- **Clima**: lluvias frecuentes pero no constantes (130 mm/mes)
- **Multitudes**: bajas excepto primera semana (Año Nuevo)
- **Cupos**: amplia disponibilidad
- **Recomendado para**: fotografía paisajística, viajeros con presupuesto
- **Riesgo**: cancelación de tren por crecida del río Vilcanota (rara pero posible)

### Febrero — NO VAYAS
- **Camino Inca CERRADO** todo el mes
- **Lluvias máximas** del año (~140 mm/mes)
- **Tren puede suspender** servicio por días enteros
- **Único positivo**: hoteles y entradas baratos, casi nadie

Si tu única opción es febrero, contrata operador que incluya seguro de cancelación y plan B (Salkantay o tren al amanecer).

### Marzo — Sweet spot escondido
- **Lluvias bajan** notablemente la segunda quincena
- **Paisaje verde** en su máximo esplendor
- **Multitudes**: aún bajas
- **Precios**: 30-40% más bajos que junio-agosto
- **Recomendado**: si te gusta fotografía y verde

### Abril — El mes secreto que todos olvidan
- **Excelente clima** con vegetación todavía verde antes de secarse
- **Multitudes moderadas** excepto Semana Santa
- **Cupos disponibles** sin tanta presión
- **Recomendación personal de Danfer Tours**: si tienes flexibilidad, ven en abril

### Mayo — El mejor mes objetivamente
- **Cero lluvias**, cielos azul intenso
- **Temperatura cómoda** (20°C día, 5°C noche)
- **Vegetación** aún algo verde
- **Multitudes**: subiendo pero todavía manejables
- **Precios**: empiezan a subir hacia mediados de mes
- **Recomendado para**: quienes pueden viajar entre semana

### Junio — Pico de calidad climática
- **Cielos perfectos** todos los días
- **Visibilidad ilimitada**
- **Noches MUY frías** (0°C o menos en Aguas Calientes ocasionalmente)
- **24 de junio: Inti Raymi en Cusco** — hoteles 3x más caros, tren agotado
- **Reserva con 3-4 meses** de anticipación

### Julio — Mes más turístico del año
- **Vacaciones de verano EE.UU./Europa** + Fiestas Patrias Perú
- **Machu Picchu lleno** todos los días
- **Cupos del santuario** agotan con 2-3 meses
- **Precios pico**: tren PeruRail Vistadome desde US$170 ida (vs US$80 en abril)
- **Recomendado solo si**: no tienes flexibilidad de fechas

### Agosto — Como julio pero con viento
- **Mismo perfil que julio** pero con vientos andinos fuertes
- **Polvo en senderos** (sequedad máxima)
- **Heladas matinales** en Camino Inca pueden llegar a -5°C
- **Cupos**: igual de difíciles

### Septiembre — Sweet spot post-pico
- **La gran multitud se va** después de Labor Day (EE.UU.)
- **Clima sigue siendo perfecto**
- **Precios bajan 20-30%** desde la segunda quincena
- **Recomendado**: para quienes quieren clima ideal sin multitudes

### Octubre — Última ventana de cielos despejados
- **Lluvias intermitentes** empiezan pero no son intensas
- **Vegetación rebrotando** — paisaje muy fotogénico
- **Multitudes**: bajas
- **Precios**: muy buenos
- **Recomendado**: para fotógrafos

### Noviembre — Comienzo de lluvias
- **Lluvias regulares por la tarde** (45-60 mm en el mes)
- **Mañanas todavía despejadas**
- **Multitudes**: muy bajas
- **Precios**: bajos
- **Pro tip**: Sal del hotel a las 5 am para llegar a Machu Picchu con cielo despejado

### Diciembre — Festividades + lluvias
- **Lluvias intensas** (~130 mm/mes)
- **Niebla frecuente** sobre la ciudadela
- **24 dic: Santuranticuy en Cusco** (mercado navideño tradicional)
- **Precios**: suben para Navidad y Año Nuevo (24 dic - 5 ene), bajan el resto
- **Recomendado para**: viajeros con espíritu festivo, no para fotografía panorámica

## Por tipo de viajero

### Fotógrafo / aficionado al paisaje
**Abril o octubre.** Verde + cielo despejado + multitudes bajas.

### Trekker / aventurero
**Mayo, junio, septiembre.** Camino Inca abierto, clima óptimo, sin barro extremo.

### Familia con niños o adultos mayores
**Abril, mayo, septiembre, octubre.** Clima estable, menos multitudes, transporte cómodo.

### Mochilero / presupuesto bajo
**Marzo o noviembre.** Mejor relación calidad-precio.

### Quien busca espiritualidad / soledad
**Enero o noviembre temprano.** Machu Picchu casi vacío al amanecer.

### Quien tiene fechas fijas (vacaciones de oficina)
Si solo puedes viajar en julio o agosto, **reserva con 6 meses** de anticipación y considera entrar al santuario en **el primer turno (6 am)** para ver MP relativamente vacío.

## Cupos y reglas de entrada 2026

Desde 2023 el Ministerio de Cultura del Perú regula estrictamente la entrada a Machu Picchu:

- **5,940 visitantes por día** repartidos en 3 turnos (mañana, mediodía, tarde)
- Cada entrada tiene **circuito específico** (1, 2, 3 o 4) que define qué partes ves
- **No puedes regresar** una vez que sales
- **Tiempo máximo** dentro del santuario: 3 horas
- **Pasaporte original** obligatorio (no fotocopia)
- **Guía obligatorio** para grupos de más de 8 personas

Por eso reservar con anticipación es crítico — los turnos de la mañana (6:00 y 7:00 am) son los más codiciados.

## Mi recomendación final como guía local

Si vienes desde fuera de Perú y tienes flexibilidad de fechas, **mayo o septiembre** son las mejores apuestas: clima de temporada seca pero sin la masa de turistas de junio-agosto. **Abril** y **octubre** son alternativas más económicas con clima muy decente.

Si tu objetivo es **Camino Inca**: mayo, junio o septiembre.
Si tu objetivo es **fotografía**: abril o octubre.
Si tu objetivo es **paz y vacío**: marzo o noviembre temprano.

¿Listo para reservar? Mira [todos nuestros tours a Machu Picchu](/destinos/machu-picchu) o revisa también nuestro [itinerario completo de 7 días](/blog/itinerario-7-dias-cusco).
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  11,
  '["machu-picchu", "mejor-epoca", "clima", "planeacion", "guia"]'::jsonb,
  true,
  now() - interval '1 day',
  jsonb_build_object('es', 'Mejor época para visitar Machu Picchu 2026: análisis mes a mes'),
  jsonb_build_object('es', 'Cuándo viajar a Machu Picchu según clima, multitudes, precios y cupos. Análisis mes a mes con recomendaciones por tipo de viajero.')
) on conflict (slug) do nothing;
