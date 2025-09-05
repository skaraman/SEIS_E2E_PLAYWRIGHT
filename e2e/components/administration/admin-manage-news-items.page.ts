import { Page } from "@playwright/test";
import { clickElement } from "../../helpers/actions"

export const NewsItemsAddDelete = async (page: Page) => {
  await clickElement(page, page.getByRole('button', { name: '+ Add' }))
  await clickElement(page, page.getByLabel('Title'))
  await page.getByLabel('Title').fill('testing');
  await clickElement(page, page.locator('form[name="vm\\.form"]').getByText('District'))
  await clickElement(page, page.locator('#quill-editor-newsItem div').first())
  await clickElement(page, page.getByRole('button', { name: 'Save' }))
  await clickElement(page, page.locator('span:has-text("testing")').nth(1))
  await clickElement(page, page.getByRole('link', { name: '' }).nth(0))
  await clickElement(page, page.getByRole('button', { name: 'Yes' }))
  await clickElement(page, page.getByText('News Item Deleted'))
}