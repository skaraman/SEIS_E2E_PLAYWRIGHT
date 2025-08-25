import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import { adminMenuDropDownComponent } from '../../../components/navigation-bar'
import { verify, actions } from './../../../helpers'
import { ManageNewsItemsPage } from '../../../components/administration'
import { NewsItemsAddDelete } from '../../../components/administration/admin-manage-news-items.page'
import { AddNewUser, DeleteNewUser, RestoreUser } from '../../../components/administration/admin-manage-users.page'


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

	test('manage users add delete @HD-Test-Debug', async ({ page }) => {
		await clickElement(page, locators.ADMINISTRATION)
		await clickElement(page, locators.MANAGE_USER)
		const userName = await AddNewUser(page)
		await DeleteNewUser(page, userName)
		await RestoreUser(page, userName )
		
	})

})
