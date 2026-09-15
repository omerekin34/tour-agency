type NotifyPayload = {
  subject: string;
  html: string;
};

export async function sendAdminNotification({ subject, html }: NotifyPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.ADMIN_NOTIFICATION_EMAIL ??
    process.env.NOTIFICATION_EMAIL ??
    process.env.ADMIN_EMAIL;

  if (!apiKey || !to) {
    console.info("[notify-email] Bildirim atlandı (RESEND_API_KEY veya alıcı e-posta yok).");
    return;
  }

  const from =
    process.env.RESEND_FROM ?? "ON'DA 10 Turizm <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[notify-email] Gönderim hatası:", res.status, body);
    }
  } catch (error) {
    console.error("[notify-email] İstek başarısız:", error);
  }
}

export function buildApplicationNotificationHtml(data: {
  name: string;
  phone: string;
  email: string;
  tourTitle: string;
  tourDate: string;
  travelers: string;
}) {
  return `
    <h2>Yeni Tur Başvurusu</h2>
    <p><strong>Tur:</strong> ${escapeHtml(data.tourTitle)}</p>
    <p><strong>Tarih:</strong> ${escapeHtml(data.tourDate)}</p>
    <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Kişi:</strong> ${escapeHtml(data.travelers)}</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tour-agency-chi.vercel.app"}/admin/basvurular">Admin panelde görüntüle</a></p>
  `;
}

export function buildMessageNotificationHtml(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return `
    <h2>Yeni İletişim Mesajı</h2>
    <p><strong>Ad:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(data.phone || "—")}</p>
    <p><strong>Konu:</strong> ${escapeHtml(data.subject)}</p>
    <p><strong>Mesaj:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tour-agency-chi.vercel.app"}/admin/mesajlar">Admin panelde görüntüle</a></p>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
