# PRODUCT ISSUES

### 1. When Basket empty, Basket modal is not opened after click on Basket icon(link), (console error: showToast is not defined)

Severity: High

Steps:
- Login
- Clear Basket if there're items within it
- Once Basket empty, try to click on Basket icon(link) to open Basket modal

**AR**: Basket modal is not opened, following frontend related error:
```
(index):430 Uncaught ReferenceError: showToast is not defined
    at HTMLLIElement.<anonymous> ((index):430:25)
    at HTMLLIElement.dispatch (jquery.js:5430:27)
    at elemData.handle (jquery.js:5234:28)
    at Object.trigger (jquery.js:8745:12)
    at HTMLLIElement.<anonymous> (jquery.js:8823:17)
    at Function.each (jquery.js:385:19)
    at jQuery.fn.init.each (jquery.js:207:17)
    at jQuery.fn.init.trigger (jquery.js:8822:15)
    at t.toggle (dropdown.js:141:15)
    at HTMLAnchorElement.<anonymous> (dropdown.js:267:12)
```
**ER**: Basket modal is opened

Notes: there's frontend hardcoded `if`:
```
                $('#basketContainer').on('show.bs.dropdown', function () {
                    let basketCount = parseInt($('.basket-count-items').text());
                    ......

                    if (basketCount === 0) {
                        showToast('#basketEmptyNotification');

                        return false;
                    }
                });
```
and `showToast` fn is not defined for corresponding \<script>\</script> script


### 2. GET `https://enotes.pointschool.ru/basket` returns html document with Server Error (#500) in content (response status code 200 OK)

Severity: Blocker

 Steps:
- Login
- Add couple of product to Basket
- Click on Basket icon(link) to open Basket modal

**AR**: Error page with 
```
Server Error (#500)
  Internal server error
There is a problem with the resource you are looking for, and it cannot be displayed.
```
loaded

**ER**: Basket page should be loaded with actual Basket data


### 3. Opened Basket modal: Total cost calculated incorrectly

Severity: Critical

 Steps:
- Login
- Add several different products to Basket
- Click on Basket icon(link) to open Basket modal
- Review 'Итого к оплате' value

**AC**: 'Итого к оплате' value does not include all products prices, only 1st product in the list

**ER**: 'Итого к оплате' calculated based on all products added to Basket


### 4. Basket modal is not opened, when 9 products in Basket, user redirected directly to Basket page (`https://enotes.pointschool.ru/basket`)

Severity: High

 Steps:
- Login
- Add 9 products to Basket
- Click on Basket icon(link) to open Basket modal

**AC**: User redirected to Basket page (`https://enotes.pointschool.ru/basket`)

**ER**: Basket modal should opened (after using "Перейти в корзину" user can go to Basket page)

Notes: there's frontend hardcoded `if`:

```
                  $('#basketContainer').on('show.bs.dropdown', function () {
                    let basketCount = parseInt($('.basket-count-items').text());

                    if (basketCount === 9) {
                        window.location.href = '/basket';
                        return false;
                    }
                    ....
                });
```


### 5. Not able to add more than 9 same products into Basket (value automatically reset to 9)

Severity: High

 Steps:
- Login
- Add 10 SAME products to Basket (reproduced for both: 1. by single clicks on 'Купить' button; 2. by manually putting 10 and higher to input on the product card)
- Review product amount near Busket link (icon)

**AC**: 'Kорзинa 9' displayed, so added products count automatically reset to 9

**ER**: Products' count should reflect user specified



# Automated tests for https://enotes.pointschool.ru/

Prerequisites:

- Node
- Java (for Allure)

### How to run

Before start, please add `.env` file with test account credentials:
```
USERNAME='****'
PASSWORD='****'
```

After following commands:

`npm install`

`npx playwright test` - to run all tests

`npx playwright test -g 'Navigate to basket with 1 discount item'` - to run specific test by title

`npm run allure:report` - to serve Allure report


### Parallel execution

Currently, parallel execution is not supported - tests are executed with one test account, in parallel mode they will affect each other when performing Basket clear operation

### Tests results

#### 1. Navigate to empty basket
  - Click on "Basket" icon, check basket modal is visible  - failed due [BUG: When Basket empty, Basket modal is not opened](https://github.com/antiylia/enotes_pointschool_tests/tree/antiylia/enotes_pointschool_tests?tab=readme-ov-file#1-basket-modal-is-not-displayed-on-basket-iconlink-click-console-error-showtoast-is-not-defined)
  - Click on "Go to basket" icon, check user redirected to Basket page
  - Basket page loaded, check no error page displayed - failed due [BUG: '/basket' returns html document with Server Error (#500) in content](https://github.com/antiylia/enotes_pointschool_tests/tree/antiylia/enotes_pointschool_tests?tab=readme-ov-file#2-get-httpsenotespointschoolrubasket-returns-html-document-with-server-error-500-in-content-response-status-code-200-ok)

#### 2.1 Navigate to basket with 1 non-discount item - PASSED

#### 2.2 Navigate to basket with 1 discount item - PASSED

#### 3. Navigate to basket with 9 different items
  - Add 8 different items to basket, check basket count is 9
  - Click on "Basket" icon, check basket modal is visible - failed due [BUG: Basket modal is not opened, when 9 products in Basket](https://github.com/antiylia/enotes_pointschool_tests/tree/antiylia/enotes_pointschool_tests?tab=readme-ov-file#4-basket-modal-is-not-opened-when-9-products-in-basket-user-redirected-directly-to-basket-page-httpsenotespointschoolrubasket)
  - Opened basket modal, check added 9 items details
  - Opened basket modal, check total price for 9 items - failed due [BUG: Total cost calculated incorrectly](https://github.com/antiylia/enotes_pointschool_tests/tree/antiylia/enotes_pointschool_tests?tab=readme-ov-file#3-opened-basket-modal-total-cost-calculated-incorrectly)
  - Click on "Go to basket" icon, check user redirected to Basket page

#### 4. Navigate to basket with 9 discount same items
  - Add 9 discount same items to basket, check basket count is 9
  - Click on "Basket" icon, check basket modal is visible - failed due [BUG: Basket modal is not opened, when 9 products in Basket](https://github.com/antiylia/enotes_pointschool_tests/tree/antiylia/enotes_pointschool_tests?tab=readme-ov-file#4-basket-modal-is-not-opened-when-9-products-in-basket-user-redirected-directly-to-basket-page-httpsenotespointschoolrubasket)
  - Opened basket modal, check added 9 items details
  - Opened basket modal, check total price for 9 items
  - Click on "Go to basket" icon, check user redirected to Basket page

