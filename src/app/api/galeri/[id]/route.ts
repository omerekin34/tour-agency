import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import { deleteGalleryItem } from "@/lib/gallery";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteGalleryItem(id);

    if (!deleted) {
      return NextResponse.json({ error: "Medya bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/galeri/[id]]", err);
    return NextResponse.json({ error: "Medya silinemedi." }, { status: 500 });
  }
}
