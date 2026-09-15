import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import {
  defaultSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-settings.json");

let cachedSettings: SiteSettings | null = null;

function isLocalJsonWritable() {
  return !process.env.VERCEL;
}

async function ensureJsonStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(defaultSiteSettings, null, 2),
      "utf-8",
    );
  }
}

async function readJsonSettings(): Promise<SiteSettings> {
  await ensureJsonStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return { ...defaultSiteSettings, ...(JSON.parse(raw) as Partial<SiteSettings>) };
}

async function writeJsonSettings(settings: SiteSettings) {
  if (!isLocalJsonWritable()) return;
  await ensureJsonStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

async function readSupabaseSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_settings")
      .select("payload")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      const message = error.message?.toLowerCase() ?? "";
      if (
        error.code === "PGRST205" ||
        message.includes("site_settings") ||
        message.includes("could not find the table")
      ) {
        return null;
      }
      console.warn("[site-settings] Supabase okuma hatası:", error.message);
      return null;
    }

    if (!data?.payload) return null;
    return { ...defaultSiteSettings, ...(data.payload as Partial<SiteSettings>) };
  } catch (error) {
    console.warn("[site-settings] Supabase erişilemedi:", error);
    return null;
  }
}

async function writeSupabaseSettings(settings: SiteSettings) {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("site_settings").upsert(
      {
        id: "default",
        payload: settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      const message = error.message?.toLowerCase() ?? "";
      if (
        error.code === "PGRST205" ||
        message.includes("site_settings") ||
        message.includes("could not find the table")
      ) {
        return;
      }
      throw new Error(error.message);
    }
  } catch (error) {
    console.warn("[site-settings] Supabase yazma hatası:", error);
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (cachedSettings && !process.env.VERCEL) {
    return cachedSettings;
  }

  const fromSupabase = isSupabaseConfigured() ? await readSupabaseSettings() : null;
  const settings = fromSupabase ?? (await readJsonSettings());
  cachedSettings = settings;
  return settings;
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  cachedSettings = null;

  const current = await getSiteSettings();
  const next: SiteSettings = { ...current, ...patch };

  await writeSupabaseSettings(next);
  await writeJsonSettings(next);

  cachedSettings = next;
  revalidatePath("/", "layout");

  return next;
}
