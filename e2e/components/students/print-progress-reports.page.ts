import { Page, expect } from "@playwright/test";
import { clickElement, openWindow } from "../../helpers/actions";


export const locators = {
	PRINT_BTN: "[title='View/Print']",

	//PROGRESS REPORT PAGE
	PREVIEW_ICN: "[title='Preview Form']",
	PRINT_FORM_ICN: "[title='View/Print Form']",
	PRINT_OPTIONS_PRINT_BTN: "button.btn-primary:text('Print')"

}


	export const clickReturnToIeps = async (page: Page): Promise<void> => {
		await page.locator('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' }).click();
	}
