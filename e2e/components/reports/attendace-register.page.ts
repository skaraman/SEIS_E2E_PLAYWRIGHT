import { Page } from "@playwright/test";
import { clickElement, openWindow } from "../../helpers/actions";
import { verifyIfPageUrlIsCorrect } from "../../helpers/verify";

export const locators = {
	HEADER_TITLE: 'text=Generate Attendance Register',

}


export const generateAttendanceRegister = async (page: Page) => {
	await page.locator('.input-group-addon').first().click();
	await page.locator('.old.day').nth(0).click();
	await page.locator('#endDate > .input-group > .input-group-addon').click();
	await page.locator('.day').nth(0).click();
	await page.getByRole('link', { name: 'Last Name' }).click();
	await page.getByRole('option', { name: 'First Name' }).click();
	await page.getByRole('button', { name: 'Print' }).click();
	await page.getByLabel('Automatically Number Pages, ex: Page 1 of 14').check();
	await page.getByLabel(/Remove\s+"Page\s+___\s+of\s+___"\s+Text/).check();
	await page.locator('div[role="dialog"]:has-text("Print Options Print forms in English Spanish Orientation Portrait Landscape Auto")').getByRole('button', { name: 'Print' }).click();
	await page.getByText('Processing print request in Print Queue.').isVisible();
	const printWindow = await openWindow(page, async () => {
		await page.locator('.toast-title').click({timeout:70000})
	})
	await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	
}


