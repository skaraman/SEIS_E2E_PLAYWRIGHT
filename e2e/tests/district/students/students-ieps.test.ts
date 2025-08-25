import { test } from '../../../base'
import { loginDistrictRole, logOut } from '../../../helpers/common-flows'
import { studentsMenuDropDown } from '../../../components/navigation-bar'
import { clickElement, enterTextField } from '../../../helpers/actions'
import { verifyFileDownload, verifyIfElementIsVisible, verifyIfTitleIsCorrect } from '../../../helpers/verify'
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
		await waitForPageReady(page)
		await page.locator('#checkAllFirst').first().check();
		await printProgress(page)
	})

	test('Future Ieps Print All Forms @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await printAllForms(page)
	})

	test('Future Ieps Preview Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await clickElement(page, futureIepFormsPage.locators.PREVIEW_FORM);
		//await page.waitForTimeout(120000) // Waiting for the file to be generated and download to start
		await verifyFileDownload(page)
	})

	test('Future Ieps Print Single Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await clickElement(page, futureIepFormsPage.locators.EDIT_FORM)
		await page.locator('#sticky-bar .saveBtns .dropdown.btn').click()
		await page.locator('#sticky-bar').getByText('English').click()
		//await page.waitForTimeout(100000) // Waiting for the file to be generated and download to start
		await verifyFileDownload(page)
	})

	test('Current Ieps Print All/ Preview Form @HD-Test-Debug', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.CURRENT_IEPS)
		await clickElement(page, currentIepFormsPage.locators.PREVIEW_FORM)
		await printAllFormsCurrentIep(page)
	})

	test('Add/Print DRDP @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.DRDP)
		await addDrdp(page)
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
		await page.getByLabel('NReco').check();
		await clickElement(page, '.modal-content button.btn-primary')
		await verifyFileDownload(page)
	})

	test('Quick Links Verify @HD-Test-Debug', async ({ page }) => {
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
		await goBackAndWait(page)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.STUDENT_IEPS)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Student IEPs')
		await goBackAndWait(page)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.EMAIL_TEAM)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'New Message')
		await goBackAndWait(page)
		await waitForPageReady(page)
		await page.waitForTimeout(3000)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.DOC_LIBRARY)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Document Library')
		await page.locator("[name='Keyword']").isVisible()
		await goBackAndWait(page)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.ATTACHMENTS)
		await waitForPageReady(page)
		await page.getByText('Add Attachment').isVisible()
		await goBackAndWait(page)
		//await waitForPageReady(page)
		// await clickElement(page, studentDemographicsPage.locators.Q_L)
		// await clickElement(page, studentDemographicsPage.locators.CALPADS_TRANSACTIONS)
		// await waitForPageReady(page)
		// await verifyIfTitleIsCorrect(page, 'CALPADS Transactions')
	})
})

async function goBackAndWait(page) {
	await page.goBack()
	await waitForPageReady(page)
}