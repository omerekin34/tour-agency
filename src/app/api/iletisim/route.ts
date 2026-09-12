import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/applications";
import { getMessages, saveMessage } from "@/lib/messages";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = ["name", "email", "message"] as const;
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `${field} alanı zorunludur.` },
          { status: 400 },
        );
      }
    }

    const message = await saveMessage({
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone ?? "").trim(),
      subject: String(body.subject ?? "Tur Bilgi Talebi").trim(),
      message: String(body.message).trim(),
    });

    return NextResponse.json({ ok: true, id: message.id });
  } catch (err) {
    console.error("[POST /api/iletisim]", err);
    const detail =
      err instanceof Error ? err.message : "Mesaj kaydedilemedi.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const adminKey =
    request.headers.get("x-admin-key") ??
    new URL(request.url).searchParams.get("key");

  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const messages = await getMessages();
  return NextResponse.json({ messages });
}
