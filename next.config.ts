import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

// Base Next.js configuration
const nextConfig: NextConfig = {
  images: {
    domains: ["prod-files-secure.s3.us-west-2.amazonaws.com"],
  },
};

// Export the configuration enhanced with the withNextVideo function
export default withNextVideo(nextConfig);
