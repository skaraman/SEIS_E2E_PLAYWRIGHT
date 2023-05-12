import { Page } from '@playwright/test'

export const locators = {
	HEADER_H1: "//h1[contains(text(),'Bulk Delivery')]",
	RETURN_TO_DELIVERIES_BTN: "//a[contains(text(),'Return to Deliveries')]",
	ROW: 'table > tbody > tr.ng-scope',
	ADD_GROUP_BTN: '[title="Edit Group"]',
	EDIT_GROUP: '#find',
	BULK_DELIVER_TO_GROUP: '[title="Bulk Deliver to Group"]',
	EDIT_STUDENTS: '[title="Edit Students"]',
	DELETE_GROUP: '[title="Delete Service Group"]',
	GROUPS_TABLE: '.table'
}
