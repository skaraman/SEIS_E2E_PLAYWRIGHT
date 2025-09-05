import { Page } from '@playwright/test'
import { clickElement } from '../../helpers/actions'

export const locators = {
	LETTER_A: "letterA",
	LAST_NAME: "LastName",
	ELIGIBILITY: "s2id_Status",
	FUTURE_IEPS: "[title='Future IEP']",
	CURRENT_IEPS: "[title='Current IEP']",
	DRDP: "[title='DRDP']",
	PRINT_PROGRESS: "[title='Print Progress']",
	QUICK_LINKS: "button:has-text('Quick Links')",
	TABLE: ".table",
	COMMENTS: "text=comments",
	ADD_COMMENT: "text=Add Comment",
	TEXT_AREA: "textArea",
	SAVE_BTN: "#saveBtn",
	GOAl_PROGRESS_TRACKING: "[title='Goal Progress and Tracking']",
	EDIT_STUDENT_RECORD: "[title='Edit Student Record']",
	//FILTER
	SEIS_ID: "[id='SeisID']",
	SSID_FILTER: "[id='Ssid']"

}
/* 	IEP GOAL POGRESS SUMMARY PAGE
	//a[contains(text(),'Affirm Progress Report')] */

export const selectEligibility = async (page: Page): Promise<void> => {
	await clickElement(page, page.getByRole('link', { name: 'Select One' }).nth(1));
	await clickElement(page, page.getByRole('option', { name: 'Eligible' }));
}

export const selectPendingEligibility = async (page: Page): Promise<void> => {
	await clickElement(page, page.getByRole('link', { name: 'Select One' }).nth(1));
	await clickElement(page, page.getByRole('option', { name: 'Pending' }));
}

export const SelectGoalProgressTrackingIcn = async (page: Page): Promise<void> => {
	await clickElement(page, page.getByRole('gridcell', { name: ' ' }).getByRole('link', { name: '' }));
}

