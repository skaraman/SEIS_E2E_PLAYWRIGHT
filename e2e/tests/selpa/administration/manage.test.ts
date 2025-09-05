import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import { adminMenuDropDownComponent } from '../../../components/navigation-bar'
import { verify, actions } from '../../../helpers'
import { ManageDocumentLibraryPage, ManageNewsItemsPage } from '../../../components/administration'
import { verifyIfElementIsVisible } from '../../../helpers/verify'
import { newDocumentAddDelete } from '../../../components/administration/admin-manage-document-library.page'
import { waitForPageReady } from '../../../helpers/layout'
import { AddNewUser, DeleteNewUser, RestoreUser } from '../../../components/administration/admin-manage-users.page'
import { NewsItemsAddDelete } from '../../../components/administration/admin-manage-news-items.page'

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

	
	test('news items add delete @HD-Test', async ({ page }) => {
		await clickElement(page, locators.ADMINISTRATION)
		await clickElement(page, locators.MANAGE_NEWS_ITEMS)
		await NewsItemsAddDelete(page)
		/* ../../../data/testing.txt */
	})

	test('document library add delete @HD-Test', async ({ page }) => {
		await clickElement(page, locators.ADMINISTRATION)
		await clickElement(page, locators.MANAGE_DOC_LIBRARY)
		await waitForPageReady(page)
		await verifyIfElementIsVisible(page, ManageDocumentLibraryPage.locators.HEADERS)
		await newDocumentAddDelete(page)                     
	
	})

	test('manage users add delete @HD-Test', async ({ page }) => {
		await clickElement(page, locators.ADMINISTRATION)
		await clickElement(page, locators.MANAGE_USER)
		const userName = await AddNewUser(page)
		await DeleteNewUser(page, userName)
		await RestoreUser(page, userName )
		
	})

})