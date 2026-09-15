import { NextResponse } from "next/server";
import {
  getApplications,
  isValidAdminKey,
  saveApplication,
} from "@/lib/applications";
import { getTourById } from "@/lib/data";
import { validateTourApplicationCapacity } from "@/lib/tour-capacity";
import { ensureToursLoaded } from "@/lib/tours-store";
import {
  buildApplicationNotificationHtml,
  sendAdminNotification,
} from "@/lib/notify-email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = ["tourId", "tourTitle", "tourDate", "tourPrice", "name", "phone", "email"] as const;
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `${field} alanı zorunludur.` },
          { status: 400 },
        );
      }
    }

    await ensureToursLoaded();
    const tourId = String(body.tourId);
    const tour = getTourById(tourId);
    if (!tour) {
      return NextResponse.json({ error: "Tur bulunamadı." }, { status: 404 });
    }

    const capacityCheck = await validateTourApplicationCapacity(
      tourId,
      tour.capacity,
      String(body.travelers ?? "1"),
    );
    if (!capacityCheck.ok) {
      return NextResponse.json({ error: capacityCheck.message }, { status: 409 });
    }

    const payload = {
      tourId,
      tourTitle: String(body.tourTitle),
      tourDate: String(body.tourDate),
      tourPrice: String(body.tourPrice),
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: String(body.email).trim(),
      travelers: String(body.travelers ?? "1"),
      roomType: String(body.roomType ?? "cift"),
      notes: String(body.notes ?? "").trim(),
    };

    const application = await saveApplication(payload);

    void sendAdminNotification({
      subject: `Yeni tur başvurusu: ${payload.name}`,
      html: buildApplicationNotificationHtml({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        tourTitle: payload.tourTitle,
        tourDate: payload.tourDate,
        travelers: payload.travelers,
      }),
    });

    return NextResponse.json({ ok: true, id: application.id });
  } catch {
    return NextResponse.json(
      { error: "Başvuru kaydedilemedi." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const adminKey =
    request.headers.get("x-admin-key") ??
    new URL(request.url).searchParams.get("key");

  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const applications = await getApplications();
  return NextResponse.json({ applications });
}
