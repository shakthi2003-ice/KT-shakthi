// components/Shimmer.tsx
import React from "react";

const Shimmer: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = "w-full", height = "h-6", className = "" }) => {
  return (
    <div
      className={`bg-gray-300 ${width} ${height} rounded-md relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
    </div>
  );
};

export default Shimmer;
