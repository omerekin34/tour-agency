"use client";

import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  adminButtonClassName,
  adminButtonVariant,
  type AdminButtonIntent,
  type AdminButtonSize,
} from "@/components/admin/admin-button-styles";

type AdminActionButtonProps = Omit<React.ComponentProps<typeof Button>, "className"> & {
  loading?: boolean;
  icon?: LucideIcon;
  intent?: AdminButtonIntent;
  adminSize?: AdminButtonSize;
  className?: string;
};

export default function AdminActionButton({
  loading = false,
  icon: Icon,
  intent = "secondary",
  adminSize = "default",
  disabled,
  className,
  variant,
  children,
  ...props
}: AdminActionButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      variant={variant ?? adminButtonVariant(intent)}
      className={adminButtonClassName(intent, adminSize, className)}
      {...props}
    >
      {loading ? (
        Icon ? (
          <Icon className="size-4 animate-spin" aria-hidden />
        ) : (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        )
      ) : Icon ? (
        <Icon className="size-4" aria-hidden />
      ) : null}
      {children}
    </Button>
  );
}

type AdminIconButtonProps = React.ComponentProps<"button"> & {
  loading?: boolean;
  icon: LucideIcon;
  intent?: Extract<AdminButtonIntent, "icon" | "icon-danger">;
  label: string;
};

export function AdminIconButton({
  loading = false,
  icon: Icon,
  intent = "icon",
  disabled,
  className,
  label,
  ...props
}: AdminIconButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-label={label}
      title={label}
      className={adminButtonClassName(intent, "default", className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Icon className="size-4" aria-hidden />
      )}
    </button>
  );
}
