import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import { verify } from './../../../helpers'
import { verifyIfElementIsVisible } from '../../../helpers/verify'
import { clickElement, openWindow } from '../../../helpers/actions'
import { locators } from '../../../components/navigation-bar/training-materials-drop-down'
import { faqPage } from '../../../components/training-materials'

test.describe('SELPA > Training Materials Load Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('FAQs Open & Verify @HD-Test', async ({ page }) => {
		await clickElement(page, locators.TRAINING_MATERIALS)
		const newPage = await openWindow(page, async()=>await clickElement(page, locators.FAQ))
		await newPage.waitForSelector('.panel-group>.panel-default')
		const rows = newPage.locator("a.accordion-toggle")
		for (const el of await rows.elementHandles()){
			await el.click()
		}
		await verifyIfElementIsVisible(newPage, faqPage.locators.SEARCH_BTN)
		await verify.verifyIfPageUrlIsCorrect(newPage, '/helpcenter/faqs')
	})
})