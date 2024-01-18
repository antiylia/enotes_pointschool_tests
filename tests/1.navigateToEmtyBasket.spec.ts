import { test, expect } from "../support/fixtures.ts";
import { MainPage } from "../support/pages/mainPage.ts";

test("Navigate to empty basket", async ({ initStep, baseURL }) => {
  await initStep.apiHelper.clearBasket();
  const page = await initStep.login();
  
  const mainPage = new MainPage(page);
  const basketModal = await mainPage.openBasketModal();

  await test.step('Click on "Basket" icon, check basket modal is visible', async () => {
    await expect(basketModal.root).toBeVisible();
  });

  await test.step('Click on "Go to basket" icon, check user redirected to Basket page', async () => {
    await basketModal.goToBasketBtn.click();
    await expect(page).toHaveURL(`${baseURL}/basket`);
  });

  await test.step('Basket page loaded, check no error page displayed', async () => {
    await expect(page.locator('h1')).not.toHaveText('Server Error (#500)');
  });
});
