import { Page } from "@playwright/test";
import { clickElement, enterTextField } from "../../helpers/actions";
import { waitForPageReady } from "../../helpers/layout";

export const locators = {
	AMENDMENT_DATE: "//input[@id='AmendmentDate']",
	OTHER_FIELD: "[id='OtherPurpose']"
}

export const fillOutForm = async (page: Page): Promise<void> => {
	await clickElement(page, locators.AMENDMENT_DATE)
	await clickElement(page, page.locator(".today.day"))
	await page.getByRole('radio', { name: 'Other' }).check();
	await enterTextField(page, locators.OTHER_FIELD, "For Automated Testing")
	await clickElement(page, page.getByRole('button', { name: 'Affirm' }));
	await clickElement(page, page.getByRole('button', { name: 'Yes' }));
	await waitForPageReady(page)
	await page.getByLabel('Yes').check();
	await clickElement(page, page.locator("[type='submit']"));
	await clickElement(page, page.locator("[type='submit']"));
	await page.locator('input[type="checkbox"]').nth(7).check();
	await clickElement(page, page.getByRole('button', { name: 'Submit' }));
	await clickElement(page, page.getByRole('button', { name: 'Affirm' }));
	await page.getByRole('heading', { name: 'Affirm Completed' }).isVisible();
	await clickElement(page, page.getByRole('button', { name: 'OK' }));
}

export const deleteUnaffirmedAmendment = async (page: Page): Promise<void> => {
	await clickElement(page, page.locator("[title='Delete']"));
	await clickElement(page, page.getByRole('button', { name: 'OK' }));
	//[title='Edit']
}
