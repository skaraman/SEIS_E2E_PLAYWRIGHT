import { Page } from "@playwright/test"
import { clickElement } from "../../helpers/actions"
import { verifyFileDownload } from "../../helpers/verify"

export const locators = {
	TABLE: ".table",
	UPDATE_BTN: "[data-action='ready']",
	PRINT_BTN: "[title='View/Print Form']"
}

export const clickYes = async (page: Page): Promise<void> => {
	await clickElement(page, page.getByRole('button', { name: 'Yes' }))
}

export const affirmProgress = async (page: Page): Promise<void> => {
	await clickElement(page, page.getByRole('button', { name: 'Goals Menu' }))
	await clickElement(page, page.locator('a:has-text("Affirm Progress Report")'))
	await clickElement(page, page.getByRole('button', { name: 'OK' }))
	await clickElement(page, page.getByRole('button', { name: 'Return to Student IEPs' }))
}

export const printProgress = async (page: Page): Promise<void> => {
	await clickElement(page, page.getByRole('button', { name: 'Goals Menu' }))
	await clickElement(page, page.locator('a:has-text("Print Progress Report")'))
	await clickElement(page, locators.PRINT_BTN)
	await page.getByLabel('NReco').check()
	await clickElement(page, '.modal-content button.btn-primary')
	await verifyFileDownload(page)
}