import { promises as fs } from "fs";
import path from "path";

export type TourApplication = {
  id: string;
  createdAt: string;
  tourId: string;
  tourTitle: string;
  tourDate: string;
  tourPrice: string;
  name: string;
  phone: string;
  email: string;
  travelers: string;
  roomType: string;
  notes: string;
  status: "yeni" | "incelendi" | "tamamlandi";
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "applications.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function getApplications(): Promise<TourApplication[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const list = JSON.parse(raw) as TourApplication[];
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function saveApplication(
  data: Omit<TourApplication, "id" | "createdAt" | "status">,
): Promise<TourApplication> {
  await ensureStore();
  const list = await getApplications();

  const entry: TourApplication = {
    ...data,
    id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "yeni",
  };

  list.unshift(entry);
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return entry;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "onda2027";
}

export function isValidAdminKey(key: string | null | undefined): boolean {
  if (!key) return false;
  return key === getAdminPassword();
}
