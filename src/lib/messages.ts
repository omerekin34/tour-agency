import { promises as fs } from "fs";
import path from "path";
import type { ContactMessage, MessageStatus } from "@/lib/messages-shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export type { ContactMessage, MessageStatus, MessageStats } from "@/lib/messages-shared";
export { MESSAGE_STATUS_LABELS, getMessageStats } from "@/lib/messages-shared";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

type MessageRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
};

function rowToMessage(row: MessageRow): ContactMessage {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
  };
}

function messageToRow(message: ContactMessage): MessageRow {
  return {
    id: message.id,
    created_at: message.createdAt,
    name: message.name,
    email: message.email,
    phone: message.phone,
    subject: message.subject,
    message: message.message,
    status: message.status,
  };
}

async function ensureJsonStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function getMessagesFromJson(): Promise<ContactMessage[]> {
  await ensureJsonStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const list = JSON.parse(raw) as ContactMessage[];
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

async function writeMessagesJson(list: ContactMessage[]) {
  await ensureJsonStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

async function getMessagesFromSupabase(): Promise<ContactMessage[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as MessageRow[]).map(rowToMessage);
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured()) {
    return getMessagesFromSupabase();
  }
  return getMessagesFromJson();
}

export async function saveMessage(
  data: Omit<ContactMessage, "id" | "createdAt" | "status">,
): Promise<ContactMessage> {
  const entry: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "yeni",
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("contact_messages").insert(messageToRow(entry));

    if (error) throw error;
    return entry;
  }

  const list = await getMessagesFromJson();
  list.unshift(entry);
  await writeMessagesJson(list);
  return entry;
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<ContactMessage | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? rowToMessage(data as MessageRow) : null;
  }

  const list = await getMessagesFromJson();
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], status };
  await writeMessagesJson(list);
  return list[index];
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error, count } = await supabase
      .from("contact_messages")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    return (count ?? 0) > 0;
  }

  const list = await getMessagesFromJson();
  const next = list.filter((item) => item.id !== id);
  if (next.length === list.length) return false;
  await writeMessagesJson(next);
  return true;
}
