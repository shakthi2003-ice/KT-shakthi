"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HamsterLoader from "./loader";

const RouteLoader: React.FC = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Show loader when route changes
  useEffect(() => {
    setLoading(true);

    // give time for new page to mount before removing loader
    const timeout = setTimeout(() => setLoading(false), 800);

    return () => clearTimeout(timeout);
  }, [pathname]); // triggers whenever the URL path changes

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50"
        >
          <HamsterLoader />
          <p className="mt-4 text-mainBlue font-semibold text-xl">Loading...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteLoader;
