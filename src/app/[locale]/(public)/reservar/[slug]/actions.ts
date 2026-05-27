"use server";

import { createAdminClient } from "@/lib/supabase/admin";

interface BookingInput {
  tour_id: string;
  travel_date: string;
  travelers: number;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_country: string | null;
  special_requests: string | null;
}

export async function createBooking(input: BookingInput) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      tour_id: input.tour_id,
      travel_date: input.travel_date,
      travelers: input.travelers,
      subtotal: input.total_amount,
      total_amount: input.total_amount,
      currency: "USD",
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      customer_country: input.customer_country,
      special_requests: input.special_requests,
      status: "pending",
      payment_status: "unpaid",
    })
    .select("booking_code")
    .single();

  if (error) return { error: error.message };

  // TODO: when Stripe is wired up, return checkout URL here.
  // TODO: send confirmation email via Resend.

  return { code: data.booking_code };
}
