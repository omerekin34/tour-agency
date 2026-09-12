export type MessageStatus = "yeni" | "okundu" | "yanitlandi";

export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
};

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  yeni: "Yeni",
  okundu: "Okundu",
  yanitlandi: "Yanıtlandı",
};

export type MessageStats = {
  total: number;
  yeni: number;
  okundu: number;
  yanitlandi: number;
};

export function getMessageStats(messages: ContactMessage[]): MessageStats {
  return messages.reduce<MessageStats>(
    (stats, item) => {
      stats.total += 1;
      stats[item.status] += 1;
      return stats;
    },
    { total: 0, yeni: 0, okundu: 0, yanitlandi: 0 },
  );
}
