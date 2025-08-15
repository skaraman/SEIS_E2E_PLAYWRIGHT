import { Page, expect } from "@playwright/test";
import { clickElement, openWindow } from "../../helpers/actions";


export const locators = {
  QUICK_LINKS: "button:has-text('Quick Links')",
  TABLE: ".table",
  COMMENTS: "text=comments",
  AMENDMENTS: "text=Amendments",
  ADD_AMENDMENT: "text=Add Amendment",
  ADD_COMMENT: "text=Add Comment",
  TEXT_AREA: "textArea",
  SAVE_BTN: "#saveBtn",
  RETURN_TO_STUDENT_IEPS_BTN: "('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' })",
  CHECK_ALL: "#checkAllFirst",
  PREVIEW_FORM: "[title='Preview Form']",
  PRINT_SELECTED: "[data-action='future']"

}

export const clickReturnToIeps = async (page: Page): Promise<void> => {
  await page.locator('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' }).click();
}

export const printAllFormsCurrentIep = async (page: Page): Promise<Page> => {
  await clickElement(page, locators.CHECK_ALL)
  await clickElement(page, locators.PRINT_SELECTED)
  await page.locator('[ng-click="vm.ok()"]').click();
  await page.getByText('Processing print request in Print Queue.').isVisible()
  const printWindow = await openWindow(page, async () => {
    await page.locator('.toast-title').waitFor({ state: 'visible' })
    await page.locator('.toast-title').click()
  })
  return printWindow
}
