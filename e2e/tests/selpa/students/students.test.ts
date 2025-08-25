import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import {
	verifyIfElementIsVisible,
	verifyIfTitleIsCorrect,
} from '../../../helpers/verify'
import { clickElement } from '../../../helpers/actions'
import { locators } from '../../../components/navigation-bar/students-menu-drop-down'
import {
	addStudentPage,
	exitedStudentsPage,
	futureIepFormsPage,
	studentDemographicsPage,
	studentIepsPage,
} from '../../../components/students/index'
import {
	addNewStudent,
	requestTransfer,
} from '../../../components/students/add-student.page'
import { studentsMenuDropDown } from '../../../components/navigation-bar'
import { selectEligibility } from '../../../components/students/student-ieps.page'
import {
	generateEsignaturePreMeeting,
	validateEsignaturePage,
	generateEsignatureCompleted
} from '../../../components/students/future-iep-forms.page'
import { waitForPageReady } from '../../../helpers/layout'

test.describe('SELPA > Students Load Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
	})
	test.afterEach(async ({ page }) => {
		await logOut(page)
	})
	test('Students Links Verify @HD-Test', async ({ page }) => {
		await clickElement(page, locators.STUDENTS, 0, 'text')
		await clickElement(page, locators.ADD_STUDENT)
		await page.waitForLoadState('networkidle')
		await page.isVisible(addStudentPage.locators.FIRST_NAME_INPUT)
		await clickElement(page, locators.STUDENTS, 0, 'text')
		await clickElement(page, locators.EXITED_STUDENTS)
		await page.isVisible(exitedStudentsPage.locators.ALPHABET)
		await clickElement(page, locators.STUDENTS, 0, 'text')
		await clickElement(page, locators.DNQd_STUDENTS)
		await page.isVisible(exitedStudentsPage.locators.BODY)
		await page.isVisible(exitedStudentsPage.locators.GO_BTN)
	})

	test('Add Students Request Transfer @HD-Test', async ({ page }) => {
		await clickElement(page, locators.STUDENTS, 0, 'text')
		await clickElement(page, locators.ADD_STUDENT)
		const [lastName, firstName] = await addNewStudent(page)
		await page.getByRole('button', { name: 'Edit Student' }).click()
		await clickElement(page, locators.STUDENTS, 0, 'text')
		await clickElement(page, locators.ADD_STUDENT)
		await requestTransfer(page, lastName, firstName)
	})

	test('Quick Links Verify @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)

		await selectEligibility(page)
		await waitForPageReady(page)
		await clickElement(page, '.seis-icon-student-record')
		await page.getByRole('link', { name: 'Demographics' }).click()
		//await clickElement(page, studentIepsPage.locators.EDIT_STUDENT_RECORD)
		await waitForPageReady(page)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.FUTURE_IEP)
		await waitForPageReady(page)
		// const [aVisible, bVisible] = await Promise.all([
		//  page.locator('button:has-text("View Current IEP")').isVisible(),
		//  page.locator('button:has-text("Go to E-Signature")').isVisible()
		// ]);
		// if (aVisible || bVisible) {
		// 	await page.locator('button:has-text("Cancel")').click()
		// }
		await verifyIfTitleIsCorrect(page, 'Future IEP Forms')
		await clickElement(page, futureIepFormsPage.locators.COMMENTS)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.CURRENT_IEP)
		await waitForPageReady(page)
		// const [viewVisible, esigVisible] = await Promise.all([
		// 	page.locator('button:has-text("View Current IEP")').isVisible(),
		// 	page.locator('button:has-text("Go to E-Signature")').isVisible()
		// ]);
		// if (viewVisible || esigVisible) {
		// 	await page.locator('button:has-text("Cancel")').click();
		// }
		await verifyIfTitleIsCorrect(page, 'Current Affirmed Forms')
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.HISTORICAL_IEPS)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Historical IEPs')
		await page.goBack()

		// const [viewVisible2, esigVisible2] = await Promise.all([
		// 	page.locator('button:has-text("View Current IEP")').isVisible(),
		// 	page.locator('button:has-text("Go to E-Signature")').isVisible()
		// ]);
		// if (viewVisible2 || esigVisible2) {
		// 	await page.locator('button:has-text("Cancel")').click();
		// }
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.PROGRESS_REPORTS)
		await waitForPageReady(page)
		await verifyIfTitleIsCorrect(page, 'Print Progress Reports')
	})

	test('Generate E-Signature Pre-meeting @HD-Test-Debug', async ({ page, request }, configs ) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await waitForPageReady(page)
		await generateEsignaturePreMeeting(page)
		await validateEsignaturePage(page, configs, request)
	})

	test('Generate E-Signature Complete @HD-Test-Debug', async ({ page, request }, configs) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)

		// Find students with no CALPADS errors
		await generateEsignatureCompleted(page, configs, request)

		// Get the studentId and filter the results
	})
})
