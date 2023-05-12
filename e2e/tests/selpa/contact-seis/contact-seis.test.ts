import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import { contactSeisDropDown } from "../../../components/navigation-bar"
import { clickElement } from '../../../helpers/actions'
import { contactSeisPage } from '../../../components/contact-seis'
import { locators } from '../../../components/dashboard/unaffirmed-iep.page'
import { fillOutForm } from '../../../components/contact-seis/contact-seis.page'
import { verifyIfElementIsVisible } from '../../../helpers/verify'
test.describe('SELPA > Search Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
		await page.waitForSelector('news-items-v2')
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('contact SEIS @HD-Test', async ({page}) => {
		await clickElement(page, contactSeisDropDown.locators.CONTACT_SEIS)
		await page.waitForTimeout(4000)
		await verifyIfElementIsVisible(page, contactSeisPage.locators.CLOSE_BTN)
		await fillOutForm(page)

	})
	
})