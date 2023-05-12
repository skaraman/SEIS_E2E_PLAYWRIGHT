import { test } from '../base'
import { verify } from '../helpers'
import {
	loginTeacherRole,
	loginDistrictRole,
	loginSiteRole,
	loginSelpaRole,
	logOut,
} from '../helpers/common-flows'
import { dashboardPage } from '../components/dashboard'

const { verifyIfElementIsVisible } = verify

test.describe('Sign In Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login')
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('should be able to sign in as teacher user', async ({ page, users }) => {
		await loginTeacherRole(page)
		verifyIfElementIsVisible(page, dashboardPage.locators.MAIN_VIEW)
	})

	test('should be able to sign in as district user', async ({ page }) => {
		await loginDistrictRole(page)
		verifyIfElementIsVisible(page, dashboardPage.locators.MAIN_VIEW)
	})

	test('should be able to sign in as site user', async ({ page, users }) => {
		await loginSiteRole(page)
		verifyIfElementIsVisible(page, dashboardPage.locators.MAIN_VIEW)
	})

	test('should be able to sign in as selpa user', async ({ page, users }) => {
		await loginSelpaRole(page)
		verifyIfElementIsVisible(page, dashboardPage.locators.MAIN_VIEW)
	})
})
