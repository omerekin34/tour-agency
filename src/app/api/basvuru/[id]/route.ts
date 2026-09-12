import { NextResponse } from "next/server";
import {
  deleteApplication,
  isValidAdminKey,
  updateApplicationStatus,
  type ApplicationStatus,
} from "@/lib/applications";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_STATUSES: ApplicationStatus[] = ["yeni", "incelendi", "tamamlandi"];

function getAdminKey(request: Request): string | null {
  return request.headers.get("x-admin-key");
}

function unauthorized() {
  return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const adminKey = getAdminKey(request);
  if (!isValidAdminKey(adminKey)) return unauthorized();

  const { id } = await context.params;

  try {
    const body = await request.json();
    const status = body.status as ApplicationStatus;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
    }

    const updated = await updateApplicationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, application: updated });
  } catch {
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const adminKey = getAdminKey(request);
  if (!isValidAdminKey(adminKey)) return unauthorized();

  const { id } = await context.params;
  const deleted = await deleteApplication(id);

  if (!deleted) {
    return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
