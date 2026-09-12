import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import { ensureToursLoaded } from "@/lib/tours-store";

export async function GET(request: Request) {
  const adminKey =
    request.headers.get("x-admin-key") ??
    new URL(request.url).searchParams.get("key");

  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const tours = await ensureToursLoaded();
    return NextResponse.json({ tours });
  } catch (err) {
    console.error("[GET /api/turlar/admin]", err);
    return NextResponse.json({ error: "Turlar yüklenemedi." }, { status: 500 });
  }
}
