import { test } from '../../../base'
import { loginDistrictRole, logOut } from '../../../helpers/common-flows'
import { referenceDocumentLibraryPage } from './../../../components/reference'
import { referenceMenuDropDownComponent } from '../../../components/navigation-bar'
import { actions, verify } from '../../../helpers'
import { openWindowForDocLibrary } from '../../../helpers/actions'

const { verifyIfElementIsVisible } = verify
const { clickElement } = actions
const { hasPageLoadedCorrectly, locators: referenceLocators } =	referenceDocumentLibraryPage
const { locators: referenceMenuLocators } = referenceMenuDropDownComponent

test.describe('District > Reference Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginDistrictRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('reference doc library open document @HD-Test', async ({ page }) => {
		await clickElement(page, referenceMenuLocators.REFERENCE)
		await clickElement(page, referenceMenuLocators.DOCUMENT_LIBRARY)
		test.expect(await hasPageLoadedCorrectly(page)).toBe(true)
		await verifyIfElementIsVisible(page, referenceLocators.SEARCH_INPUT)
		// Click show all button once and wait for results to load
		await clickElement(page, referenceLocators.SHOW_ALL_BTN)
		await page.waitForLoadState('networkidle', { timeout: 10000 })
		const newPage = await openWindowForDocLibrary(page, async () => {
			await clickElement(
				page,
				page.locator('[title="Download"]', { hasText: 'small doc' })
			)
		})
		//test.expect(newPage).toHaveURL(/documentlibrary-storage/)
	})
})
