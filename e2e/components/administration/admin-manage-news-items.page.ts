import { Page } from "@playwright/test";


export const locators = {


}



export const NewsItemsAddDelete = async (page: Page) => {
await page.getByRole('button', { name: '+ Add' }).click();
  await page.getByLabel('Title').click();
  await page.getByLabel('Title').fill('testing');
  await page.locator('form[name="vm\\.form"]').getByText('District').click();
  await page.locator('#quill-editor-newsItem div').first().click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('span:has-text("testing")').nth(1).click();
  await page.getByRole('link', { name: '' }).nth(0).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByText('News Item Deleted').click();
}