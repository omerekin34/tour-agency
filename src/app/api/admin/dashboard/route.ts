import { NextResponse } from "next/server";
import { getApplications } from "@/lib/applications";
import { isValidAdminKey } from "@/lib/admin-auth";
import { getMessages } from "@/lib/messages";
import { getApplicationStats } from "@/lib/applications-shared";
import { getMessageStats } from "@/lib/messages-shared";
import { getManagedTours } from "@/lib/tours-store";
import { ensureRegionsLoaded, getPublishedRegions } from "@/lib/regions-store";

export async function GET(request: Request) {
  const adminKey =
    request.headers.get("x-admin-key") ??
    new URL(request.url).searchParams.get("key");

  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  await ensureRegionsLoaded();

  const [applications, messages, tours] = await Promise.all([
    getApplications(),
    getMessages(),
    getManagedTours(),
  ]);
  const regions = getPublishedRegions();

  const appStats = getApplicationStats(applications);
  const msgStats = getMessageStats(messages);
  const publishedTours = tours.filter((tour) => tour.published).length;
  const draftTours = tours.length - publishedTours;

  const recentApplications = [...applications]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const recentMessages = [...messages]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return NextResponse.json({
    applications: appStats,
    messages: msgStats,
    tours: {
      total: tours.length,
      published: publishedTours,
      draft: draftTours,
    },
    regions: regions.length,
    recentApplications,
    recentMessages,
  });
}
