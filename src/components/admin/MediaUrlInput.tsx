"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MediaUrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  adminKey: string;
  placeholder?: string;
  accept?: string;
  className?: string;
  inputClassName?: string;
  onUploadError?: (message: string) => void;
};

export default function MediaUrlInput({
  value,
  onChange,
  adminKey,
  placeholder = "https://... veya /uploads/...",
  accept = "image/*,video/*",
  className,
  inputClassName,
  onUploadError,
}: MediaUrlInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !adminKey) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });

      const data = (await res.json()) as { error?: string; url?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Dosya yüklenemedi.");
      }

      onChange(data.url);
    } catch (err) {
      onUploadError?.(
        err instanceof Error ? err.message : "Dosya yüklenemedi.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row", className)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("min-h-11 flex-1", inputClassName)}
      />
      <AdminActionButton
        type="button"
        intent="secondary"
        icon={Upload}
        loading={uploading}
        disabled={!adminKey}
        onClick={() => fileInputRef.current?.click()}
        className="shrink-0 sm:min-w-[140px]"
      >
        {uploading ? "Yükleniyor..." : "Dosya Seç"}
      </AdminActionButton>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />
    </div>
  );
}
