import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import {
  defaultSiteContent,
  mergeSiteContent,
  type SiteContent,
} from "@/lib/site-content-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-content.json");

let cachedContent: SiteContent | null = null;

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
      JSON.stringify(defaultSiteContent(), null, 2),
      "utf-8",
    );
  }
}

async function readJsonContent(): Promise<SiteContent> {
  await ensureJsonStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>);
}

async function writeJsonContent(content: SiteContent) {
  if (!isLocalJsonWritable()) return;
  await ensureJsonStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), "utf-8");
}

async function readSupabaseContent(): Promise<SiteContent | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_content")
      .select("payload")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      const message = error.message?.toLowerCase() ?? "";
      if (
        error.code === "PGRST205" ||
        message.includes("site_content") ||
        message.includes("could not find the table")
      ) {
        return null;
      }
      console.warn("[site-content] Supabase okuma hatası:", error.message);
      return null;
    }

    if (!data?.payload) return null;
    return mergeSiteContent(data.payload as Partial<SiteContent>);
  } catch (error) {
    console.warn("[site-content] Supabase erişilemedi:", error);
    return null;
  }
}

async function writeSupabaseContent(content: SiteContent) {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("site_content").upsert(
      {
        id: "default",
        payload: content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      const message = error.message?.toLowerCase() ?? "";
      if (
        error.code === "PGRST205" ||
        message.includes("site_content") ||
        message.includes("could not find the table")
      ) {
        return;
      }
      throw new Error(error.message);
    }
  } catch (error) {
    console.warn("[site-content] Supabase yazma hatası:", error);
  }
}

function revalidateContentPaths() {
  revalidatePath("/sss");
  revalidatePath("/gizlilik-politikasi");
  revalidatePath("/cerez-politikasi");
  revalidatePath("/kullanim-sartlari");
  revalidatePath("/kvkk-aydinlatma");
}

export async function getSiteContent(): Promise<SiteContent> {
  if (cachedContent && !process.env.VERCEL) {
    return cachedContent;
  }

  const fromSupabase = isSupabaseConfigured()
    ? await readSupabaseContent()
    : null;
  const content = fromSupabase ?? (await readJsonContent());
  cachedContent = content;
  return content;
}

export async function updateSiteContent(
  patch: Partial<SiteContent>,
): Promise<SiteContent> {
  cachedContent = null;

  const current = await getSiteContent();
  const next: SiteContent = {
    faq: patch.faq !== undefined ? patch.faq : current.faq,
    legal: {
      gizlilik: patch.legal?.gizlilik ?? current.legal.gizlilik,
      cerez: patch.legal?.cerez ?? current.legal.cerez,
      kullanim: patch.legal?.kullanim ?? current.legal.kullanim,
      kvkk: patch.legal?.kvkk ?? current.legal.kvkk,
    },
  };

  await writeSupabaseContent(next);
  await writeJsonContent(next);

  cachedContent = next;
  revalidateContentPaths();

  return next;
}
