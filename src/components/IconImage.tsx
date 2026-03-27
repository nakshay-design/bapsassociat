"use client";

import { useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  size?: number;
  priority?: boolean;
  isLoading?: boolean;
};

/**
 * A robust component to display icons from WordPress ACF fields.
 * Handles loading, error, and empty states gracefully.
 */
export default function IconImage({ 
  src, 
  alt = "icon", 
  className, 
  size = 80,
  priority = false,
  isLoading = false
}: Props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. If we are currently fetching data from the API
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

  // 2. If we have data, but it's an empty string or explicitly null
  const hasNoSource = !src || src.trim() === "";

  if (hasNoSource || error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted/30 rounded-full border border-border/50 transition-all duration-300",
          className
        )}
        style={{ width: size, height: size }}
      >
        <div className="flex flex-col items-center gap-1">
          <ImageOff className="text-muted-foreground/40" style={{ width: size / 2.5, height: size / 2.5 }} />
          {size > 60 && <span className="text-[10px] text-muted-foreground/60 font-medium">No Image</span>}
        </div>
      </div>
    );
  }

  // 3. Render the actual image
  return (
    <div 
      className={cn("relative flex items-center justify-center overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 animate-pulse">
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          "object-contain transition-all duration-500",
          loading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-ignore
        fetchpriority={priority ? "high" : "low"}
      />
    </div>
  );
}