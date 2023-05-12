import { Page } from '@playwright/test'
import { actions } from '../../helpers'

const { enterTextField } = actions

export const locators = {
	FIRST_NAME_INPUT: '#firstName',
	LAST_NAME_INPUT: '#lastName',
	CITY_INPUT: '#city',
	STATE_INPUT: '#s2id_state',
	SEARCH_BTN: "//button[contains(text(),'Search')]",
	CANCEL_BTN: "//button[contains(text(),'Cancel')]",
}

export const searchNpiProvider = async (page: Page) => {
	//await enterTextField(page, )
}
