import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { buildToursSeed } from "@/lib/tours-seed";
import {
  getCachedManagedTours,
  invalidateTourCache,
  setTourCache,
} from "@/lib/tours-cache";
import type { ManagedTour } from "@/lib/tours-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { ItineraryDay } from "@/lib/tour-details";
import {
  getDefaultVisaTypesForCategory,
  type VisaType,
} from "@/lib/tour-filters";

export {
  getCachedManagedTourById,
  getCachedManagedTours,
  invalidateTourCache,
} from "@/lib/tours-cache";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tours.json");

type TourRow = {
  id: string;
  title: string;
  destination: string;
  category: string;
  date: string;
  price: number;
  currency: string;
  days: number;
  image: string;
  capacity: number;
  transport: string;
  accommodation: string;
  featured: boolean;
  published: boolean;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  gallery: string[];
  video_url: string;
  includes: string[];
  excludes: string[];
  departures: string[];
  visa_types: VisaType[];
};

function isMissingToursTable(error: { code?: string; message?: string }) {
  return error.code === "PGRST205" || error.message?.includes("tours") === true;
}

function rowToManaged(row: TourRow): ManagedTour {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination as ManagedTour["destination"],
    category: row.category as ManagedTour["category"],
    date: row.date,
    price: Number(row.price),
    currency: row.currency as ManagedTour["currency"],
    days: row.days,
    image: row.image,
    capacity: row.capacity,
    transport: row.transport,
    accommodation: row.accommodation,
    featured: row.featured,
    published: row.published,
    description: row.description,
    highlights: row.highlights ?? [],
    itinerary: row.itinerary ?? [],
    gallery: row.gallery ?? [],
    videoUrl: row.video_url,
    includes: row.includes ?? [],
    excludes: row.excludes ?? [],
    departures: row.departures?.length ? row.departures : ["istanbul"],
    visaTypes: row.visa_types?.length
      ? row.visa_types
      : getDefaultVisaTypesForCategory(row.category),
  };
}

function managedToRow(tour: ManagedTour): TourRow {
  return {
    id: tour.id,
    title: tour.title,
    destination: tour.destination,
    category: tour.category,
    date: tour.date,
    price: tour.price,
    currency: tour.currency,
    days: tour.days,
    image: tour.image,
    capacity: tour.capacity,
    transport: tour.transport,
    accommodation: tour.accommodation,
    featured: tour.featured,
    published: tour.published,
    description: tour.description,
    highlights: tour.highlights,
    itinerary: tour.itinerary,
    gallery: tour.gallery,
    video_url: tour.videoUrl,
    includes: tour.includes,
    excludes: tour.excludes,
    departures: tour.departures ?? ["istanbul"],
    visa_types: tour.visaTypes ?? getDefaultVisaTypesForCategory(tour.category),
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

async function readJsonTours(): Promise<ManagedTour[]> {
  await ensureJsonStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as ManagedTour[];
}

async function writeJsonTours(list: ManagedTour[]) {
  await ensureJsonStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

async function readSupabaseTours(): Promise<ManagedTour[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      if (isMissingToursTable(error)) {
        return readJsonTours();
      }
      console.warn("[tours-store] Supabase okuma hatası:", error.message);
      return readJsonTours();
    }

    return (data as TourRow[]).map(rowToManaged);
  } catch (error) {
    console.warn("[tours-store] Supabase erişilemedi, yerel kayıt kullanılıyor:", error);
    return readJsonTours();
  }
}

async function seedIfEmpty(items: ManagedTour[]): Promise<ManagedTour[]> {
  if (items.length > 0) return items;

  const seed = buildToursSeed();

  if (isLocalJsonWritable()) {
    try {
      await writeJsonTours(seed);
    } catch (error) {
      console.warn("[tours-store] Seed JSON yazılamadı:", error);
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("tours")
      .upsert(seed.map(managedToRow), { onConflict: "id" });
    if (error && !isMissingToursTable(error)) {
      console.warn("[tours-store] Supabase seed hatası:", error.message);
    }
  }

  return seed;
}

export async function ensureToursLoaded(): Promise<ManagedTour[]> {
  const cached = getCachedManagedTours();
  if (!process.env.VERCEL && cached.length > 0) {
    return cached;
  }

  try {
    const items = isSupabaseConfigured()
      ? await readSupabaseTours()
      : await readJsonTours();

    const loaded = await seedIfEmpty(items);
    setTourCache(loaded);
  } catch (error) {
    console.error("[tours-store] Yükleme hatası, varsayılan turlar kullanılıyor:", error);
    setTourCache(buildToursSeed());
  }

  return getCachedManagedTours();
}

function revalidateTourPages(id?: string) {
  revalidatePath("/");
  revalidatePath("/turlar");
  revalidatePath("/gezi-takvimi");
  revalidatePath("/galeri");
  if (id) {
    revalidatePath(`/turlar/${id}`);
    revalidatePath(`/turlar/${id}/basvuru`);
  }
}

export async function getManagedTours(): Promise<ManagedTour[]> {
  return ensureToursLoaded();
}

export async function getManagedTourById(id: string): Promise<ManagedTour | undefined> {
  const tours = await ensureToursLoaded();
  return tours.find((tour) => tour.id === id);
}

function isLocalJsonWritable() {
  return !process.env.VERCEL;
}

async function persistToursLocally(list: ManagedTour[]) {
  setTourCache(list);

  if (!isLocalJsonWritable()) return;

  try {
    await writeJsonTours(list);
  } catch (error) {
    console.warn("[tours-store] Yerel JSON yazılamadı:", error);
  }
}

async function syncTourToSupabase(tour: ManagedTour) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("tours")
    .upsert(managedToRow(tour), { onConflict: "id" });

  if (error) {
    if (isMissingToursTable(error)) {
      console.warn("[tours-store] Supabase tours tablosu yok, yerel kayıt kullanılıyor.");
      return;
    }
    throw new Error(`Supabase kayıt hatası: ${error.message}`);
  }
}

export async function updateManagedTour(
  id: string,
  data: Partial<ManagedTour>,
): Promise<ManagedTour | null> {
  if (process.env.VERCEL) {
    invalidateTourCache();
  }

  const tours = await ensureToursLoaded();
  const index = tours.findIndex((tour) => tour.id === id);
  if (index === -1) return null;

  const next: ManagedTour = {
    ...tours[index],
    ...data,
    id,
    destination: (data.destination ?? data.category ?? tours[index].destination) as ManagedTour["destination"],
    category: (data.category ?? data.destination ?? tours[index].category) as ManagedTour["category"],
  };

  const list = [...tours];
  list[index] = next;

  await syncTourToSupabase(next);
  await persistToursLocally(list);
  revalidateTourPages(id);

  return next;
}

async function deleteTourFromSupabase(id: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("tours").delete().eq("id", id);

  if (error && !isMissingToursTable(error)) {
    throw error;
  }
}

export async function createManagedTour(tour: ManagedTour): Promise<ManagedTour> {
  if (process.env.VERCEL) {
    invalidateTourCache();
  }

  const tours = await ensureToursLoaded();

  if (tours.some((item) => item.id === tour.id)) {
    throw new Error("Bu tur kodu zaten kullanılıyor. Farklı bir kod seçin.");
  }

  const list = [...tours, tour].sort((a, b) => a.date.localeCompare(b.date));

  await syncTourToSupabase(tour);
  await persistToursLocally(list);
  revalidateTourPages(tour.id);

  return tour;
}

export async function deleteManagedTour(id: string): Promise<boolean> {
  if (process.env.VERCEL) {
    invalidateTourCache();
  }

  const tours = await ensureToursLoaded();
  const next = tours.filter((tour) => tour.id !== id);

  if (next.length === tours.length) return false;

  await deleteTourFromSupabase(id);
  await persistToursLocally(next);
  revalidateTourPages(id);

  return true;
}
