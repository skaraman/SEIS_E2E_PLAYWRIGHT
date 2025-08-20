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
  PREVIEW_FORM: "[title='Preview Form']",
  PRINT_SELECTED: "[data-action='future']"

}

export const clickReturnToIeps = async (page: Page): Promise<void> => {
  await page.locator('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' }).click();
}

export const printAllFormsCurrentIep = async (page: Page): Promise<Page> => {
  await page.locator('#checkAllFirst').first().check();
  await clickElement(page, locators.PRINT_SELECTED)
  await clickElement(page, '.modal-content button.btn-primary')
  const printWindow = await openWindow(page, async () => {
    await clickElement(page, '#toast-container .toast-title', 0, 'locator', 120000)
	}, 120000)
  return printWindow
}
