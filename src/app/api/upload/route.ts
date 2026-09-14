import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import { uploadMediaFile } from "@/lib/media-upload";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
    }

    const url = await uploadMediaFile(file);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    const message = err instanceof Error ? err.message : "Dosya yüklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
