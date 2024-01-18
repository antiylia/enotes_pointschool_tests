import { Locator, Page } from "@playwright/test";
import { BasketModal } from "./basketModal";
import { NoteItem } from "./noteItem";
import { IProduct } from "../types";

export class MainPage {
  private readonly page: Page;
  public readonly basket: Locator;
  public readonly basketItemsCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basket = this.page.locator("#dropdownBasket");
    this.basketItemsCount = this.page.locator(".basket-count-items");
  }

  public async openBasketModal(): Promise<BasketModal> {
    await this.basket.click();
    return new BasketModal(
      this.page.locator('[aria-labelledby="dropdownBasket"]')
    );
  }

  public async getNoteItem(product: IProduct): Promise<NoteItem> {
    return new NoteItem(this.page.locator(`[data-product='${product.id}']`));
  }
}
