import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Se define que la raíz del proyecto de Turbopack es el propio frontend
  turbopack: {
    root: __dirname,
  },
  output: "standalone",
};

export default nextConfig;
