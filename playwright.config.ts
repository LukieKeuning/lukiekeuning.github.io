import { defineConfig, devices } from "@playwright/test";
const basePath = process.env.SITE_BASE_PATH || "";
const port = process.env.PORT || "3100";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}/`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: `http://127.0.0.1:${port}${basePath}/`,
    env: { PORT: port },
    reuseExistingServer: false,
  },
});
