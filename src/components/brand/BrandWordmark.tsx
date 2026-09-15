import { BRAND_LINE_1, BRAND_LINE_2 } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  line1ClassName?: string;
  line2ClassName?: string;
};

export default function BrandWordmark({
  className,
  line1ClassName,
  line2ClassName,
}: BrandWordmarkProps) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className={line1ClassName}>{BRAND_LINE_1}</span>
      <span className={line2ClassName}>{BRAND_LINE_2}</span>
    </span>
  );
}
