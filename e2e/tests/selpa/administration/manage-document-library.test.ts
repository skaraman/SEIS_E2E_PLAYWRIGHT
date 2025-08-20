import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import { adminMenuDropDownComponent } from '../../../components/navigation-bar'
import { verify, actions } from './../../../helpers'
import { ManageDocumentLibraryPage, ManageNewsItemsPage } from '../../../components/administration'
import { verifyIfElementIsVisible } from '../../../helpers/verify'
import { newDocumentAddDelete } from '../../../components/administration/admin-manage-document-library.page'
import { waitForPageReady } from '../../../helpers/layout'


const { verifyIfPageUrlIsCorrect } = verify
const { locators } = adminMenuDropDownComponent
const { clickElement } = actions

test.describe('SELPA > Administration Page Load Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('document library add delete @HD-Test', async ({ page }) => {
		await clickElement(page, locators.ADMINISTRATION)
		await clickElement(page, locators.MANAGE_DOC_LIBRARY)
		await waitForPageReady(page)
		await verifyIfElementIsVisible(page, ManageDocumentLibraryPage.locators.HEADERS)
		await newDocumentAddDelete(page)                     
	
	})

})