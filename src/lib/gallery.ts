import { promises as fs } from "fs";
import path from "path";
import { buildGallerySeed } from "@/lib/gallery-seed";
import type { GalleryItem, GalleryMediaType } from "@/lib/gallery-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { CategoryKey } from "@/lib/data";

export type { GalleryItem, GalleryMediaType, GalleryFilter } from "@/lib/gallery-shared";
export { isYouTubeUrl, toYouTubeEmbedUrl } from "@/lib/gallery-shared";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "gallery.json");

type GalleryRow = {
  id: string;
  created_at: string;
  tour_id: string;
  tour_title: string;
  category: CategoryKey;
  type: GalleryMediaType;
  url: string;
  title: string;
};

function rowToItem(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    createdAt: row.created_at,
    tourId: row.tour_id,
    tourTitle: row.tour_title,
    category: row.category,
    type: row.type,
    url: row.url,
    title: row.title,
  };
}

function itemToRow(item: GalleryItem): GalleryRow {
  return {
    id: item.id,
    created_at: item.createdAt,
    tour_id: item.tourId,
    tour_title: item.tourTitle,
    category: item.category,
    type: item.type,
    url: item.url,
    title: item.title,
  };
}

async function ensureJsonStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function getItemsFromJson(): Promise<GalleryItem[]> {
  await ensureJsonStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const list = JSON.parse(raw) as GalleryItem[];
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

async function writeItemsJson(list: GalleryItem[]) {
  await ensureJsonStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

function isMissingGalleryTable(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    error.message?.includes("gallery_items") === true
  );
}

async function getItemsFromSupabase(): Promise<GalleryItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingGalleryTable(error)) {
      console.warn("[gallery_items] Supabase table missing, using JSON store.");
      return getItemsFromJson();
    }
    throw error;
  }
  return (data as GalleryRow[]).map(rowToItem);
}

async function seedIfEmpty(items: GalleryItem[]): Promise<GalleryItem[]> {
  if (items.length > 0) return items;

  const seed = buildGallerySeed();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("gallery_items").insert(seed.map(itemToRow));
    if (error) {
      if (isMissingGalleryTable(error)) {
        await writeItemsJson(seed);
        return seed;
      }
      throw error;
    }
    return seed;
  }

  await writeItemsJson(seed);
  return seed;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured()) {
    const items = await getItemsFromSupabase();
    return seedIfEmpty(items);
  }

  const items = await getItemsFromJson();
  return seedIfEmpty(items);
}

export async function saveGalleryItem(
  data: Omit<GalleryItem, "id" | "createdAt">,
): Promise<GalleryItem> {
  const entry: GalleryItem = {
    ...data,
    id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("gallery_items").insert(itemToRow(entry));
    if (error) {
      if (isMissingGalleryTable(error)) {
        const list = await getItemsFromJson();
        list.unshift(entry);
        await writeItemsJson(list);
        return entry;
      }
      throw error;
    }
    return entry;
  }

  const list = await getItemsFromJson();
  list.unshift(entry);
  await writeItemsJson(list);
  return entry;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error, count } = await supabase
      .from("gallery_items")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      if (isMissingGalleryTable(error)) {
        const list = await getItemsFromJson();
        const next = list.filter((item) => item.id !== id);
        if (next.length === list.length) return false;
        await writeItemsJson(next);
        return true;
      }
      throw error;
    }
    return (count ?? 0) > 0;
  }

  const list = await getItemsFromJson();
  const next = list.filter((item) => item.id !== id);
  if (next.length === list.length) return false;
  await writeItemsJson(next);
  return true;
}
