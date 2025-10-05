import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 120000, // 2 minutes for LLM generation
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    navigationTimeout: 60000, // 60 seconds for navigation/form submission
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
