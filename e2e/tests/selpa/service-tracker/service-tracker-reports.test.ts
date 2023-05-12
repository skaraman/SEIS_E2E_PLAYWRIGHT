import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import {
	providersPage,
	providersDashboardPage,
	providersDeliveriesPage,
	bulkDeliveryManageGroupsPage,
	bulkDeliveryManageGroupsStudentsPage,
	bulkDeliveryDeliverPage
} from '../../../components/service-tracker'
import { verify, actions } from './../../../helpers'
import { serviceTrackerMenuDropDownComponent } from '../../../components/navigation-bar'

const { verifyIfElementIsVisible, verifyTableHeaderColumns } = verify
const { locators } = serviceTrackerMenuDropDownComponent
const { clickElement, getDataTableColumnValues, getSimpleTableColumnValues, enterTextField } = actions
const { clickViewServiceTrackerIcn } = providersPage
const {} = providersDashboardPage

test.describe('SELPA > Service Tracker Reports Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test.skip('service tracker provider bulk delivery with npi @HD-Test', async ({
		page,
	}) => {
		await clickElement(page, locators.SERVICE_TRACKER)
		await clickElement(page, locators.PROVIDERS)

		await clickViewServiceTrackerIcn(page, 'Teacher - Speech Therapy')
		await clickElement(page, providersDashboardPage.locators.DELIVERIES_BTN)
		await page.waitForSelector(
			providersDeliveriesPage.locators.DELIVERIES_TABLE_WRAPPER
		)
		await verifyTableHeaderColumns(page, [
			'Name',
			'Service',
			'SEIS ID',
			'Service',
			'Delivery',
			'Start Date',
			'End Date',
			'Sessions / Frequency',
			'Total Minutes (min/year)',
		])

		await clickElement(page, providersDeliveriesPage.locators.BULK_DELIVERY_BTN)

		// Find group info from manage groups page
		await page.waitForSelector(bulkDeliveryManageGroupsPage.locators.HEADER_H1)
		const bulkDeliveryGroupsColumns = await getSimpleTableColumnValues(
			page,
			'.table',
			0
		)

		const service = bulkDeliveryGroupsColumns['Service']
		const delivery = bulkDeliveryGroupsColumns['Delivery']

		// Edit group students and pick a student to deliver to
		await clickElement(page, page.locator(bulkDeliveryManageGroupsPage.locators.EDIT_STUDENTS).nth(0))
		await page.waitForSelector(bulkDeliveryManageGroupsStudentsPage.locators.EXISTING_STUDENTS_TABLE)
		const existingGroupStudentsColumns = await getSimpleTableColumnValues(
			page,
			bulkDeliveryManageGroupsStudentsPage.locators.EXISTING_STUDENTS_TABLE,
			0
		)
		const studentId = existingGroupStudentsColumns['SEIS ID']

		// Look at current deliveries for the group
		await page.waitForSelector(bulkDeliveryManageGroupsStudentsPage.locators.DELIVERY_TABLE)
		const rows = page.locator('.dataTables_scrollBody tbody tr')
		let foundIndex = -1
		for (let i = 0; i < await rows.count(); i++){
			const rowMatch = page.locator('td', { has: page.locator(`text="${studentId}"`) })
			if (rowMatch != null){
				foundIndex = i
				break
			}
		}
		const deliveriesColumns = await getDataTableColumnValues(page, bulkDeliveryManageGroupsStudentsPage.locators.DELIVERY_TABLE, foundIndex)
		const startDate = deliveriesColumns['Start Date']

		console.log({ studentId, startDate, foundIndex })

		// Return to manage bulk delivery groups
		await clickElement(page, page.locator(bulkDeliveryManageGroupsStudentsPage.locators.RETURN_TO_BULK_DELIVERY_BTN))
		await page.waitForSelector(bulkDeliveryManageGroupsPage.locators.GROUPS_TABLE)

		// Bulk deliver to group
		await clickElement(page, page.locator(bulkDeliveryManageGroupsPage.locators.BULK_DELIVER_TO_GROUP))
		await page.waitForSelector(bulkDeliveryDeliverPage.locators.HEADER_H1)

		// Visit date
		await enterTextField(page, bulkDeliveryDeliverPage.locators.CLAIMS_DATE_INPUT, startDate)

		// Attendance code
		await clickElement(page, page.locator('#s2id_attendanceCode').getByRole('link', { name: '--Select One--' }))
		await clickElement(page, page.getByRole('option', { name: 'Delivered' }))
	})
})
