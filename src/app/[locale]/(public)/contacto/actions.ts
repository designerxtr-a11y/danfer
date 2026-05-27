"use server";

import { createAdminClient } from "@/lib/supabase/admin";

interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function submitInquiry(input: InquiryInput) {
  if (!input.name || !input.email) {
    return { ok: false, error: "Nombre y email son requeridos." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    message: input.message || null,
    status: "new",
  });

  if (error) return { ok: false, error: error.message };

  // TODO: send notification email to admin via Resend when configured.

  return { ok: true };
}
