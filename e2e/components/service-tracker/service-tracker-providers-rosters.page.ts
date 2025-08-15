import { Page, expect } from "@playwright/test";
import { verify, actions } from "../../helpers";
import { clickElement } from "../../helpers/actions";

export const locators = {
  LAST_NAME_LBL: "#lastName",
  FIST_NAME_LBL: "#firstName",
  DATE_RANGE_FROM: "#startDate",
  DATE_RANGE_TO: "#endDate",
  SHOW_ALL_BTN: "text=Show All",
  FIND_BTN: "text=find",
  PRINT_BTN: "text=Print",
  PRINT_OPTIONS_PRINT: "text=print",
};

export const selectDates = async (page: Page): Promise<void> => {
  //await page.waitForLoadState('domcontentloaded')
  await clickElement(page, page.locator("input#startDate"));
  await clickElement(page, page.locator('.old.day').nth(0))
  await clickElement(page, page.locator("input#endDate"))
  await clickElement(page, page.locator('.day').nth(1))
  await clickElement(page, page.getByRole("button", { name: "Print" }))
  await clickElement(page, page
    .locator(
      'div[role="dialog"]:has-text("Print Options Print forms in English Spanish Orientation Portrait Landscape Auto")'
    )
    .getByRole("button", { name: "Print" }))

};

export const clickToastMsg = async (page: Page) => {
  var toastLocator = 'text="Print Service Tracker Roster can be viewed in Print Queue."'
  await page.locator(toastLocator).waitFor({ state: 'visible' });
  await page.locator(toastLocator).click()
};
