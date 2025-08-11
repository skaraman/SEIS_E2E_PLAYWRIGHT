import { Page } from '@playwright/test'
import { FollowUp, MeetingAlerts, TeacherRequests } from '../../seisEnums'
import { actions } from '../../helpers'

const { clickElement } = actions

export const locators = {
	MAIN_VIEW: '#main-view',
	LOCAL_NEWS: 'text= Local News',
}

export const clickTeacherRequests = async (
	page: Page,
	teacherRequests: TeacherRequests
): Promise<void> => {
	let key = ''
	switch (teacherRequests) {
		case TeacherRequests.AddRequests:
			key = 'StudentsToAdd'
			break
		case TeacherRequests.EligibilityChanges:
			key = 'StudentsEligibilityChanges'
			break
		case TeacherRequests.ExitRequests:
			key = 'StudentsToExit'
			break
		case TeacherRequests.RecordChanges:
			key = 'StudentRecordChanges'
			break
		case TeacherRequests.CalpadsTransactionsChanges:
			key = 'CalpadsTransactionsChangesTeacher'
			break
		case TeacherRequests.AddressChanges:
			key = 'StudentAddressChanges'
			break
	}

	await clickElement(page, `//dashboard-alert[@key='${key}']/div`)
	await page.waitForSelector('h1')
}

export const clickFollowUp = async (
	page: Page,
	followUp: FollowUp
): Promise<void> => {
	let key = ''
	switch (followUp) {
		case FollowUp.UnaffirmedIeps:
			key = 'Unaffirmed IEPs'
			break
		case FollowUp.UnaffirmedAmendments:
			key = 'Unaffirmed Amendments'
			break
		case FollowUp.UnsignedIeps:
			key = 'Unsigned IEPs'
			break
	}

	await clickElement(page, `//dashboard-followup//div[text()='${key}']`)
	await page.waitForSelector('h1')
}

export const clickMeetingAlerts = async (
	page: Page,
	alerts: MeetingAlerts
): Promise<void> => {
	let key = ''
	switch (alerts) {
		case MeetingAlerts.NextAnnual30Days:
			key = 'Next Annual Plan Review'
			break
		case MeetingAlerts.NextTri75Days:
			key = 'Next Reevaluation'
			break
		case MeetingAlerts.InitialEvaluations:
			key = 'Initial Evaluations'
			break
		case MeetingAlerts.Days30Review:
			key = '30-Day Reviews'
			break
	}

	await clickElement(page, `text='${key}'`)
	await page.waitForSelector('h1')
}
