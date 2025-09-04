import { test } from '../../../base'
import { searchesMenuDropDown } from '../../../components/navigation-bar'
import { newSearchPage } from '../../../components/searches'
import { downloadResults, filterOptionsAndCriteria, printBulkIep, printResults, selectTypeOfReport } from '../../../components/searches/new-search.page'
import { clickElement } from '../../../helpers/actions'
import { loginTeacherRole, logOut } from '../../../helpers/common-flows'
import { verifyIfElementIsVisible } from '../../../helpers/verify'
import { waitForPageReady } from '../../../helpers/layout'

test.describe('TEACHER > Students HD Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginTeacherRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('Search Column Options Service Report @HD-Test', async ({ page }) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await clickElement(page, newSearchPage.locators.COLUMN_OPTIONS_BTN)
		await selectTypeOfReport(page)
	})

	test('New Search Report Download @HD-Test', async ({ page }) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await clickElement(page, newSearchPage.locators.COLUMN_OPTIONS_BTN)
		await filterOptionsAndCriteria(page)
		await downloadResults(page)
	})

	test.skip('New Search Report Print @HD-Test', async ({ page }) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await clickElement(page, newSearchPage.locators.COLUMN_OPTIONS_BTN)
		await filterOptionsAndCriteria(page)
		await printResults(page)
	})

	test('bulk print english/spanish @HD-Test', async ({page}) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await page.waitForSelector(newSearchPage.locators.TABLE, { state: 'visible' })
		await waitForPageReady(page) // Add page ready wait after table loads
		await verifyIfElementIsVisible(page, newSearchPage.locators.SEARCH_TOOLS)
		
		// Enhanced checkbox selection with better waiting
		const checkboxes = page.locator(newSearchPage.locators.CHECK_ONE);
		await checkboxes.first().waitFor({ state: 'visible', timeout: 15000 });
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		
		await printBulkIep(page)
		
		// Enhanced cancel button handling
		const cancelBtn = page.locator(newSearchPage.locators.CANCEL_BTN).first();
		await cancelBtn.waitFor({ state: 'visible', timeout: 10000 });
		await clickElement(page, cancelBtn)
		
		await waitForPageReady(page) // Wait after cancel
		
		// Re-select checkboxes for Spanish print
		await checkboxes.first().waitFor({ state: 'visible', timeout: 15000 });
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		await printBulkIep(page, 'Spanish')
	})
})