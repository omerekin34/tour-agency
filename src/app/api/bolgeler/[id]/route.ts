import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import {
  deleteManagedRegion,
  updateManagedRegion,
} from "@/lib/regions-store";
import type { TourRegion } from "@/lib/regions-shared";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<TourRegion>;
    const region = await updateManagedRegion(id, body);

    if (!region) {
      return NextResponse.json({ error: "Bölge bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      message: "Bölge başarıyla kaydedildi!",
      region,
    });
  } catch (err) {
    console.error("[PATCH /api/bolgeler/[id]]", err);
    const detail = err instanceof Error ? err.message : "Bölge güncellenemedi.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteManagedRegion(id);

    if (!deleted) {
      return NextResponse.json({ error: "Bölge bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      message: "Bölge başarıyla silindi!",
    });
  } catch (err) {
    console.error("[DELETE /api/bolgeler/[id]]", err);
    const detail = err instanceof Error ? err.message : "Bölge silinemedi.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
