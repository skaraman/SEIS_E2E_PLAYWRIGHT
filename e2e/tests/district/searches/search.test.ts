import { test } from '../../../base'
import { loginDistrictRole, logOut } from '../../../helpers/common-flows'
import { searchesMenuDropDown } from "../../../components/navigation-bar"
import { clickElement } from '../../../helpers/actions'
import { verifyIfElementIsVisible, verifyTableHeaderColumns } from '../../../helpers/verify'
import { newSearchPage } from "../../../components/searches"
import { selectTypeOfReport } from '../../../components/searches/new-search.page'
test.describe('District > Search Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginDistrictRole(page)
		await page.waitForSelector('news-items-v2')
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('search column options duplicate services report @HD-Test', async ({page}) => {
		await clickElement(page, searchesMenuDropDown.locators.SEARCHES)
		await clickElement(page, searchesMenuDropDown.locators.NEW_SEARCH)
		await page.waitForSelector(
			newSearchPage.locators.TABLE
		)

		await verifyIfElementIsVisible(page, newSearchPage.locators.SEARCH_TOOLS)
		await clickElement(page, newSearchPage.locators.COLUMN_OPTIONS_BTN)
		await selectTypeOfReport(page)
		await page.waitForSelector(
			'#Service'
		)
		await verifyTableHeaderColumns(page, [
			'Last Name',
			'First Name',
			'School of Attendance',
			'Service',
			'Marked DNR',
			'Status',
			'Start Date',
			'End Date', 
			'Provider',
			'Session Based', 
			'Minutes / Session'

		])

	})
})
