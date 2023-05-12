import { Page } from '@playwright/test'

export const locators = {
	VIEW_SERVICE_TRACKER_ICON: "//*[@title='View Service Track'][1]",
	FIND_BTN: "text=Find",
	SHOW_ALL_BTN: '#showAll',
}

export const clickViewServiceTrackerIcn = async (
	page: Page,
	providerType: string
): Promise<void> => {
	page.click(
		`//td[contains(text(),'${providerType}')]/parent::tr//a[@title='View Service Track']`
	)
}
