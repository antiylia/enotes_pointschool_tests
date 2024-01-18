import { test, expect } from "../support/fixtures.ts";
import { BasketModal } from "../support/pages/basketModal.ts";
import { MainPage } from "../support/pages/mainPage.ts";
import { ITestProduct } from "../support/types.ts";
import { finalPrice, prepareBasketItem } from "./utils.ts";

test(`Navigate to basket with 9 discount same items`, async ({ initStep, baseURL }) => {
  let basketModal: BasketModal;

  const products = await initStep.apiHelper.receiveProducts();
  const discountProduct = products.find(({ discount }) => discount !== 0)!;
  const testData: ITestProduct = { ...discountProduct, count: 9 };
  await initStep.apiHelper.clearBasket();

  const page = await initStep.login();
  const mainPage = new MainPage(page);
  
  await test.step(`Add 9 discount same items to basket, check basket count is 9`, async () => {
    const nonDiscountItem = await mainPage.getNoteItem(discountProduct);
    await nonDiscountItem.countInput.fill("9");
    await nonDiscountItem.buyBtn.click();
    await expect(mainPage.basketItemsCount).toHaveText("9");
  });

  await test.step('Click on "Basket" icon, check basket modal is visible', async () => {
    basketModal = await mainPage.openBasketModal();
    await expect(basketModal.root).toBeVisible();
  });

  await test.step("Opened basket modal, check added 9 items details", async () => {
    expect(await basketModal.basketItems.allInnerTexts()).toEqual([prepareBasketItem(testData)]);
  });

  await test.step("Opened basket modal, check total price for 9 items", async () => {
    await expect(basketModal.totalPrice).toHaveText(`Итого к оплате: ${finalPrice(testData)}`);
  });

  await test.step('Click on "Go to basket" icon, check user redirected to Basket page', async () => {
    await basketModal.goToBasketBtn.click();
    await expect(page).toHaveURL(`${baseURL}/basket`);
  });
});
