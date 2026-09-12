import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  return (
    <Link href="/" className={cn("group inline-flex shrink-0 items-center py-2", className)}>
      <span className="inline-flex rounded-lg bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-black/5 transition-shadow group-hover:shadow-md">
        <Image
          src="/images/logo.png"
          alt="ON'da 10 Turizm ve Seyahat Acentası"
          width={220}
          height={40}
          priority={priority}
          className={cn("h-8 w-auto sm:h-9 md:h-10", imageClassName)}
        />
      </span>
    </Link>
  );
}
