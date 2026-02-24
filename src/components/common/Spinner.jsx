import React from "react";

const Spinner = ({ size = 48, color = "#4F46E5", className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="animate-spin"
      style={{ color }}
      aria-label="Loading spinner"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        opacity="0.22"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        d="M45 25c0-11.046-8.954-20-20-20"
      />
    </svg>
  </div>
);

export default Spinner;
