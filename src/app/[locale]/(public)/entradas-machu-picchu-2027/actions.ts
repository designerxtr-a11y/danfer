"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaypalOrder, capturePaypalOrder } from "@/lib/paypal";
import { isValid2027Date, dailySlots, mp2027Total, routeById, packageById, hoursFor, MAX_TRAVELERS, type PackageId } from "@/lib/mp2027/data";

const BUCKET = "client-documents";
const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
const DRAFT_RE = /^[a-z0-9]{10,24}$/;

const folder = (draftId: string) => `mp2027-${draftId}`;

type Fail = { ok: false; error: string };

export async function uploadMp2027Doc(
  draftId: string,
  travelerIndex: number,
  formData: FormData
): Promise<{ ok: true } | Fail> {
  if (!DRAFT_RE.test(draftId)) return { ok: false, error: "Invalid session" };
  if (!Number.isInteger(travelerIndex) || travelerIndex < 1 || travelerIndex > MAX_TRAVELERS) {
    return { ok: false, error: "Invalid traveler" };
  }
  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, error: "No file selected" };
  if (file.size > MAX_SIZE) return { ok: false, error: "File is too large (max 8MB)" };
  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Please upload a photo or PDF of your passport or ID" };
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder(draftId)}/traveler-${travelerIndex}-${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

const travelerSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  docType: z.enum(["passport", "dni"]),
  docNumber: z.string().trim().min(4).max(30),
  nationality: z.string().trim().min(2).max(60),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const inputSchema = z
  .object({
    draftId: z.string().regex(DRAFT_RE),
    pkg: z.enum(["fullday", "2d1n", "2d1n-valle"]),
    date: z.string().refine(isValid2027Date),
    route: z.string(),
    hour: z.string(),
    travelers: z.array(travelerSchema).min(1).max(MAX_TRAVELERS),
    email: z.string().trim().email().max(160),
    whatsapp: z.string().trim().min(6).max(30),
    hotel: z.string().trim().max(160).optional().default(""),
    acceptPolicy: z.literal(true),
    lang: z.enum(["es", "en", "ja"]),
  })
  .refine(
    (v) => {
      const r = routeById(v.route);
      return r ? hoursFor(r, packageById(v.pkg)).includes(v.hour) : false;
    },
    { message: "invalid route/hour" }
  );

export type Mp2027Input = z.input<typeof inputSchema>;

export async function createMp2027Order(
  raw: Mp2027Input
): Promise<{ ok: true; orderId: string; code: string } | Fail> {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid_input" };
  const input = parsed.data;
  const n = input.travelers.length;

  const supabase = createAdminClient();

  // Una foto de documento por pasajero, como mínimo.
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list(folder(input.draftId), { limit: 100 });
  if (listError) return { ok: false, error: listError.message };
  for (let i = 1; i <= n; i++) {
    if (!(files ?? []).some((f) => f.name.startsWith(`traveler-${i}-`))) {
      return { ok: false, error: `missing_doc:${i}` };
    }
  }

  // Cupos de pre-reserva por día (límite propio de Danfer, visible en el calendario).
  const { data: sameDay } = await supabase
    .from("bookings")
    .select("travelers")
    .eq("payment_status", "paid")
    .eq("travel_date", input.date);
  const taken = (sameDay ?? []).reduce((s, b) => s + (b.travelers ?? 1), 0);
  if (taken + n > dailySlots(input.date)) return { ok: false, error: "date_full" };

  const pkg = packageById(input.pkg)!;
  const { data: tour } = await supabase.from("tours").select("id").eq("slug", pkg.tourSlug).maybeSingle();
  const { subtotal, total } = mp2027Total(n, input.pkg as PackageId);

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      tour_id: tour?.id ?? null,
      travel_date: input.date,
      travelers: n,
      subtotal,
      total_amount: total,
      currency: "USD",
      customer_name: input.travelers[0].fullName,
      customer_email: input.email,
      customer_phone: input.whatsapp,
      customer_country: input.travelers[0].nationality,
      special_requests: JSON.stringify({
        kind: "mp2027",
        pkg: input.pkg,
        route: input.route,
        hour: input.hour,
        hotel: input.hotel,
        draftId: input.draftId,
        lang: input.lang,
        travelers: input.travelers,
      }),
      status: "pending",
      payment_status: "unpaid",
    })
    .select("id, booking_code")
    .single();
  if (error || !booking) return { ok: false, error: error?.message ?? "booking_failed" };

  try {
    const orderId = await createPaypalOrder(
      total,
      "USD",
      `Machu Picchu ${pkg.name.en} 2027 · ${input.date} · Ruta ${input.route} · ${booking.booking_code}`
    );
    await supabase.from("bookings").update({ internal_notes: `paypal_order:${orderId}` }).eq("id", booking.id);
    return { ok: true, orderId, code: booking.booking_code };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "PayPal error" };
  }
}

export async function captureMp2027Order(orderId: string): Promise<{ ok: true; code: string } | Fail> {
  if (!/^[A-Z0-9]{8,40}$/.test(orderId)) return { ok: false, error: "Invalid order" };
  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, booking_code, total_amount, payment_status, internal_notes")
    .eq("internal_notes", `paypal_order:${orderId}`)
    .maybeSingle();
  if (!booking) return { ok: false, error: "Booking not found" };
  if (booking.payment_status === "paid") return { ok: true, code: booking.booking_code };

  try {
    const result = await capturePaypalOrder(orderId);
    if (result.status !== "COMPLETED") {
      return { ok: false, error: `Payment not completed (${result.status})` };
    }
    const captured = Number(result.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value);
    if (!Number.isFinite(captured) || Math.abs(captured - Number(booking.total_amount)) > 0.009) {
      await supabase
        .from("bookings")
        .update({ internal_notes: `${booking.internal_notes} amount_mismatch:${captured}` })
        .eq("id", booking.id);
      return { ok: false, error: "Payment amount mismatch" };
    }
    await supabase
      .from("bookings")
      .update({ status: "confirmed", payment_status: "paid", updated_at: new Date().toISOString() })
      .eq("id", booking.id);
    // Marca la fecha en el calendario público
    revalidatePath("/[locale]/entradas-machu-picchu-2027", "page");
    return { ok: true, code: booking.booking_code };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "PayPal error" };
  }
}

// ── Pre-reserva SIN pago: para quien todavía no quiere dar pasaporte ni pagar.
// Queda en Consultas del admin y se continúa por WhatsApp. No descuenta cupos.
const holdSchema = z.object({
  name: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().min(6).max(30),
  email: z.string().trim().max(160).optional().default(""),
  date: z.string().refine(isValid2027Date),
  pkg: z.enum(["fullday", "2d1n", "2d1n-valle"]),
  travelers: z.number().int().min(1).max(MAX_TRAVELERS),
  route: z.string().max(4).optional().default(""),
  hour: z.string().max(5).optional().default(""),
  lang: z.enum(["es", "en", "ja"]),
  /** Campo trampa: invisible para personas, los bots lo rellenan. */
  website: z.string().optional().default(""),
});

export type Mp2027HoldInput = z.input<typeof holdSchema>;

export async function createMp2027Hold(raw: Mp2027HoldInput): Promise<{ ok: true } | Fail> {
  const parsed = holdSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid_input" };
  const v = parsed.data;
  if (v.website) return { ok: true }; // bot: se responde ok pero no se guarda
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) return { ok: false, error: "invalid_email" };

  const pkg = packageById(v.pkg)!;
  const message = [
    "PRE-RESERVA MACHU PICCHU 2027 (sin pago)",
    `Fecha: ${v.date}`,
    `Paquete: ${pkg.name.es} (US$${pkg.price} por persona)`,
    `Pasajeros: ${v.travelers}`,
    v.route ? `Ruta: ${v.route}${v.hour ? ` · ${v.hour}` : ""}` : "Ruta: por definir",
    `WhatsApp: ${v.whatsapp}`,
    `Idioma de la web: ${v.lang}`,
  ].join("\n");

  const { error } = await createAdminClient().from("inquiries").insert({
    name: v.name,
    email: v.email || "",
    phone: v.whatsapp,
    message,
    status: "new",
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
