import { Page } from '@playwright/test'
import { actions } from '../../helpers'

const { clickElement, getTextContent } = actions

export const locators = {
	SHOW_ALL_BTN: "//*[@class='toggle-all']",
	FOLDER_TITLE: "//a[@ng-click='toggleOpen()']",
	SEARCH_INPUT: "//*[@id='Keyword']",
}

export const hasPageLoadedCorrectly = async (page: Page): Promise<boolean> => {
	await page.waitForSelector('#headerTitle')
	await clickElement(page, locators.FOLDER_TITLE);

	return (
		page.url().indexOf('documentlibrary') > -1 &&
		(await getTextContent(
			page,
			page.locator('#document-accordion th:nth-child(1)').nth(0)
		)) === 'Document Name' &&
		(await getTextContent(
			page,
			page.locator('#document-accordion th:nth-child(2)').nth(0)
		)) === 'Uploaded By/On' &&
		(await getTextContent(
			page,
			page.locator('#document-accordion th:nth-child(3)').nth(0)
		)) === 'Updated By/On'
	)
}
