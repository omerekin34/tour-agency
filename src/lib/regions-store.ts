import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { buildRegionsSeed } from "@/lib/regions-seed";
import {
  getCachedRegionById,
  getCachedRegions,
  invalidateRegionCache,
  setRegionCache,
} from "@/lib/regions-cache";
import type { TourRegion } from "@/lib/regions-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export {
  getCachedRegionById,
  getCachedRegions,
  invalidateRegionCache,
} from "@/lib/regions-cache";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "regions.json");

type RegionRow = {
  id: string;
  name: string;
  card_label: string;
  home_title: string;
  home_variant: string;
  sort_order: number;
  published: boolean;
  show_on_home: boolean;
  show_in_search: boolean;
  show_in_hero: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_price: string;
  hero_period: string;
  hero_image: string;
  icon: string;
};

function isMissingRegionsTable(error: { code?: string; message?: string }) {
  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "PGRST205" ||
    message.includes('relation "regions" does not exist') ||
    (message.includes("could not find the table") && message.includes("regions"))
  );
}

function isLocalJsonWritable() {
  return !process.env.VERCEL;
}

function rowToRegion(row: RegionRow): TourRegion {
  return {
    id: row.id,
    name: row.name,
    cardLabel: row.card_label,
    homeTitle: row.home_title,
    homeVariant: row.home_variant as TourRegion["homeVariant"],
    sortOrder: row.sort_order,
    published: row.published,
    showOnHome: row.show_on_home,
    showInSearch: row.show_in_search,
    showInHero: row.show_in_hero,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    heroPrice: row.hero_price,
    heroPeriod: row.hero_period,
    heroImage: row.hero_image,
    icon: row.icon,
  };
}

function regionToRow(region: TourRegion): RegionRow {
  return {
    id: region.id,
    name: region.name,
    card_label: region.cardLabel,
    home_title: region.homeTitle,
    home_variant: region.homeVariant,
    sort_order: region.sortOrder,
    published: region.published,
    show_on_home: region.showOnHome,
    show_in_search: region.showInSearch,
    show_in_hero: region.showInHero,
    hero_title: region.heroTitle,
    hero_subtitle: region.heroSubtitle,
    hero_price: region.heroPrice,
    hero_period: region.heroPeriod,
    hero_image: region.heroImage,
    icon: region.icon,
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

async function readJsonRegions(): Promise<TourRegion[]> {
  await ensureJsonStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as TourRegion[];
}

async function writeJsonRegions(list: TourRegion[]) {
  await ensureJsonStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

async function readSupabaseRegions(): Promise<TourRegion[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      if (isMissingRegionsTable(error)) {
        return readJsonRegions();
      }
      console.warn("[regions-store] Supabase okuma hatası:", error.message);
      return readJsonRegions();
    }

    return (data as RegionRow[]).map(rowToRegion);
  } catch (error) {
    console.warn("[regions-store] Supabase erişilemedi, yerel kayıt kullanılıyor:", error);
    return readJsonRegions();
  }
}

async function seedIfEmpty(items: TourRegion[]): Promise<TourRegion[]> {
  if (items.length > 0) return items;

  const seed = buildRegionsSeed();

  if (isLocalJsonWritable()) {
    try {
      await writeJsonRegions(seed);
    } catch (error) {
      console.warn("[regions-store] Seed JSON yazılamadı:", error);
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("regions")
      .upsert(seed.map(regionToRow), { onConflict: "id" });
    if (error && !isMissingRegionsTable(error)) {
      console.warn("[regions-store] Supabase seed hatası:", error.message);
    }
  }

  return seed;
}

function sortRegions(list: TourRegion[]) {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "tr"));
}

async function persistRegionsLocally(list: TourRegion[]) {
  const sorted = sortRegions(list);
  setRegionCache(sorted);

  if (!isLocalJsonWritable()) return;

  try {
    await writeJsonRegions(sorted);
  } catch (error) {
    console.warn("[regions-store] Yerel JSON yazılamadı:", error);
  }
}

async function syncRegionToSupabase(region: TourRegion) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("regions")
    .upsert(regionToRow(region), { onConflict: "id" });

  if (error) {
    if (isMissingRegionsTable(error)) {
      console.warn("[regions-store] Supabase regions tablosu yok, yerel kayıt kullanılıyor.");
      return;
    }
    throw new Error(`Supabase kayıt hatası: ${error.message}`);
  }
}

async function deleteRegionFromSupabase(id: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("regions").delete().eq("id", id);

  if (error && !isMissingRegionsTable(error)) {
    throw error;
  }
}

function revalidateRegionPages() {
  revalidatePath("/");
  revalidatePath("/turlar");
  revalidatePath("/galeri");
}

export async function ensureRegionsLoaded(): Promise<TourRegion[]> {
  const cached = getCachedRegions();
  if (!process.env.VERCEL && cached.length > 0) {
    return cached;
  }

  try {
    const items = isSupabaseConfigured()
      ? await readSupabaseRegions()
      : await readJsonRegions();

    const loaded = await seedIfEmpty(items);
    setRegionCache(sortRegions(loaded));
  } catch (error) {
    console.error("[regions-store] Yükleme hatası, varsayılan bölgeler kullanılıyor:", error);
    setRegionCache(sortRegions(buildRegionsSeed()));
  }

  return getCachedRegions();
}

export function getPublishedRegions(): TourRegion[] {
  return getCachedRegions().filter((region) => region.published);
}

export function getHomeRegions(): TourRegion[] {
  return getPublishedRegions().filter((region) => region.showOnHome);
}

export function getSearchRegions(): TourRegion[] {
  return getPublishedRegions().filter((region) => region.showInSearch);
}

export function getHeroRegions(): TourRegion[] {
  return getPublishedRegions().filter((region) => region.showInHero);
}

export async function updateManagedRegion(
  id: string,
  data: Partial<TourRegion>,
): Promise<TourRegion | null> {
  if (process.env.VERCEL) invalidateRegionCache();

  const regions = await ensureRegionsLoaded();
  const index = regions.findIndex((region) => region.id === id);
  if (index === -1) return null;

  const next: TourRegion = { ...regions[index], ...data, id };
  const list = [...regions];
  list[index] = next;

  await syncRegionToSupabase(next);
  await persistRegionsLocally(list);
  revalidateRegionPages();

  return next;
}

export async function createManagedRegion(region: TourRegion): Promise<TourRegion> {
  if (process.env.VERCEL) invalidateRegionCache();

  const regions = await ensureRegionsLoaded();
  if (regions.some((item) => item.id === region.id)) {
    throw new Error("Bu bölge kodu zaten kullanılıyor.");
  }

  const list = [...regions, region];
  await syncRegionToSupabase(region);
  await persistRegionsLocally(list);
  revalidateRegionPages();

  return region;
}

export async function deleteManagedRegion(id: string): Promise<boolean> {
  if (process.env.VERCEL) invalidateRegionCache();

  const regions = await ensureRegionsLoaded();
  const next = regions.filter((region) => region.id !== id);
  if (next.length === regions.length) return false;

  await deleteRegionFromSupabase(id);
  await persistRegionsLocally(next);
  revalidateRegionPages();

  return true;
}
