"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string;
  alt?: string;
};

export default function IconImage({ src, alt = "icon" }: Props) {
  const [error, setError] = useState(false);

  // ❌ If no image OR error → fallback UI
  if (!src || error) {
    return (
      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  // ✅ Normal Image
  return (
    <Image
      src={src}
      alt={alt}
      width={80}
      height={80}
      className="object-contain"
      onError={() => setError(true)}
    />
  );
}