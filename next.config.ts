import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The charter page used to live at /charter before it became the site root.
    return [{ source: "/charter", destination: "/", permanent: true }];
  },
};

export default nextConfig;
