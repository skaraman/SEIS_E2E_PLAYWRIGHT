import { Page, expect } from "@playwright/test";
import { clickElement, openWindow, enterTextField } from "../../helpers/actions";


export const locators = {
	AMENDMENT_DATE: "//input[@id='AmendmentDate']",
	OTHER_FIELD: "[id='OtherPurpose']"




}
	export const fillOutForm = async (page: Page): Promise<void> => {
		await clickElement(page, locators.AMENDMENT_DATE)
		await clickElement(page, page.locator(".today.day"))
		await page.getByRole('radio', { name: 'Other' }).check();
		await enterTextField(page, locators.OTHER_FIELD, "For Automated Testing")
		await page.getByRole('button', { name: 'Affirm' }).click();
		await page.getByRole('button', { name: 'Yes' }).click();
		await page.waitForNavigation()
		await page.getByLabel('Yes').check();
		await page.locator("[type='submit']").click();
		await page.locator("[type='submit']").click();
		await page.locator('input[type="checkbox"]').nth(7).check();
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.getByRole('button', { name: 'Affirm' }).click();
		await page.getByRole('heading', { name: 'Affirm Completed' }).isVisible();
		await page.getByRole('button', { name: 'OK' }).click();




	
	}

	export const deleteUnaffirmedAmendment = async (page: Page): Promise<void> => {
		await page.locator("[title='Delete']").click()
		await page.getByRole('button', { name: 'OK' }).click();
		//[title='Edit']

	}
