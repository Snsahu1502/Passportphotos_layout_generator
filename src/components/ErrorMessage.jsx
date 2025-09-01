import React from "react";

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 text-sm sm:text-base"
      role="alert"
    >
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default ErrorMessage;
