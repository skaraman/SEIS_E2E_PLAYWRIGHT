import { test as base } from "@playwright/test";
import Users from "./data/users.json";

export type Options = {
  users: any;
  configs: Configs;
};

export type Configs = {
  baseUrl: string;
  apiBaseUrl: string;
  env: string;
};

export const test = base.extend<Options>({
  users: async ({}, use) => {
    await use(Users);
  },
  configs: async ({}, use, testInfo) => {
    await use(testInfo.project.use.configs);
  },
});
// base.beforeEach(async ({ page }) => {
//   page.on('console', msg => console.log(`[console] ${msg.type()}: ${msg.text()}`));
//   page.on('pageerror', error => console.log(`[pageerror] ${error}`));
//   page.on('requestfailed', request =>
//     console.log(`[requestfailed] ${request.url()} - ${request.failure()?.errorText}`)
//   );
// });
base.afterEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second wait
})
export { expect } from "@playwright/test";
