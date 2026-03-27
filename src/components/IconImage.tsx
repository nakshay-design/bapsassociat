import { useState } from "react";

type Props = {
  src?: string;
  alt?: string;
};

export default function IconImage({ src, alt = "icon" }: Props) {
  const [error, setError] = useState(false);

  const isValid = src && src.trim() !== "";

  if (!isValid || error) {
    return (
      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-20 h-20 object-contain"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}