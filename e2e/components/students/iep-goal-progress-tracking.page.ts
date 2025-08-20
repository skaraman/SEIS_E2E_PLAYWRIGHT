import { Page, expect } from "@playwright/test";
import { clickElement, openWindow } from "../../helpers/actions";


export const locators = {
	TABLE: ".table",
	UPDATE_BTN: "[data-action='ready']",
	PRINT_BTN: "[title='View/Print Form']"
}

export const clickYes = async (page: Page): Promise<void> => {

	await page.getByRole('button', { name: 'Yes' }).click();

}
export const affirmProgress = async (page: Page): Promise<void> => {

	await page.getByRole('button', { name: 'Goals Menu' }).click();
	await page.locator('a:has-text("Affirm Progress Report")').click();
	await page.getByRole('button', { name: 'OK' }).click();
	await page.getByRole('button', { name: 'Return to Student IEPs' }).click();
}

export const printProgress = async (page: Page): Promise<Page> => {
	await page.getByRole('button', { name: 'Goals Menu' }).click();
	await page.locator('a:has-text("Print Progress Report")').click();
	await clickElement(page, locators.PRINT_BTN)
	await page.getByLabel('NReco').check();
	await clickElement(page, '.modal-content button.btn-primary')
	const printWindow = await openWindow(page, async () => {
		await clickElement(page, '#toast-container .toast-title', 0, 'locator', 120000)
	}, 120000)
	return printWindow;
}