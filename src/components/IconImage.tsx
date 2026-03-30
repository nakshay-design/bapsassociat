import { useState } from "react";
import { Loader2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  size?: number;
  isLoading?: boolean;
};

export default function IconImage({ 
  src, 
  alt = "icon", 
  className, 
  size = 80, 
  isLoading = false 
}: Props) {
  const [error, setError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  if (isLoading) {
    return (
      <div 
        className={cn("flex items-center justify-center bg-muted/10 animate-pulse rounded-full", className)}
        style={{ width: size, height: size }}
      >
        <Loader2 className="w-5 h-5 text-accent animate-spin" />
      </div>
    );
  }

  const isValid = src && src.trim() !== "";

  if (!isValid || error) {
    return (
      <div 
        className={cn("flex items-center justify-center bg-muted/30 rounded-full border border-border/50", className)}
        style={{ width: size, height: size }}
      >
        <div className="flex flex-col items-center gap-1">
          <ImageOff className="text-muted-foreground/40" style={{ width: size / 2.5, height: size / 2.5 }} />
          {size > 60 && <span className="text-[10px] text-muted-foreground/60 font-medium">No Image</span>}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative flex items-center justify-center overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      {imgLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 animate-pulse">
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
        </div>
      )}
      <img
        src={src.trim()}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          "object-contain transition-all duration-500",
          imgLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
        onLoad={() => setImgLoading(false)}
        onError={() => {
          setImgLoading(false);
          setError(true);
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}