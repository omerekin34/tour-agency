import { promises as fs } from "fs";
import path from "path";
import type { ApplicationStatus, TourApplication } from "@/lib/applications-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export type { ApplicationStatus, TourApplication, ApplicationStats } from "@/lib/applications-shared";
export {
  APPLICATION_STATUS_LABELS,
  formatRoomType,
  formatWhatsAppPhone,
  getApplicationStats,
} from "@/lib/applications-shared";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "applications.json");

type ApplicationRow = {
  id: string;
  created_at: string;
  tour_id: string;
  tour_title: string;
  tour_date: string;
  tour_price: string;
  name: string;
  phone: string;
  email: string;
  travelers: string;
  room_type: string;
  notes: string;
  status: ApplicationStatus;
};

function rowToApplication(row: ApplicationRow): TourApplication {
  return {
    id: row.id,
    createdAt: row.created_at,
    tourId: row.tour_id,
    tourTitle: row.tour_title,
    tourDate: row.tour_date,
    tourPrice: row.tour_price,
    name: row.name,
    phone: row.phone,
    email: row.email,
    travelers: row.travelers,
    roomType: row.room_type,
    notes: row.notes,
    status: row.status,
  };
}

function applicationToRow(
  app: TourApplication,
): ApplicationRow {
  return {
    id: app.id,
    created_at: app.createdAt,
    tour_id: app.tourId,
    tour_title: app.tourTitle,
    tour_date: app.tourDate,
    tour_price: app.tourPrice,
    name: app.name,
    phone: app.phone,
    email: app.email,
    travelers: app.travelers,
    room_type: app.roomType,
    notes: app.notes,
    status: app.status,
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

async function getApplicationsFromJson(): Promise<TourApplication[]> {
  await ensureJsonStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const list = JSON.parse(raw) as TourApplication[];
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

async function writeApplicationsJson(list: TourApplication[]) {
  await ensureJsonStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

async function getApplicationsFromSupabase(): Promise<TourApplication[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tour_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ApplicationRow[]).map(rowToApplication);
}

export async function getApplications(): Promise<TourApplication[]> {
  if (isSupabaseConfigured()) {
    return getApplicationsFromSupabase();
  }
  return getApplicationsFromJson();
}

export async function saveApplication(
  data: Omit<TourApplication, "id" | "createdAt" | "status">,
): Promise<TourApplication> {
  const entry: TourApplication = {
    ...data,
    id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "yeni",
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("tour_applications")
      .insert(applicationToRow(entry));

    if (error) throw error;
    return entry;
  }

  const list = await getApplicationsFromJson();
  list.unshift(entry);
  await writeApplicationsJson(list);
  return entry;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<TourApplication | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("tour_applications")
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? rowToApplication(data as ApplicationRow) : null;
  }

  const list = await getApplicationsFromJson();
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], status };
  await writeApplicationsJson(list);
  return list[index];
}

export async function deleteApplication(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error, count } = await supabase
      .from("tour_applications")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    return (count ?? 0) > 0;
  }

  const list = await getApplicationsFromJson();
  const next = list.filter((item) => item.id !== id);
  if (next.length === list.length) return false;
  await writeApplicationsJson(next);
  return true;
}

export { getAdminPassword, isValidAdminKey } from "@/lib/admin-auth";
