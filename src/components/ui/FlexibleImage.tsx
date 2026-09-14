import Image from "next/image";
import { isLocalGalleryMediaUrl } from "@/lib/gallery-shared";
import { cn } from "@/lib/utils";

type FlexibleImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function FlexibleImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: FlexibleImageProps) {
  if (isLocalGalleryMediaUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
    />
  );
}
