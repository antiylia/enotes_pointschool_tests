import { test, expect } from "../support/fixtures.ts";
import { BasketModal } from "../support/pages/basketModal.ts";
import { MainPage } from "../support/pages/mainPage.ts";
import { ITestProduct } from "../support/types.ts";
import { finalPrice, prepareBasketItem } from "./utils.ts";

const dataForTests = [
  {
    itemType: "non-discount",
    criteriaFn: ({ discount }) => discount === 0,
  },
  {
    itemType: "discount",
    criteriaFn: ({ discount }) => discount !== 0,
  },
];

for (const { itemType, criteriaFn } of dataForTests) {

  test(`Navigate to basket with 1 ${itemType} item`, async ({ initStep, baseURL }) => {
    let basketModal: BasketModal;

    const products = await initStep.apiHelper.receiveProducts();
    const product = products.find(criteriaFn)!;
    const testData: ITestProduct = { ...product, count: 1 };

    await initStep.apiHelper.clearBasket();
    const page = await initStep.login();
    const mainPage = new MainPage(page);

    await test.step(`Add 1 ${itemType} item to basket, check basket count is 1`, async () => {
      const nonDiscountItem = await mainPage.getNoteItem(product);
      await nonDiscountItem.buyBtn.click({ timeout: 10000 }); // unstable click, increased timeout 3000 -> 10000
      await expect(mainPage.basketItemsCount).toHaveText("1");
    });

    await test.step('Click on "Basket" icon, check basket modal is visible', async () => {
      basketModal = await mainPage.openBasketModal();
      await expect(basketModal.root).toBeVisible();
    });

    await test.step("Opened basket modal, check added item details", async () => {
      expect(await basketModal.basketItems.allInnerTexts()).toEqual([prepareBasketItem(testData)]);
    });

    await test.step("Opened basket modal, check total price", async () => {
      await expect(basketModal.totalPrice).toHaveText(`Итого к оплате: ${finalPrice(testData)}`);
    });

    await test.step('Click on "Go to basket" icon, check user redirected to Basket page', async () => {
      await basketModal.goToBasketBtn.click();
      await expect(page).toHaveURL(`${baseURL}/basket`);
    });
  });
}
