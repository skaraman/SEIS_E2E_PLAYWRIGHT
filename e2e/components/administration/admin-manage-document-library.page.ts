import { Page, expect } from "@playwright/test";
import { clickElement } from "../../helpers/actions"

export const locators = {
  KEYWORDS_INPUT: "#keyword",
  HEADERS: "h4"
}

export const newDocumentAddDelete = async (page: Page) => {
  const docName = 'testing document library'
  await clickElement(page, page.getByRole('button', { name: '+ Add New Document' }))
  await clickElement(page, page.locator('input[name="title"]'))
  await page.locator('input[name="title"]').fill(docName);
  await clickElement(page, page.locator('#s2id_districtID').getByRole('link'))
  await clickElement(page, page.getByRole('option', { name: 'Bauxbatons' }))
  await clickElement(page, page.locator('label:has-text("District")'))
  await clickElement(page, page.locator('#s2id_folderID').getByRole('link'))
  await clickElement(page, page.getByRole('option', { name: 'add new 123' }))
  const [fileChooser] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('filechooser'),
    clickElement(page, page.locator('button[name="file"]')),
  ]);
  await fileChooser.setFiles('./e2e/data/testing.txt');
  await clickElement(page, page.getByRole('button', { name: 'Save' }))
  await expect(page.getByRole('cell', { name: docName })).toBeVisible();
  await clickElement(page, `tr:has(td:text("${docName}")) a[title="Delete Document"]`)
  await clickElement(page, page.getByRole('button', { name: 'Yes' }))
  await clickElement(page, page.getByText('Document delete successfully!'))

} 