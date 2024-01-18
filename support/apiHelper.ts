import { APIRequestContext, request } from "@playwright/test";
import { IProduct } from "./types";
import { baseURL } from "../playwright.config";

export class ApiHelper {
  public apiContext: APIRequestContext;
  private csrfToken: string;

  private async getCsrfToken(): Promise<string> {
    const loginHtml = await this.apiContext.get("/");
    const text = await loginHtml.text();
    return text.match(/<meta name="csrf-token" content="(.*)">/)![1];
  }

  public async init(): Promise<void> {
    this.apiContext = await request.newContext({ baseURL });
  }

  public async receiveAuthCookies(): Promise<void> {
    await this.apiContext.post("/login", {
      form: {
        _csrf: await this.getCsrfToken(),
        "LoginForm[username]": process.env.USERNAME!,
        "LoginForm[password]": process.env.PASSWORD!,
      },
    });
    this.csrfToken = await this.getCsrfToken();
  }

  public async clearBasket(): Promise<void> {
    await this.apiContext.post("/basket/clear", {
      headers: { "X-Csrf-Token": this.csrfToken },
    });
  }

  public async addProductToBasket(
    product: IProduct,
    count: number
  ): Promise<void> {
    const data = await this.apiContext.post("/basket/create", {
      form: {
        product: product.id,
        count,
      },
      headers: { "X-Csrf-Token": this.csrfToken },
    });
  }

  public async receiveProducts(): Promise<IProduct[]> {
    const response = await this.apiContext.post("/product/get", {
      headers: { "X-Csrf-Token": this.csrfToken },
    });

    return (await response.json()).products;
  }
}
