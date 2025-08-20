import { test } from '../../../base'
import { Locator } from '@playwright/test'
import { loginDistrictRole, logOut } from '../../../helpers/common-flows'
import { studentsMenuDropDown } from '../../../components/navigation-bar'
import { clickElement, enterTextField, openWindow } from '../../../helpers/actions'
import { verifyIfElementIsVisible, verifyIfPageUrlIsCorrect, verifyIfTitleIsCorrect } from '../../../helpers/verify'
import {
	futureIepFormsPage, iepGoalProgressTrackingPage, studentIepsPage, currentIepFormsPage,
	printProgressReportsPage, studentDemographicsPage
} from '../../../components/students'
import { selectEligibility, SelectGoalProgressTrackingIcn } from '../../../components/students/student-ieps.page'
import { clickReturnToIeps, printAllForms } from '../../../components/students/future-iep-forms.page'
import { affirmProgress, clickYes, printProgress } from '../../../components/students/iep-goal-progress-tracking.page'
import { printAllFormsCurrentIep } from '../../../components/students/current-iep-forms.page'
import { addDrdp } from '../../../components/students/drdp.page'
import { waitForPageReady } from '../../../helpers/layout'

test.describe('District > Student Ieps Tests', () => {

	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginDistrictRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('Students Iep Progress Reports Affirm @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)

		await page.waitForSelector(futureIepFormsPage.locators.QUICK_LINKS)
		await verifyIfElementIsVisible(page, futureIepFormsPage.locators.QUICK_LINKS)
		await clickElement(page, futureIepFormsPage.locators.COMMENTS)
		await clickElement(page, futureIepFormsPage.locators.ADD_COMMENT)
		await enterTextField(page, futureIepFormsPage.locators.TEXT_AREA, 'TESTING COMMENTS BOX')
		await clickElement(page, futureIepFormsPage.locators.SAVE_BTN)
		await clickReturnToIeps(page)
		await SelectGoalProgressTrackingIcn(page)
		await verifyIfElementIsVisible(page, iepGoalProgressTrackingPage.locators.TABLE)
		await page.locator('#checkAllFirst').first().check();
		await clickElement(page, iepGoalProgressTrackingPage.locators.UPDATE_BTN)
		await clickYes(page)
		await affirmProgress(page)

		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS);
		await page.waitForSelector(futureIepFormsPage.locators.QUICK_LINKS)
		await verifyIfElementIsVisible(page, futureIepFormsPage.locators.QUICK_LINKS)
		await clickElement(page, futureIepFormsPage.locators.COMMENTS)
	})

	test('Students Iep Progress Reports Print @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.GOAl_PROGRESS_TRACKING)
		await page.locator('#checkAllFirst').first().check();
		const printWindow = await printProgress(page)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})

	test('Future Ieps Print All Forms @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		const printWindow = await printAllForms(page)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})

	test('Future Ieps Preview Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		const page1 = await openWindow(page, async () => {
			await clickElement(page, futureIepFormsPage.locators.PREVIEW_FORM);
		});
		await verifyIfPageUrlIsCorrect(page1, '/print-pdf')
	})

	test('Future Ieps Print Single Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await clickElement(page, futureIepFormsPage.locators.EDIT_FORM)
		await page.locator('#sticky-bar').getByText('Print', { exact: true }).click()
		const page1 = await openWindow(page, async () => {
			await page.locator('#sticky-bar').getByText('English').click()
		});
		await verifyIfPageUrlIsCorrect(page1, '/print-pdf')
	})

	test('Current Ieps Print All/ Preview Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.CURRENT_IEPS)
		await clickElement(page, currentIepFormsPage.locators.PREVIEW_FORM)
		const printWindow = await printAllFormsCurrentIep(page)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})

	test('Add/Print DRDP @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.DRDP)
		const printWindow = await addDrdp(page)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
		await page.locator("[title='Delete']").first().click()
		await page.getByRole('button', { name: 'Yes' }).click();
	})

	test('Print Progress Reports @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.PRINT_PROGRESS)
		await clickElement(page, printProgressReportsPage.locators.PRINT_BTN)
		await clickElement(page, printProgressReportsPage.locators.PREVIEW_ICN)
		await clickElement(page, printProgressReportsPage.locators.PRINT_FORM_ICN)
		await clickElement(page, '.modal-content button.btn-primary')
		const printWindow = await openWindow(page, async () => {
			await clickElement(page, '#toast-container .toast-title', 0, 'locator', 120000)
	}, 120000)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})

	test('Quick Links Verify @HD-Test', async ({ page }) => {

		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		//#region  CLICKS STUDENT DEMOGRAPICS FOR STUDENT THAT HAS CERTAIN CRITERIAS
		const result = await page.$$('#DataTables_Table_0 tbody tr')
		let foundIndex = -1
		for (let i = 0; i < (await result.length); i++) {
			const row = result[i]
			const currentIepMatch = await row.$('[title="Current IEP"]')
			const futureIepMatch = await row.$('[title="Future IEP"]')
			const historicalIepMatch = await row.$('[title="View Affirmed IEPS"]')
			const printProgressMatch = await row.$('[title="Print Progress"]')
			if (currentIepMatch !== null && futureIepMatch !== null && historicalIepMatch !== null && printProgressMatch !== null) {
				foundIndex = i
				break
			}
		}
		const seisId = await page.locator('tbody td .seisId').nth(foundIndex).textContent()
		await clickElement(page, `[data-studentid='${seisId}'].seis-icon-student-record`)
		//#endregion
		await clickElement(page, 'a.popover-action[data-action="demographics"]')
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.FUTURE_IEP)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Future IEP Forms')
		await clickElement(page, futureIepFormsPage.locators.COMMENTS)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.CURRENT_IEP)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Current Affirmed Forms')
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.PROGRESS_REPORTS)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Print Progress Reports')
		await page.goBack()
		await waitForPageReady(page)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.STUDENT_IEPS)
		await verifyIfTitleIsCorrect(page, 'Student IEPs')
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.EMAIL_TEAM)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'New Message')
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.DOC_LIBRARY)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Document Library')
		await page.locator("[name='Keyword']").isVisible()
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.ATTACHMENTS)
		await page.getByText('Add Attachment').isVisible()
		await page.goBack()
		await waitForPageReady(page)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.CALPADS_TRANSACTIONS)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'CALPADS Transactions')
	})
})
