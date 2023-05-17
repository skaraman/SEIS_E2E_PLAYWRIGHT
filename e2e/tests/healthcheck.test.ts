import { test } from "../base";
import { expect } from "@playwright/test";
import { seisHeaderComponent } from '../components/header'
import { dashboardPage } from "../components/dashboard";
import { studentsMenuDropDown } from "../components/navigation-bar";
import { currentIepFormsPage, futureIepFormsPage, studentChangeFormPage, studentIepsPage } from "../components/students";
import { requestChangeAddress } from "../components/students/student-change-form.page";
import { clickElement, openWindow } from "../helpers/actions";
import { loginSelpaRole, loginTeacherRole, logOut } from "../helpers/common-flows";
import { clickFollowUp, clickMeetingAlerts } from "../components/dashboard/dashboard.page";
import { FollowUp, MeetingAlerts } from "../seisEnums";
import { verifyIfPageUrlIsCorrect, verifyIfTitleIsCorrect } from "../helpers/verify";
import { unaffirmedIepPage } from '../components/dashboard'
import { selectEligibility } from "../components/students/student-ieps.page";
import { printAllFormsCurrentIep } from "../components/students/current-iep-forms.page";


const { locators } = seisHeaderComponent

test.describe("Checks", () => {
  test.beforeEach(async ({ page, users }) => {
    await page.goto("/login");
    await loginSelpaRole(page);
  });
  test.afterEach(async ({ page }) => {
    await logOut(page);
  });
  
  test('dashboard follow up verify @Health-Check', async ({ page }) => {
	// Unaffirmed IEP
	await clickFollowUp(page, FollowUp.UnaffirmedIeps)
	await verifyIfTitleIsCorrect(page, 'Unaffirmed IEPs')
	await clickElement(page, locators.LOGO_ICN)

	// Unaffirmed amendments
	await clickFollowUp(page, FollowUp.UnaffirmedAmendments)
	await verifyIfTitleIsCorrect(page, 'Unaffirmed Amendments')
	await clickElement(page, locators.LOGO_ICN)

	// Unsigned IEPs
	await clickFollowUp(page, FollowUp.UnsignedIeps)
	await verifyIfTitleIsCorrect(page, 'Unsigned IEPs')
})

test('dashboard meeting alerts verify @Health-Check', async ({
	page,
}) => {
	// Next annual 30 days
	await clickMeetingAlerts(page, MeetingAlerts.NextAnnual30Days)
	await verifyIfTitleIsCorrect(page, 'Next Annual Plan Review')
	await clickElement(page, locators.LOGO_ICN)

	// Next tri 75 days
	await clickMeetingAlerts(page, MeetingAlerts.NextTri75Days)
	await verifyIfTitleIsCorrect(page, 'Next Eligibility Evaluation')
	await clickElement(page, locators.LOGO_ICN)

	// Initial evaluations
	await clickMeetingAlerts(page, MeetingAlerts.InitialEvaluations)
	await verifyIfTitleIsCorrect(page, 'Initial Evaluations')
	await clickElement(page, locators.LOGO_ICN)

	// // Next 30 days review
	await clickMeetingAlerts(page, MeetingAlerts.Days30Review)
	await verifyIfTitleIsCorrect(page, '30-Day Reviews')
})

test('dashboard unaffirmed ieps help guide verify @Health-Check', async ({
	page,
}) => {
	await clickFollowUp(page, FollowUp.UnaffirmedIeps)
	await verifyIfTitleIsCorrect(page, 'Unaffirmed IEPs')

	const newPage = await openWindow(page, async () => {
		clickElement(page, unaffirmedIepPage.locators.HELP_GUIDE)
	})

	test.expect(newPage).toHaveURL(/helpguides/)
})

test('Future Ieps Preview Form @Health-Check', async ({ page }) => {
	await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
	await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
	await page.waitForSelector(studentIepsPage.locators.TABLE)
	await selectEligibility(page)
	await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
	if (
		await page.locator('button:has-text("View Current IEP")').isVisible()
	){
		await page.locator('button:has-text("Cancel")').click()

	}
	await clickElement(page, futureIepFormsPage.locators.PREVIEW_FORM)
	const [page1] = await Promise.all([page.waitForEvent('popup')])
	await verifyIfPageUrlIsCorrect(page1, '/print-pdf')
})

test('verify dashboard api @Health-Check', async ({ page, request, configs}) => {
const announcementsApiUrl = `${configs.apiBaseUrl}/api/home/announcements`

	const announcements = await request.get(announcementsApiUrl);
	expect(announcements.status()).toEqual(200)


  const carouselApiUrl = `${configs.apiBaseUrl}/api/home/carousel`

	const carousel = await request.get(carouselApiUrl);
	expect(carousel.status()).toEqual(200)


console.log(carousel.status())
		
})

test('Print Future Ieps Form @Health-Check', async ({ page }) => {
	await clickElement(page, studentsMenuDropDown.locators.STUDENTS)
	await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS)
	await page.waitForSelector(studentIepsPage.locators.TABLE)
	await selectEligibility(page)
	await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
	if (
		await page.locator('button:has-text("View Current IEP")').isVisible()
	){
		await page.locator('button:has-text("Cancel")').click()

	}
	await clickElement(page, futureIepFormsPage.locators.EDIT_FORM)
	await page.getByText('Print English Spanish').click();
   await  page.getByText('English').click()
   const [page1] = await Promise.all([page.waitForEvent('popup')])
   await verifyIfPageUrlIsCorrect(page1, '/print-pdf')
  
  


})
})