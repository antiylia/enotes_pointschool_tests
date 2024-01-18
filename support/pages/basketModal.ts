import { Locator } from "@playwright/test";

export class BasketModal {
  public readonly root: Locator;
  public readonly goToBasketBtn: Locator;
  public readonly basketItems: Locator;
  public readonly totalPrice: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.goToBasketBtn = this.root.getByText("Перейти в корзину");
    this.basketItems = this.root.locator(".basket-item");
    this.totalPrice = this.root.locator(
      "xpath=//*[contains(@class, 'basket_price')]/parent::div"
    );
  }
}
