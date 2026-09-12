"use client";

export function AdminSuccessBanner({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p
      role="status"
      className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
    >
      {message}
    </p>
  );
}

export function AdminErrorBanner({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </p>
  );
}
