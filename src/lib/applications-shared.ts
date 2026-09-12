export type ApplicationStatus = "yeni" | "incelendi" | "tamamlandi";

export type TourApplication = {
  id: string;
  createdAt: string;
  tourId: string;
  tourTitle: string;
  tourDate: string;
  tourPrice: string;
  name: string;
  phone: string;
  email: string;
  travelers: string;
  roomType: string;
  notes: string;
  status: ApplicationStatus;
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  yeni: "Yeni",
  incelendi: "İncelendi",
  tamamlandi: "Tamamlandı",
};

export type ApplicationStats = {
  total: number;
  yeni: number;
  incelendi: number;
  tamamlandi: number;
};

export function getApplicationStats(
  applications: TourApplication[],
): ApplicationStats {
  return applications.reduce<ApplicationStats>(
    (stats, app) => {
      stats.total += 1;
      stats[app.status] += 1;
      return stats;
    },
    { total: 0, yeni: 0, incelendi: 0, tamamlandi: 0 },
  );
}

export function formatRoomType(value: string): string {
  if (value === "tek") return "Tek kişilik";
  if (value === "uclu") return "3 kişilik";
  return "Çift kişilik";
}

export function formatWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}
