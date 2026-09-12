"use server";

import { saveMessage } from "@/lib/messages";

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "Tur Bilgi Talebi").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Ad, e-posta ve mesaj alanları zorunludur." };
  }

  try {
    await saveMessage({ name, email, phone, subject, message });
    return { ok: true };
  } catch {
    return { ok: false, error: "Mesaj kaydedilemedi. Lütfen tekrar deneyin." };
  }
}
