import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import {
  createManagedRegion,
  ensureRegionsLoaded,
  getSearchRegions,
} from "@/lib/regions-store";
import type { TourRegion } from "@/lib/regions-shared";

export async function GET(request: Request) {
  try {
    await ensureRegionsLoaded();
    const adminKey = request.headers.get("x-admin-key");
    const regions = isValidAdminKey(adminKey)
      ? await ensureRegionsLoaded()
      : getSearchRegions();

    return NextResponse.json({ regions });
  } catch (err) {
    console.error("[GET /api/bolgeler]", err);
    return NextResponse.json({ error: "Bölgeler yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as TourRegion;
    if (!body.id?.trim() || !body.name?.trim()) {
      return NextResponse.json(
        { error: "Bölge kodu ve adı zorunludur." },
        { status: 400 },
      );
    }

    const region = await createManagedRegion({ ...body, id: body.id.trim() });
    return NextResponse.json({
      ok: true,
      message: "Bölge başarıyla eklendi!",
      region,
    });
  } catch (err) {
    console.error("[POST /api/bolgeler]", err);
    const detail = err instanceof Error ? err.message : "Bölge eklenemedi.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
