import { test, expect } from '../../../base'
import { clickElement, enterTextField } from '../../../helpers/actions'
import { loginTeacherRole, logOut } from '../../../helpers/common-flows'
import { studentsMenuDropDown } from '../../../components/navigation-bar'
import { currentIepFormsPage, futureIepFormsPage, iepGoalProgressTrackingPage, studentChangeFormPage, studentDemographicsPage, studentIepsPage } from '../../../components/students'
import { requestChangeAddress } from '../../../components/students/student-change-form.page'
import { selectEligibility, SelectGoalProgressTrackingIcn, selectPendingEligibility } from '../../../components/students/student-ieps.page'
import { fillOutGeneratedSSID, fillOutSSID } from '../../../components/students/student-demographics.page'
import { clickReturnToIeps } from '../../../components/students/future-iep-forms.page'
import { verifyIfElementIsVisible, verifyIfPageUrlIsCorrect } from '../../../helpers/verify'
import { affirmProgress, clickYes } from '../../../components/students/iep-goal-progress-tracking.page'
import { fillOutForm } from '../../../components/students/amendment.page'
import { addDrdp } from '../../../components/students/drdp.page'
import { waitForPageReady } from '../../../helpers/layout'

test.describe('TEACHER > Students HD Tests', () => {
  test.beforeEach(async ({ page, users }) => {
    await page.goto('/login')
    await loginTeacherRole(page)
  })
  test.afterEach(async ({ page }) => {
    await logOut(page)
  })

  test('Student Change Form @HD-Test', async ({ page }) => {
    await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
    await clickElement(page, studentsMenuDropDown.locators.STUDENT_CHANGE_FORM)
    await clickElement(page, studentChangeFormPage.locators.SELECT_STUDENT)
    await requestChangeAddress(page)
  })

  test('Edit Student Record @HD-Test', async ({ page }) => {
    await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
    await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
    await page.waitForSelector(studentIepsPage.locators.TABLE, { state: 'visible' })
    await waitForPageReady(page) // Enhanced waiting after table loads
    await selectPendingEligibility(page)
    await waitForPageReady(page) // Wait after eligibility selection
    await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
    await waitForPageReady(page) // Wait for future IEPs page to load
    await clickElement(page, futureIepFormsPage.locators.QUICK_LINKS)
    await clickElement(page, studentIepsPage.locators.EDIT_STUDENT_RECORD)
    // Enhanced save button handling with better waiting
    const saveBtn = page.locator('#btnSaveForm');
    await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
    await expect(saveBtn).toHaveClass(/btn.*btn-primary/)
    const ssid = await fillOutSSID(page)
    await waitForPageReady(page) // Wait after SSID filling
    // Wait for button class to change
    await expect(saveBtn).toHaveClass(/btn.*btn-warning/, { timeout: 10000 })
    await clickElement(page, saveBtn)
    await waitForPageReady(page) // Wait after save
    // Navigate back to student search
    await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
    await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
    await waitForPageReady(page) // Wait for page to load
    await fillOutGeneratedSSID(page, ssid)
    await clickElement(page, page.getByRole('button', { name: 'Find' }));
    // Enhanced verification with timeout
    const ssidCell = page.getByRole('gridcell', { name: `${ssid}` });
    await ssidCell.waitFor({ state: 'visible', timeout: 15000 });
    await expect(ssidCell).toBeVisible();
  })

  test.skip('Students Iep Progress Reports Affirm @HD-Test', async ({ page }) => {
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
    await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
    await page.waitForSelector(futureIepFormsPage.locators.QUICK_LINKS)
    await verifyIfElementIsVisible(page, futureIepFormsPage.locators.QUICK_LINKS)
    await clickElement(page, futureIepFormsPage.locators.COMMENTS)
  })

  test.skip('Students Iep Amendment Affirm @HD-Test', async ({ page }) => {
    await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
    await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
    await page.waitForSelector(studentIepsPage.locators.TABLE)
    await selectEligibility(page)
    await clickElement(page, studentIepsPage.locators.CURRENT_IEPS)
    await page.waitForSelector(currentIepFormsPage.locators.QUICK_LINKS)
    await verifyIfElementIsVisible(page, futureIepFormsPage.locators.QUICK_LINKS)
    await clickElement(page, currentIepFormsPage.locators.COMMENTS)
    await clickElement(page, currentIepFormsPage.locators.ADD_COMMENT)
    await enterTextField(page, futureIepFormsPage.locators.TEXT_AREA, 'Current Iep Comment Should Remain after Amendment Affirm')
    await clickElement(page, currentIepFormsPage.locators.SAVE_BTN)
    await clickElement(page, page.locator("text=Amendments").nth(1))
    if (await page.locator("#amendments-list [title='Delete']").nth(0).isVisible()) {
      await clickElement(page, page.locator("#amendments-list [title='Delete']"))
      await clickElement(page, "[data-bb-handler='success']")
    }
    await clickElement(page, currentIepFormsPage.locators.ADD_AMENDMENT)
    await fillOutForm(page)
  })

  test('Add/Print DRDP @HD-Test', async ({ page }) => {
    await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
    await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
    await page.waitForSelector(studentIepsPage.locators.TABLE, { state: 'visible' })
    await waitForPageReady(page) // Enhanced waiting after table loads
    await selectEligibility(page)
    await waitForPageReady(page) // Wait after eligibility selection
    await clickElement(page, studentIepsPage.locators.DRDP)
    await waitForPageReady(page) // Wait for DRDP page to load
    await addDrdp(page)
    await waitForPageReady(page) // Wait after adding DRDP
    // Enhanced delete operation with better waiting
    const deleteButton = page.locator("[title='Delete']").first();
    await deleteButton.waitFor({ state: 'visible', timeout: 15000 });
    await deleteButton.click();
    // Enhanced confirmation dialog handling
    const confirmButton = page.getByRole('button', { name: 'Yes' });
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    await waitForPageReady(page); // Wait after deletion
  })
})
