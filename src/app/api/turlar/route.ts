import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import { createManagedTour, ensureToursLoaded } from "@/lib/tours-store";
import type { ManagedTour } from "@/lib/tours-shared";
import { managedToTour } from "@/lib/tours-shared";

export async function GET() {
  try {
    const tours = await ensureToursLoaded();
    return NextResponse.json({
      tours: tours.filter((tour) => tour.published).map(managedToTour),
    });
  } catch (err) {
    console.error("[GET /api/turlar]", err);
    return NextResponse.json({ error: "Turlar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ManagedTour;

    if (!body.id?.trim() || !body.title?.trim()) {
      return NextResponse.json(
        { error: "Tur kodu ve tur adı zorunludur." },
        { status: 400 },
      );
    }

    const tour = await createManagedTour({
      ...body,
      id: body.id.trim(),
      destination: body.destination ?? body.category,
      category: body.category ?? body.destination,
    });

    return NextResponse.json({
      ok: true,
      message: "Tur başarılı bir şekilde eklendi.",
      tour,
    });
  } catch (err) {
    console.error("[POST /api/turlar]", err);
    const detail = err instanceof Error ? err.message : "Tur eklenemedi.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
