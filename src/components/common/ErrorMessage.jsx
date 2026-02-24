import React from "react";

const ErrorMessage = ({
  title = "Something went wrong",
  message = "An unexpected error has occurred.",
  detail,
  action,
  className = "",
}) => (
  <div
    className={`max-w-lg mx-auto flex flex-col items-center bg-white border border-red-200 rounded-2xl p-6 shadow-lg ${className}`}
  >
    <div className="mb-2">
      <svg
        className="text-red-500 w-12 h-12"
        fill="none"
        viewBox="0 0 48 48"
        stroke="currentColor"
      >
        <circle cx="24" cy="24" r="22" strokeWidth="4" opacity="0.18" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          d="M24 17v9M24 33h.01"
        />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-red-600 mb-1">{title}</h2>
    {message && <p className="text-gray-700 mb-2 text-center">{message}</p>}
    {detail && (
      <pre className="text-xs text-gray-400 max-w-full overflow-auto bg-gray-50 rounded p-2 mt-1">
        {detail}
      </pre>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default ErrorMessage;
