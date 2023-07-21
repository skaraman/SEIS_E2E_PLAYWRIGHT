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

test.describe('SELPA > Students Load Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
	})
	test.afterEach(async ({ page }) => {
		await logOut(page)
	})
	test('Students Links Verify @HD-Test', async ({ page }) => {
		await clickElement(page, locators.STUDENTS)
		await clickElement(page, locators.ADD_STUDENT)
		await page.waitForLoadState('networkidle')
		await page.isVisible(addStudentPage.locators.FIRST_NAME_INPUT)
		await clickElement(page, locators.STUDENTS)
		await clickElement(page, locators.EXITED_STUDENTS)
		await page.isVisible(exitedStudentsPage.locators.ALPHABET)
		await clickElement(page, locators.STUDENTS)
		await clickElement(page, locators.PLAN_TYPE)
		await page.isVisible(exitedStudentsPage.locators.BODY)
		await page.isVisible(exitedStudentsPage.locators.GO_BTN)
	})

	test('Add Students Request Transfer @HD-Test', async ({ page }) => {
		await clickElement(page, locators.STUDENTS)
		await clickElement(page, locators.ADD_STUDENT)
		const [lastName, firstName] = await addNewStudent(page)

		await clickElement(page, addStudentPage.locators.EDIT_STUDENT)
		await clickElement(page, locators.STUDENTS)
		await clickElement(page, locators.ADD_STUDENT)
		await requestTransfer(page, lastName, firstName)
	})

	test('Quick Links Verify @HD-Test', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)

		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.VIEW_STUDENT_RECORD)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.FUTURE_IEP)
		await page.waitForNavigation()
		await page.waitForLoadState('networkidle')
		if (
			await page.locator('button:has-text("View Current IEP")').isVisible() || await page.locator('button:has-text("Go to E-Signature")').isVisible()
		){
			await page.locator('button:has-text("Cancel")').click()
	
		}
		await verifyIfTitleIsCorrect(page, 'Future IEP Forms')
		await clickElement(page, futureIepFormsPage.locators.COMMMENTS)
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.CURRENT_IEP)
		await page.waitForNavigation()

		await page.waitForLoadState('networkidle')
		if (
			await page.locator('button:has-text("View Current IEP")').isVisible() || await page.locator('button:has-text("Go to E-Signature")').isVisible()
		){
			await page.locator('button:has-text("Cancel")').click()
	
		}
		await verifyIfTitleIsCorrect(page, 'Current Affirmed Forms')
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.HISTORICAL_IEPS)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'Historical IEPs')
		await page.goBack()

		await page.waitForTimeout(400)
		if (
			await page.locator('button:has-text("View Current IEP")').isVisible() || await page.locator('button:has-text("Go to E-Signature")').isVisible()
		){
			await page.locator('button:has-text("Cancel")').click()
	
		}
		await clickElement(page, studentDemographicsPage.locators.Q_L)
		await clickElement(page, studentDemographicsPage.locators.PROGRESS_REPORTS)
		await page.waitForNavigation()
		await verifyIfTitleIsCorrect(page, 'Print Progress Reports')
	})

	test('Generate E-Signature Pre-meeting @HD-Test', async ({
		page,
		configs,
		request,
	}) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await page.waitForNavigation()
		await page.waitForLoadState('networkidle')
		await generateEsignaturePreMeeting(page)
		await validateEsignaturePage(page, configs, request)
	})

	test('Generate E-Signature Complete @HD-Test', async ({
		page,
		configs,
		request,
	}) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
		await page.waitForSelector(studentIepsPage.locators.TABLE)

		// Find students with no CALPADS errors
		await generateEsignatureCompleted(page, configs, request)

		// Get the studentId and filter the results
	})
})
