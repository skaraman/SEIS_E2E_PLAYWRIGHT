import { test } from '../../../base'
import { loginSelpaRole, logOut } from '../../../helpers/common-flows'
import { goalsMenuDropDown } from '../../../components/navigation-bar'
import { verify, actions } from './../../../helpers'
import { searchGoalBanks } from '../../../components/goals'
import { verifyIfElementIsVisible } from '../../../helpers/verify'
import { verifyAcsaCarsGoals, verifyAuSpLanGoals } from '../../../components/goals/search-goal-banks.page'



const { verifyIfPageUrlIsCorrect } = verify
const { locators } = goalsMenuDropDown
const { clickElement } = actions

test.describe('SELPA > Goals Page Load Tests', () => {
	test.beforeEach(async ({ page, users }) => {
		await page.goto('/login')
		await loginSelpaRole(page)
	})

	test.afterEach(async ({ page }) => {
		await logOut(page)
	})

	test('search goals @HD-Test', async ({ page }) => {
		await clickElement(page, locators.GOALS)
		await clickElement(page, locators.SEARCH_GOAL_BANKS)
		await clickElement(page, searchGoalBanks.locators.ACSA_CARS_GOALS)
		await verifyAcsaCarsGoals(page)
		await clickElement(page, searchGoalBanks.locators.RETURN_TO_GOAL_LIBRARIES)
		await clickElement(page, searchGoalBanks.locators.AU_SP_LAN_GOALS)
		await verifyAuSpLanGoals(page)
	
	})

})