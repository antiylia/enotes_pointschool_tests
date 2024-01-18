import { test, expect } from "../support/fixtures.ts";
import { BasketModal } from "../support/pages/basketModal.ts";
import { MainPage } from "../support/pages/mainPage.ts";
import { ITestProduct } from "../support/types.ts";
import { prepareBasketItem, priceSum } from "./utils.ts";

test(`Navigate to basket with 9 different items`, async ({ initStep, baseURL }) => {
  let basketModal: BasketModal;

  const products = await initStep.apiHelper.receiveProducts();
  const productsToAdd = products.slice(1, 8);
  const existedPrdct = products[0];
  const testData: ITestProduct[] = [
    { ...existedPrdct, count: 2 },
    ...productsToAdd.map((prdct) => ({ ...prdct, count: 1 })),
  ];

  await initStep.apiHelper.clearBasket();
  await initStep.apiHelper.addProductToBasket(existedPrdct, 1);

  const page = await initStep.login();
  const mainPage = new MainPage(page);

  await test.step(`Add 8 different items to basket, check basket count is 9`, async () => {
    for (const productToAdd of [existedPrdct, ...productsToAdd]) {
      const nonDiscountItem = await mainPage.getNoteItem(productToAdd);
      await nonDiscountItem.buyBtn.click({ timeout: 10000 });
    }

    await expect(mainPage.basketItemsCount).toHaveText("9");
  });

  await test.step('Click on "Basket" icon, check basket modal is visible', async () => {
    basketModal = await mainPage.openBasketModal();
    await expect(basketModal.root).toBeVisible();
  });

  await test.step("Opened basket modal, check added 9 items details", async () => {
    expect(await basketModal.basketItems.allInnerTexts()).toEqual(testData.map(prepareBasketItem));
  });

  await test.step("Opened basket modal, check total price for 9 items", async () => {
    await expect(basketModal.totalPrice).toHaveText(`Итого к оплате: ${priceSum(testData)}`);
  });

  await test.step('Click on "Go to basket" icon, check user redirected to Basket page', async () => {
    await basketModal.goToBasketBtn.click();
    await expect(page).toHaveURL(`${baseURL}/basket`);
  });
});
