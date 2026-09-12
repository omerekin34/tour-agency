import { NextResponse } from "next/server";
import { ensureToursLoaded } from "@/lib/tours-store";
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
