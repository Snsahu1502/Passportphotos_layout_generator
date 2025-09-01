import React from "react";

const ActionButton = ({ onClick, variant, icon, children }) => {
  const variants = {
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    purple: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
  };

  const icons = {
    print: (
      <path
        fillRule="evenodd"
        d="M5 4V2a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h2zm0 10v4a2 2 0 002 2h6a2 2 0 002-2v-4H5z"
        clipRule="evenodd"
      />
    ),
    download: (
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    )
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center justify-center text-sm sm:text-base`}
    >
      <svg
        className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2 -mt-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {icons[icon]}
      </svg>
      {children}
    </button>
  );
};

export default ActionButton;
