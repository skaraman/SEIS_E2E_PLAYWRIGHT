import { Page } from "@playwright/test"
import { clickElement } from "../../helpers/actions"
import { verifyFileDownload } from "../../helpers/verify"

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
  await clickElement(page, page.locator('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' }))
}

export const printAllFormsCurrentIep = async (page: Page): Promise<void> => {
  await page.locator('#checkAllFirst').first().check()
  await clickElement(page, locators.PRINT_SELECTED)
  await page.getByLabel('NReco').check()
  await clickElement(page, '.modal-content button.btn-primary')
  //await page.waitForTimeout(100000) // Waiting for the file to be generated and download to start
  await verifyFileDownload(page)
}
