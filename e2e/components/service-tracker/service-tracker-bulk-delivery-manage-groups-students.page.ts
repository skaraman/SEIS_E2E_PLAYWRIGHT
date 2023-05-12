import { Page } from '@playwright/test'

export const locators = {
	EXISTING_STUDENTS_TABLE: '.panel table',
	DELIVERY_TABLE: '#Deliveries_wrapper table',
	RETURN_TO_BULK_DELIVERY_BTN: "//button[contains(text(),'Return to Bulk Delivery')]",
	DELETE_STUDENTS_BTN: "//button[contains(text(),'Delete Students')]"
}
