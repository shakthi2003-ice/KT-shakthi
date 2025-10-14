"use client";

import React from "react";
import HamsterLoader from "./loader";

const LoaderOverlay = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <HamsterLoader />
      <p className="mt-4 text-mainBlue font-semibold text-xl">Loading...</p>
    </div>
  );
};

export default LoaderOverlay;
