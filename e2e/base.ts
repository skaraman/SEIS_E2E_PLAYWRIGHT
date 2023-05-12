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
    await use(testInfo.project.use.config);
  },
});

export { expect } from "@playwright/test";
