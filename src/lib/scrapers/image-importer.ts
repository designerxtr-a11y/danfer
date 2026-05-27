import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "tour-images";

async function ensureBucket() {
  const supabase = createAdminClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
}

export async function downloadAndUpload(
  imageUrl: string,
  tourSlug: string,
  index = 0
): Promise<string | null> {
  try {
    await ensureBucket();
    const supabase = createAdminClient();

    const res = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 cuscotours-importer" },
    });
    if (!res.ok) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
      ? "webp"
      : "jpg";

    const path = `${tourSlug}/${Date.now()}-${index}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buf, {
        contentType,
        upsert: false,
        cacheControl: "31536000",
      });

    if (error) {
      console.error("[downloadAndUpload]", error.message);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (e) {
    console.error("[downloadAndUpload] failed", imageUrl, e);
    return null;
  }
}

export async function importImages(
  imageUrls: string[],
  tourSlug: string
): Promise<string[]> {
  const out: string[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const u = await downloadAndUpload(imageUrls[i], tourSlug, i);
    if (u) out.push(u);
  }
  return out;
}
