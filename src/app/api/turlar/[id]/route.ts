import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import {
  ensureToursLoaded,
  getManagedTourById,
  invalidateTourCache,
  updateManagedTour,
} from "@/lib/tours-store";
import type { ManagedTour } from "@/lib/tours-shared";
import { managedToDetail, managedToTour } from "@/lib/tours-shared";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await ensureToursLoaded();
    const tour = await getManagedTourById(id);

    if (!tour || !tour.published) {
      return NextResponse.json({ error: "Tur bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({
      tour: managedToTour(tour),
      detail: managedToDetail(tour),
    });
  } catch (err) {
    console.error("[GET /api/turlar/[id]]", err);
    return NextResponse.json({ error: "Tur yüklenemedi." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<ManagedTour>;

    invalidateTourCache();
    const tour = await updateManagedTour(id, body);

    if (!tour) {
      return NextResponse.json({ error: "Tur bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, tour });
  } catch (err) {
    console.error("[PATCH /api/turlar/[id]]", err);
    const detail = err instanceof Error ? err.message : "Tur güncellenemedi.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
