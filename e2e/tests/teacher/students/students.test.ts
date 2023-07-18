import { test, expect } from '../../../base'
import { clickElement, enterTextField } from '../../../helpers/actions'
import { loginTeacherRole, logOut } from '../../../helpers/common-flows'
import { locators } from '../../../components/navigation-bar/students-menu-drop-down'
import { studentsMenuDropDown } from '../../../components/navigation-bar'
import { currentIepFormsPage, futureIepFormsPage, iepGoalProgressTrackingPage, studentChangeFormPage, studentDemographicsPage, studentIepsPage } from '../../../components/students'
import { requestChangeAddress } from '../../../components/students/student-change-form.page'
import { selectEligibility, SelectGoalProgressTrackingIcn, selectPendingEligibility } from '../../../components/students/student-ieps.page'
import { fillOutGeneratedSSID, fillOutSSID } from '../../../components/students/student-demographics.page'
import { clickReturnToIeps } from '../../../components/students/future-iep-forms.page'
import { verifyIfElementIsVisible, verifyIfPageUrlIsCorrect } from '../../../helpers/verify'
import { affirmProgress, checkAll, clickYes } from '../../../components/students/iep-goal-progress-tracking.page'
import { fillOutForm } from '../../../components/students/amendment.page'
import { addDrdp } from '../../../components/students/drdp.page'



test.describe('TEACHER > Students HD Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginTeacherRole(page)
	})
	test.afterEach(async ({ page }) => {
		await logOut(page)
	})
	test('Student Change Form @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_CHANGE_FORM)
		await clickElement(page, studentChangeFormPage.locators.SELECT_STUDENT)
		await requestChangeAddress(page)
	})

	test('Edit Student Record @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectPendingEligibility(page)
		await clickElement(page, studentIepsPage.locators.VIEW_STUDENT_RECORD)
		const saveBtn = page.locator('//*[@id="btnSaveForm"]');
		await expect(saveBtn).toHaveAttribute('class', 'btn btn-primary')
		const ssid = await fillOutSSID(page)
		await expect(saveBtn).toHaveAttribute('class', 'btn btn-warning')
		await clickElement(page, saveBtn)
		await page.getByText('Student Demographics saved').isVisible();
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await fillOutGeneratedSSID(page, ssid)
		await page.getByRole('button', { name: 'Find' }).click();
		await page.getByRole('gridcell', { name: `${ssid}` }).isVisible();
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

	test('Students Iep Amendment Affirm @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.CURRENT_IEPS)
		await page.waitForSelector(currentIepFormsPage.locators.QUICK_LINKS)
		await verifyIfElementIsVisible(
			page,
			futureIepFormsPage.locators.QUICK_LINKS
		)
		await clickElement(page, currentIepFormsPage.locators.COMMMENTS)
		await clickElement(page, currentIepFormsPage.locators.ADD_COMMENT)
		await enterTextField(
			page,
			futureIepFormsPage.locators.TEXT_AREA,
			'Current Iep Comment Should Remain after Amendment Affirm'
		)
		await clickElement(page, currentIepFormsPage.locators.SAVE_BTN)

		await clickElement(page, page.locator("text=Amendments").nth(1))
		if(
		await page.locator("#amendments-list [title='Delete']").nth(0).isVisible()
	){
		await page.locator("#amendments-list [title='Delete']").nth(0).click()
		await page.locator("[data-bb-handler='success']").click();
	}
		await clickElement(page, currentIepFormsPage.locators.ADD_AMENDMENT)
		await fillOutForm(page)
})
test('Add/Print DRDP @HD-Test', async ({ page }) => {
	await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
	await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
	await page.waitForSelector(studentIepsPage.locators.TABLE)
	await selectEligibility(page)
	await clickElement(page, studentIepsPage.locators.DRDP)

	if ( await page.locator("Add/Print DRDP @HD-Test").isVisible

	)
	{
		await page.locator("[title='Delete']").first().click()
		await page.getByRole('button', { name: 'Yes' }).click();

	}

	const printWindow = await addDrdp(page)
	await verifyIfPageUrlIsCorrect(printWindow, '/print-pdf')
})
})