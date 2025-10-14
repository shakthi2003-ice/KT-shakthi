"use client";

import { useEffect } from "react";
import ErrorLayout from "./_components/ErrorLayout";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return <ErrorLayout error={error} reset={reset} />;
}
