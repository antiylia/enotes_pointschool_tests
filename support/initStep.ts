import { Browser, Page } from "@playwright/test";
import { ApiHelper } from "./apiHelper";

export class InitStep {
  private readonly browser: Browser;
  public readonly apiHelper = new ApiHelper();

  constructor(public readonly browserNew: Browser) {
    this.browser = browserNew;
  }

  public async initApiHelper() {
    await this.apiHelper.init();
    await this.apiHelper.receiveAuthCookies();
  }

  public async login(): Promise<Page> {
    const browserContext = await this.browser.newContext();
    await browserContext.addCookies((await this.apiHelper.apiContext.storageState()).cookies);

    const page = await browserContext.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    return page;
  }
}
