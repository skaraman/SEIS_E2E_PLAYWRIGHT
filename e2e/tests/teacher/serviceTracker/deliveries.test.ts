import { test, expect } from '../../../base'
import { searchesMenuDropDown, studentsMenuDropDown } from '../../../components/navigation-bar'
import { locators } from '../../../components/navigation-bar/serviceTracker-menu-drop-down'
import { newSearchPage } from '../../../components/searches'
import { downloadResults, filterOptionsAndCriteria, printBulkIep, printResults, selectTypeOfReport } from '../../../components/searches/new-search.page'
import { providersDashboardPage, providersPage } from '../../../components/service-tracker'
import { fillOutAddTcmFields, fillOutEditAssessmentFields } from '../../../components/service-tracker/service-tracker-providers-assessmentTCM.page'
import { addNewDelivery } from '../../../components/service-tracker/service-tracker-providers-deliveries.page'
import { clickToastMsg, selectDates } from '../../../components/service-tracker/service-tracker-providers-rosters.page'
import { clickElement, enterTextField } from '../../../helpers/actions'
import { loginTeacherRole, logOut } from '../../../helpers/common-flows'
import { verifyIfElementIsVisible } from '../../../helpers/verify'




test.describe('TEACHER > Service Tracker Deliveries', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginTeacherRole(page)
	})
	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test("service tracker add delivery service @HD-Test", async ({ page }) => {
		await clickElement(page, locators.SERVICE_TRACKER)
		await clickElement(page, locators.DELIVERY)
		await page.locator("[title='Deliver']").nth(0).click()
		await page.locator("text= Add Service").click()
		await addNewDelivery(page)
	
	  });

	test("service tracker provider dashboard add assessment @HD-Test", async ({
		page,
	  }) => {
		await clickElement(page, locators.SERVICE_TRACKER)
		await page.getByRole('link', { name: 'Assessments' }).click();
		await page.locator("[title='Deliver Assessment']").nth(0).click()
		await page.locator("text= Add Assessment").click()
		await fillOutEditAssessmentFields(page)
		await page.waitForTimeout(5000)
		await page.locator("[id='deleteAssessment']").first().click()
		await page.getByRole('button', { name: 'Delete Assessment' }).click();
		await page.getByText('Claim deleted successfully').isVisible();
	  });

	  test("service tracker assessments add TCM @HD-Test", async ({
		page,
	  }) => {
		await clickElement(page, locators.SERVICE_TRACKER)
		await page.getByRole('link', { name: 'Assessments' }).click();
		await page.locator("[title='Deliver TCM']").nth(0).click()
		await page.locator("text= Add TCM").click()
		await fillOutAddTcmFields(page)

	  });
})