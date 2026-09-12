import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import { getAllTours } from "@/lib/data";
import { deleteGalleryItem, getGalleryItems, saveGalleryItem } from "@/lib/gallery";

export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[GET /api/galeri]", err);
    return NextResponse.json({ error: "Galeri yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const required = ["tourId", "type", "url", "title"] as const;

    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `${field} alanı zorunludur.` },
          { status: 400 },
        );
      }
    }

    const type = String(body.type).trim();
    if (type !== "photo" && type !== "video") {
      return NextResponse.json({ error: "Geçersiz medya tipi." }, { status: 400 });
    }

    const tourId = String(body.tourId).trim();
    const tour = getAllTours().find((item) => item.id === tourId);
    if (!tour) {
      return NextResponse.json({ error: "Tur bulunamadı." }, { status: 400 });
    }

    const item = await saveGalleryItem({
      tourId,
      tourTitle: tour.title,
      category: tour.category,
      type,
      url: String(body.url).trim(),
      title: String(body.title).trim(),
    });

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    console.error("[POST /api/galeri]", err);
    const detail = err instanceof Error ? err.message : "Medya eklenemedi.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
