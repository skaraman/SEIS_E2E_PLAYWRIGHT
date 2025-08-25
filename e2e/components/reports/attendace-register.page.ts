import { Page } from "@playwright/test";
import { clickElement } from "../../helpers/actions";
import { verifyFileDownload } from "../../helpers/verify";

export const locators = {
	HEADER_TITLE: 'text=Generate Attendance Register',
}

export const generateAttendanceRegister = async (page: Page) => {
	await clickElement(page, '.input-group-addon')
	await clickElement(page, '.old.day')
	await clickElement(page, '#endDate > .input-group > .input-group-addon')
	await clickElement(page, '.day')
	await page.getByRole('link', { name: 'Last Name' }).click();
	await page.getByRole('option', { name: 'First Name' }).click();
	await page.getByRole('button', { name: 'Print' }).click();
	await page.getByLabel('Automatically Number Pages, ex: Page 1 of 14').check();
	await page.getByLabel(/Remove\s+"Page\s+___\s+of\s+___"\s+Text/).check();
	await page.locator('div[role="dialog"]:has-text("Print Options Print forms in English Spanish Orientation Portrait Landscape Auto")').getByRole('button', { name: 'Print' }).click();
	await page.getByText('Processing print request in Print Queue.').isVisible();
	// await clickElement(page, '.toast-container .toast-title', 0, 'locator', 120000)
	await verifyFileDownload(page)
	
}
