// Server actions arrive at Vercel with a ~4MB cap; phone photos are often bigger.
export const MAX_UPLOAD = 3.8 * 1024 * 1024;
const MAX_SIDE = 2000;

// Re-encode photos as JPEG (max 2000px) so they fit the upload limit while
// keeping the passport legible. PDFs and images the browser can't decode
// (e.g. HEIC outside Safari) are sent as-is.
export async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 900 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
