import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import {
  deleteMessage,
  updateMessageStatus,
  type MessageStatus,
} from "@/lib/messages";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_STATUSES: MessageStatus[] = ["yeni", "okundu", "yanitlandi"];

function unauthorized() {
  return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) return unauthorized();

  const { id } = await context.params;

  try {
    const body = await request.json();
    const status = body.status as MessageStatus;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
    }

    const updated = await updateMessageStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: updated });
  } catch {
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const adminKey = request.headers.get("x-admin-key");
  if (!isValidAdminKey(adminKey)) return unauthorized();

  const { id } = await context.params;
  const deleted = await deleteMessage(id);

  if (!deleted) {
    return NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
