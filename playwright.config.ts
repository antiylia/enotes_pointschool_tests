import { defineConfig, devices } from '@playwright/test';

require('dotenv').config({path: './.env'});

export const baseURL = 'https://enotes.pointschool.ru';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  // parallel execution is not supported - tests is executed within one test account, 
  // in parallel they will affect each other when performing Basket clear operation
  workers: 1,
  reporter: [['html'], ['allure-playwright']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        headless: false,
        ...devices['Desktop Chrome'] 
      },
    },
  ],
});
