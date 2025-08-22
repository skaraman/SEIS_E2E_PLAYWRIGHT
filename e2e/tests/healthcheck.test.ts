import { test } from "../base"
import { expect } from "@playwright/test"
import { seisHeaderComponent } from '../components/header'
import { studentsMenuDropDown } from "../components/navigation-bar"
import { futureIepFormsPage, studentIepsPage } from "../components/students"
import { clickElement, openWindow } from "../helpers/actions"
import { loginSelpaRole, logOut } from "../helpers/common-flows"
import { clickFollowUp, clickMeetingAlerts } from "../components/dashboard/dashboard.page"
import { FollowUp, MeetingAlerts } from "../seisEnums"
import { verifyFileDownload, verifyIfTitleIsCorrect } from "../helpers/verify"
import { unaffirmedIepPage } from '../components/dashboard'
import { selectEligibility } from "../components/students/student-ieps.page"

const { locators } = seisHeaderComponent

test.describe("Checks", () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto("/login")
		await loginSelpaRole(page)
	})
	
	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

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

	test('dashboard meeting alerts verify @Health-Check', async ({ page }) => {
		// Next annual 30 days
		await clickMeetingAlerts(page, MeetingAlerts.NextAnnual30Days)
		await verifyIfTitleIsCorrect(page, 'Next Annual Plan Review')
		await clickElement(page, locators.LOGO_ICN)
		// Next tri 75 days
		await clickMeetingAlerts(page, MeetingAlerts.NextTri75Days)
		await verifyIfTitleIsCorrect(page, 'Next Reevaluation')
		await clickElement(page, locators.LOGO_ICN)
		// Initial evaluations
		await clickMeetingAlerts(page, MeetingAlerts.InitialEvaluations)
		await verifyIfTitleIsCorrect(page, 'Initial Evaluations')
		await clickElement(page, locators.LOGO_ICN)
		// // Next 30 days review
		await clickMeetingAlerts(page, MeetingAlerts.Days30Review)
		await verifyIfTitleIsCorrect(page, '30-Day Reviews')
	})

	test('dashboard unaffirmed ieps help guide verify @Health-Check', async ({ page }) => {
		await clickFollowUp(page, FollowUp.UnaffirmedIeps)
		await verifyIfTitleIsCorrect(page, 'Unaffirmed IEPs')
		const newPage = await openWindow(page, async () => {
			clickElement(page, unaffirmedIepPage.locators.HELP_GUIDE)
		})
		test.expect(newPage).toHaveURL(/helpguides/)
	})

	test('Future Ieps Preview Form @Health-Check', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await page.waitForLoadState('networkidle')
		const [viewVisible, esigVisible] = await Promise.all([
				page.locator('button:has-text("View Current IEP")').isVisible(),
				page.locator('button:has-text("Go to E-Signature")').isVisible()
		]);
		if (viewVisible || esigVisible) {
				await page.locator('button:has-text("Cancel")').first().click({ force: true });
		}
		await page.waitForTimeout(6000)
		await page.locator("[title='Preview Form']").first().click()
		await verifyFileDownload(page)
	})

	test('verify dashboard api @Health-Check', async ({ page, request }, configs) => {
		const announcementsApiUrl = `${configs.project.use.config.apiBaseUrl}/api/home/announcements`
		const announcements = await request.get(announcementsApiUrl)
		expect(announcements.status()).toEqual(200)
		const carouselApiUrl = `${configs.project.use.config.apiBaseUrl}/api/home/carousel`
		const carousel = await request.get(carouselApiUrl)
		expect(carousel.status()).toEqual(200)
	})

	test('Print Future Ieps Form @Health-Check', async ({ page }) => {
		await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
		await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
		await page.waitForSelector(studentIepsPage.locators.TABLE)
		await selectEligibility(page)
		await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
		await page.waitForLoadState('networkidle')
		const [viewVisible, esigVisible] = await Promise.all([
			page.locator('button:has-text("View Current IEP")').isVisible(),
			page.locator('button:has-text("Go to E-Signature")').isVisible()
		]);
		if (viewVisible || esigVisible) {
			await page.locator('button:has-text("Cancel")').first().click({ force: true });
		}
		await clickElement(page, futureIepFormsPage.locators.EDIT_FORM)
		await page.getByText('Print English Spanish').click()
		await page.getByText('English').click()
		await verifyFileDownload(page)
	})
})