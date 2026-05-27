"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(id: string, status: string) {
  const supabase = createAdminClient();
  await supabase.from("bookings").update({ status }).eq("id", id);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}
