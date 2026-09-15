import { cn } from "@/lib/utils";
import { adminSubCardClass } from "@/components/admin/admin-theme";

export default function AdminStatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className={cn(adminSubCardClass, "shadow-md shadow-black/10")}>
      <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold text-white", accent)}>
        {value}
      </p>
    </div>
  );
}
