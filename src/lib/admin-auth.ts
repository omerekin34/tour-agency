export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "onda2027";
}

export function isValidAdminKey(key: string | null | undefined): boolean {
  if (!key) return false;
  return key === getAdminPassword();
}
