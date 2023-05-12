import { test } from '../../../base'
import { loginDistrictRole, logOut } from '../../../helpers/common-flows'
import { adminMenuDropDownComponent } from '../../../components/navigation-bar'
import { verify, actions } from './../../../helpers'

const { verifyIfPageUrlIsCorrect } = verify
const { locators } = adminMenuDropDownComponent
const { clickElement } = actions

test.describe('District > Administration Page Load Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginDistrictRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('admin custom fields page load verify @HD-Test', async ({ page }) => {
		await clickElement(page, locators.ADMINISTRATION)
		await clickElement(page, locators.MANAGE_CUSTOM_FIELDS)
		await page.waitForSelector('#headerTitle')
		await verifyIfPageUrlIsCorrect(page, 'admin/customfields')
	})
})
