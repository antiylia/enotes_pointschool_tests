import { Locator } from "@playwright/test";

export class NoteItem {
  private readonly root: Locator;
  public readonly countInput: Locator;
  public readonly buyBtn: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.countInput = this.root.locator("input[name='product-enter-count']");
    this.buyBtn = this.root.locator(".actionBuyProduct");
  }
}
