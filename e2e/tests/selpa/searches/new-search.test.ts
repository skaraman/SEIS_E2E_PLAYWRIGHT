import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import { searchesMenuDropDown } from "../../../components/navigation-bar"
import { clickElement } from '../../../helpers/actions'
import { verifyIfElementIsVisible } from '../../../helpers/verify'
import { newSearchPage } from "../../../components/searches"
import { printBulkIep, printBulkIfspForms, printBulkProgressReports } from '../../../components/searches/new-search.page'
import { waitForPageReady } from '../../../helpers/layout'

test.describe('SELPA > Search Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
		await page.waitForSelector('news-items-v2')
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('search bulk print english/spanish @HD-Test', async ({ page }) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await page.waitForSelector(newSearchPage.locators.TABLE)
		await verifyIfElementIsVisible(page, newSearchPage.locators.SEARCH_TOOLS)
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		await printBulkIep(page)
		await waitForPageReady(page)
		await clickElement(page, newSearchPage.locators.CANCEL_BTN)
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		await printBulkIep(page, 'Spanish')
		
	})

	test('search bulk print progress report @HD-Test', async ({ page }) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await page.waitForSelector(newSearchPage.locators.TABLE)
		await verifyIfElementIsVisible(page, newSearchPage.locators.SEARCH_TOOLS)
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(2))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(3))
		await printBulkProgressReports(page)

	})

	test('search bulk print ifsp forms @HD-Test', async ({ page }) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await page.waitForSelector(newSearchPage.locators.TABLE)
		await verifyIfElementIsVisible(page, newSearchPage.locators.SEARCH_TOOLS)
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(0))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(1))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(2))
		await clickElement(page, page.locator(newSearchPage.locators.CHECK_ONE).nth(3))
		await printBulkIfspForms(page)
	})
})
