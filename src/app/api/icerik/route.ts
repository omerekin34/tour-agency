import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/admin-auth";
import { getSiteContent, updateSiteContent } from "@/lib/site-content-store";
import type { SiteContent } from "@/lib/site-content-shared";

export async function GET(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PATCH(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteContent>;
    const content = await updateSiteContent(body);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("[PATCH /api/icerik]", error);
    return NextResponse.json(
      { error: "İçerik kaydedilemedi." },
      { status: 500 },
    );
  }
}
