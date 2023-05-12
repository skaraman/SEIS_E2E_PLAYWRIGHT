import { Page } from "@playwright/test";


export const locators = {
	KEYWORDS_INPUT: "#keyword",
	HEADERS: "h4"



}



export const newDocumentAddDelete = async (page: Page) => {
  const docName = 'testing document library'
	await page.getByRole('button', { name: '+ Add New Document' }).click();
  await page.locator('input[name="title"]').click();
  await page.locator('input[name="title"]').fill(docName);
  await page.locator('#s2id_districtID').getByRole('link').click();
  await page.getByRole('option', { name: 'Bauxbatons' }).click();
  await page.locator('label:has-text("District")').click();
  await page.locator('#s2id_folderID').getByRole('link').click();
  await page.getByRole('option', { name: 'add new 123' }).click();

 const [fileChooser] = await Promise.all([
	// It is important to call waitForEvent before click to set up waiting.
	page.waitForEvent('filechooser'),
	page.locator('button[name="file"]').click(),
  ]);
  await fileChooser.setFiles('./e2e/data/testing.txt');

  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('cell', { name: docName }).isVisible();
  await page.click(`tr:has(td:text("${docName}")) a[title="Delete Document"]`) 
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByText('Document delete successfully!').click();

} 