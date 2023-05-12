import { test } from '../../../base'
import { Locator } from '@playwright/test'
import { loginDistrictRole, logOut } from '../../../helpers/common-flows'
import { studentsMenuDropDown } from '../../../components/navigation-bar'
import {
	clickElement,
	enterTextField,
	openWindow,
} from '../../../helpers/actions'
import {
	verifyIfElementIsVisible,
	verifyIfPageUrlIsCorrect,
	verifyIfTitleIsCorrect,
	verifyTableHeaderColumns,
} from '../../../helpers/verify'
import {
	futureIepFormsPage,
	iepGoalProgressTrackingPage,
	studentIepsPage,
	currentIepFormsPage,
	printProgressReportsPage,
	studentDemographicsPage,
} from '../../../components/students'
import {
	selectEligibility,
	SelectGoalProgressTrackingIcn,
} from '../../../components/students/student-ieps.page'
import {
	clickReturnToIeps,
	printAllForms,
} from '../../../components/students/future-iep-forms.page'
import {
	affirmProgress,
	checkAll,
	clickYes,
	printProgress,
} from '../../../components/students/iep-goal-progress-tracking.page'
import { printAllFormsCurrentIep } from '../../../components/students/current-iep-forms.page'
import { addDrdp } from '../../../components/students/drdp.page'
import { actions } from '../../../helpers'

test.describe('District > Student Ieps Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginDistrictRole(page)
		await page.waitForSelector('news-items-v2')
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('Students Iep Progress Reports Affirm @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await page.waitForSelector(futureIepFormsPage.locators.QUICK_LINKS)
		await verifyIfElementIsVisible(
			page,
			futureIepFormsPage.locators.QUICK_LINKS
		)
		await clickElement(page, futureIepFormsPage.locators.COMMMENTS)
		await clickElement(page, futureIepFormsPage.locators.ADD_COMMENT)
		await enterTextField(
			page,
			futureIepFormsPage.locators.TEXT_AREA,
			'TESTING COMMENTS BOX'
		)
		await clickElement(page, futureIepFormsPage.locators.SAVE_BTN)
		await clickReturnToIeps(page)
		await SelectGoalProgressTrackingIcn(page)
		await verifyIfElementIsVisible(
			page,
			iepGoalProgressTrackingPage.locators.TABLE
		)
		await checkAll(page)
		await clickElement(page, iepGoalProgressTrackingPage.locators.UPDATE_BTN)
		await clickYes(page)
		await affirmProgress(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await page.waitForSelector(futureIepFormsPage.locators.QUICK_LINKS)
		await verifyIfElementIsVisible(
			page,
			futureIepFormsPage.locators.QUICK_LINKS
		)
		await clickElement(page, futureIepFormsPage.locators.COMMMENTS)
	})

	test('Students Iep Progress Reports Print @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.GOAl_PROGRESS_TRACKING)

		await checkAll(page)
		await printProgress(page)

		const printWindow = await openWindow(page, async () => {
			page.locator('.toast-title').click()
		})
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})

	test('Future Ieps Print All Forms @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await clickElement(page, futureIepFormsPage.locators.CHECK_ALL)
		const printWindow = await printAllForms(page)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})

	test('Future Ieps Preview Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await clickElement(page, futureIepFormsPage.locators.PREVIEW_FORM)
		const [page1] = await Promise.all([page.waitForEvent('popup')])
		await verifyIfPageUrlIsCorrect(page1, '/print-pdf')
	})

	test('Future Ieps Print Single Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await clickElement(page, futureIepFormsPage.locators.EDIT_FORM)
		await page.locator('#sticky-bar').getByText('Print').click()
		const [page1] = await Promise.all([
			page.waitForEvent('popup'),
			page.locator('#sticky-bar').getByText('English').click(),
		])
		await verifyIfPageUrlIsCorrect(page1, '/print-pdf')
	})

	test('Current Ieps Print All/ Preview Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.CURRENT_IEPS)
		await clickElement(page, currentIepFormsPage.locators.PREVIEW_FORM)
		const printWindow = await printAllFormsCurrentIep(page)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})
	test('Add/Print DRDP @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.DRDP)
		const printWindow = await addDrdp(page)
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})
	test('Print Progress Reports @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.PRINT_PROGRESS)
		await clickElement(page, printProgressReportsPage.locators.PRINT_BTN)
		await clickElement(page, printProgressReportsPage.locators.PREVIEW_ICN)
		await clickElement(page, printProgressReportsPage.locators.PRINT_FORM_ICN)
		await page
			.locator('div.modal-footer >button.btn-primary:text("Print")')
			.click()
		await page.getByText('Processing print request in Print Queue.').isVisible()
		const printWindow = await openWindow(page, async () => {
			await page.locator('.toast-title').click()
		})
		await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
	})

	test('Quick Links Verify @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
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

			if (
				currentIepMatch !== null &&
				futureIepMatch !== null &&
				historicalIepMatch !== null &&
				printProgressMatch !== null
			) {
				foundIndex = i

				break
			}
		}

		const seisId = await page
			.locator('tbody td .seisId')
			.nth(foundIndex)
			.textContent()
		const studentDemoLocator = page.locator(
			`[data-studentid='${seisId}'].seis-icon-student-record`
		)
		await clickElement(page, studentDemoLocator)
		//#endregion
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.FUTURE_IEP)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'Future IEP Forms')
		await clickElement(page, futureIepFormsPage.locators.COMMMENTS)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.CURRENT_IEP)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'Current Affirmed Forms')
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.PROGRESS_REPORTS)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'Print Progress Reports')
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.STUDENT_IEPS)
		await verifyIfTitleIsCorrect(page, 'Student IEPs')
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.EMAIL_TEAM)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'New Message')
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.DOC_LIBRARY)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'Document Library')
		await page.locator("[name='Keyword']").isVisible()
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.ATTACHMENTS)
		await page.getByText('Add Attachment').isVisible()
		await page.goBack()
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(
			page,
			studentDemographicsPage.locators.CALPADS_TRANSACTIONS
		)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'CALPADS Transactions')
	})
})
