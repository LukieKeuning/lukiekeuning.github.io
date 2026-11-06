import type { NextConfig } from "next";
import { resolveBasePath } from "./src/lib/paths.ts";

const basePath = resolveBasePath(
  process.env.GITHUB_ACTIONS === "true" ? process.env.GITHUB_REPOSITORY : "",
  process.env.SITE_BASE_PATH,
);
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default config;
