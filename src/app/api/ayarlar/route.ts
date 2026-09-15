import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/admin-auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings-store";
import type { SiteSettings } from "@/lib/site-settings-shared";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteSettings>;
    const settings = await updateSiteSettings(body);
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error("[PATCH /api/ayarlar]", error);
    return NextResponse.json(
      { error: "Ayarlar kaydedilemedi." },
      { status: 500 },
    );
  }
}
