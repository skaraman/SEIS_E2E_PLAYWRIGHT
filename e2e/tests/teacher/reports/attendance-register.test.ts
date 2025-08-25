import { test } from '../../../base'
import { clickElement } from '../../../helpers/actions'
import { loginTeacherRole, logOut } from '../../../helpers/common-flows'
import { locators } from '../../../components/navigation-bar/students-menu-drop-down'
import { reportsDropDown, studentsMenuDropDown } from '../../../components/navigation-bar'
import { studentChangeFormPage } from '../../../components/students'
import { requestChangeAddress } from '../../../components/students/student-change-form.page'
import { generateAttendanceRegister } from '../../../components/reports/attendace-register.page'



test.describe('TEACHER > Reports HD Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginTeacherRole(page)
	})
	test.afterEach(async ({ page }) => {
		await logOut(page)
	})
	test('Attendance Register @HD-Test', async ({ page }) => {
		await clickElement(page, reportsDropDown.locators.REPORTS)
		await clickElement(page, reportsDropDown.locators.ATTENDANCE_REGISTER)
		await generateAttendanceRegister(page)
	})

})

