import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const BUCKET = "media";
const MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function sanitizeExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  return ext.replace(/[^a-z0-9]/g, "") || "bin";
}

async function saveLocal(buffer: Buffer, fileName: string) {
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), buffer);
  return `/uploads/${fileName}`;
}

async function saveToSupabase(buffer: Buffer, fileName: string, contentType: string) {
  const supabase = getSupabaseAdmin();
  const storagePath = `uploads/${fileName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(
      error.message.includes("Bucket not found")
        ? "Supabase 'media' bucket bulunamadı. Dashboard → Storage → New bucket → media (public)."
        : `Dosya yüklenemedi: ${error.message}`,
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadMediaFile(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error("Dosya boyutu en fazla 25 MB olabilir.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Desteklenmeyen dosya tipi. JPG, PNG, WEBP, GIF, MP4 veya WEBM kullanın.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${sanitizeExtension(file.name)}`;

  if (isSupabaseConfigured()) {
    try {
      return await saveToSupabase(buffer, safeName, file.type);
    } catch (error) {
      if (process.env.VERCEL) throw error;
      console.warn("[media-upload] Supabase başarısız, yerel kayda geçiliyor:", error);
    }
  }

  return saveLocal(buffer, safeName);
}
