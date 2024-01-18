import { test as base } from "@playwright/test";
import { InitStep } from "./initStep";

type MyFixtures = {
  initStep: InitStep;
};

export const test = base.extend<MyFixtures>({
  initStep: async ({ browser }, use) => {
    const initStep = new InitStep(browser);
    await initStep.initApiHelper();

    use(initStep);
  },
});

export { expect } from "@playwright/test";
