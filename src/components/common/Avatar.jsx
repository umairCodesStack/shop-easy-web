import { useState } from "react";

function Avatar({ src, alt, size = "md", fallbackIcon = "👤" }) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-lg",
    lg: "w-10 h-10 text-xl",
    xl: "w-12 h-12 text-2xl",
  };

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-sm`}
    >
      <span>{fallbackIcon}</span>
    </div>
  );
}

export default Avatar;
