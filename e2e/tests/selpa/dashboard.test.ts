import { test } from '../../base'
import { loginSelpaRole, logOut } from '../../helpers/common-flows'
import { FollowUp, MeetingAlerts, TeacherRequests } from '../../seisEnums'
import { seisHeaderComponent } from '../../components/header'
import { dashboardPage } from '../../components/dashboard'
import { unaffirmedIepPage } from '../../components/dashboard'
import { actions, verify } from '../../helpers'

const { verifyIfTitleIsCorrect } = verify
const { openWindow, clickElement } = actions
const { locators } = seisHeaderComponent
const { clickTeacherRequests, clickFollowUp, clickMeetingAlerts } =
	dashboardPage

test.describe('SELPA > Dashboard Tests @HD-Test-Debug', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('dashboard teacher requests verify', async ({ page }) => {
		// Add changes
		await clickTeacherRequests(page, TeacherRequests.AddRequests)
		await verifyIfTitleIsCorrect(page, 'Add Requests')
		await clickElement(page, locators.LOGO_ICN)

		// // Eligibility changes
		await clickTeacherRequests(page, TeacherRequests.EligibilityChanges)
		await verifyIfTitleIsCorrect(page, 'Eligibility Changes')
		await clickElement(page, locators.LOGO_ICN)

		// Exit requests
		await clickTeacherRequests(page, TeacherRequests.ExitRequests)
		await verifyIfTitleIsCorrect(page, 'Exit Requests')
		await clickElement(page, locators.LOGO_ICN)

		// Calpads transaction changes

		await clickTeacherRequests(page, TeacherRequests.CalpadsTransactionsChanges)
		await verifyIfTitleIsCorrect(page, 'IEP Update Requests')
		await clickElement(page, locators.LOGO_ICN)

		// Record changes
		await clickTeacherRequests(page, TeacherRequests.RecordChanges)
		await verifyIfTitleIsCorrect(page, 'Record Changes')
		await clickElement(page, locators.LOGO_ICN)

		// Address changes
		await clickTeacherRequests(page, TeacherRequests.AddressChanges)
		await verifyIfTitleIsCorrect(page, 'Address Changes')
	})


})
