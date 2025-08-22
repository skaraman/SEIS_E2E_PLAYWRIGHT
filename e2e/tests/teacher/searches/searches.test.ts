import { test } from '../../../base'
import { searchesMenuDropDown } from '../../../components/navigation-bar'
import { newSearchPage } from '../../../components/searches'
import { downloadResults, filterOptionsAndCriteria, printBulkIep, printResults, selectTypeOfReport } from '../../../components/searches/new-search.page'
import { clickElement } from '../../../helpers/actions'
import { loginTeacherRole, logOut } from '../../../helpers/common-flows'
import { verifyIfElementIsVisible } from '../../../helpers/verify'

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

	test('New Search Report Download @HD-Test-Debug', async ({ page }) => {
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
		await page.waitForSelector(newSearchPage.locators.TABLE)
		await verifyIfElementIsVisible(page, newSearchPage.locators.SEARCH_TOOLS)
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		await printBulkIep(page)
		await clickElement(page, newSearchPage.locators.CANCEL_BTN)
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		await printBulkIep(page, 'Spanish')
	})
})