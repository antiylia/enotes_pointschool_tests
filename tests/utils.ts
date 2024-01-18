import { ITestProduct } from "../support/types";

export function priceSum(items: ITestProduct[]): number {
  return items.reduce((a, c) => a + finalPrice(c), 0);
}

export function prepareBasketItem(item: ITestProduct): string {
  return `${item.name}\n- ${finalPrice(item)} р.\n${item.count}`;
}

export function finalPrice(item: ITestProduct): number {
  return (item.price - item.discount) * item.count;
}
