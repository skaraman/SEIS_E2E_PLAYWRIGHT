import { Page } from "@playwright/test";
import { clickElement } from "../../helpers/actions";
import { waitForPageReady } from "../../helpers/layout";


export const locators = {
	CLOSE_BTN: ('[ng-click="vm.checkBeforeClosing()"]')
}

export const fillOutForm = async (page: Page) => {
  await page.getByLabel('Student\'s SEIS ID or SSID').click();
  await page.getByLabel('Student\'s SEIS ID or SSID').fill('432432454334');
  await page.getByRole('link', { name: '---Select One---' }).click();
  await page.getByRole('option', { name: 'CALPADS' }).click();
  await page.locator('#quill-editor-Message div').first().fill('This is Automation testing, please dismiss');

  const [fileChooser] = await Promise.all([
	// It is important to call waitForEvent before click to set up waiting.
	page.waitForEvent('filechooser'),
	page.locator('button[name="file"]').click(),
  ]);
  await fileChooser.setFiles('./e2e/data/testing.txt'); 

  await page.getByLabel('Email Address').fill('tester+123@sjcoe.net');
  await page.getByLabel('Phone Number').click();
  await page.getByLabel('Phone Number').fill('9165464565');
  await page.getByRole('link', { name: 'Classroom' }).click();
  await page.getByRole('option', { name: 'Laptop' }).click();
  await page.getByRole('button', { name: '✉ Send Email' }).click();
  await waitForPageReady(page);
  await page.locator('div:has-text("Email sent!")').nth(1).isVisible();


}
