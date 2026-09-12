import { promises as fs } from "fs";
import path from "path";
import { buildToursSeed } from "@/lib/tours-seed";
import {
  getCachedManagedTours,
  invalidateTourCache,
  setTourCache,
} from "@/lib/tours-cache";
import type { ManagedTour } from "@/lib/tours-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { ItineraryDay } from "@/lib/tour-details";

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
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    if (isMissingToursTable(error)) {
      return readJsonTours();
    }
    throw error;
  }

  return (data as TourRow[]).map(rowToManaged);
}

async function seedIfEmpty(items: ManagedTour[]): Promise<ManagedTour[]> {
  if (items.length > 0) return items;

  const seed = buildToursSeed();

  await writeJsonTours(seed);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("tours")
      .upsert(seed.map(managedToRow), { onConflict: "id" });
    if (error && !isMissingToursTable(error)) {
      throw error;
    }
  }

  return seed;
}

export async function ensureToursLoaded(): Promise<ManagedTour[]> {
  const cached = getCachedManagedTours();
  if (cached.length > 0) return cached;

  const items = isSupabaseConfigured()
    ? await readSupabaseTours()
    : await readJsonTours();

  const loaded = await seedIfEmpty(items);
  setTourCache(loaded);
  return loaded;
}

export async function getManagedTours(): Promise<ManagedTour[]> {
  return ensureToursLoaded();
}

export async function getManagedTourById(id: string): Promise<ManagedTour | undefined> {
  const tours = await ensureToursLoaded();
  return tours.find((tour) => tour.id === id);
}

async function persistToursLocally(list: ManagedTour[]) {
  await writeJsonTours(list);
  setTourCache(list);
}

async function syncTourToSupabase(tour: ManagedTour) {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("tours")
    .upsert(managedToRow(tour), { onConflict: "id" });

  if (error && !isMissingToursTable(error)) {
    throw error;
  }
}

export async function updateManagedTour(
  id: string,
  data: Partial<ManagedTour>,
): Promise<ManagedTour | null> {
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

  return next;
}
