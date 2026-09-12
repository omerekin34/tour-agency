import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import { ensureRegionsLoaded } from "@/lib/regions-store";

export async function GET(request: Request) {
  const adminKey =
    request.headers.get("x-admin-key") ??
    new URL(request.url).searchParams.get("key");

  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const regions = await ensureRegionsLoaded();
    return NextResponse.json({ regions });
  } catch (err) {
    console.error("[GET /api/bolgeler/admin]", err);
    return NextResponse.json({ error: "Bölgeler yüklenemedi." }, { status: 500 });
  }
}
