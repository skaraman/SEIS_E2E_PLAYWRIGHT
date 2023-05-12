import { Page } from '@playwright/test'
import { loginPage } from '../components/seis-home'
import Users from '../data/users.json'
import { seisHeaderComponent } from '../components/header'

const { locators } = seisHeaderComponent
const { loginAs, generateAccessToken } = loginPage

export const logOut = async (page: Page): Promise<void> => {
	await page.waitForSelector('.navbar')
	await page.locator(locators.LOG_OUT).click()
}

export const loginTeacherRole = async (page: Page): Promise<void> => {
	await loginAs(page, Users.role.teacher[0])
}

export const loginSiteRole = async (page: Page): Promise<void> => {
	await loginAs(page, Users.role.site[0])
}

export const loginDistrictRole = async (page: Page): Promise<void> => {
	await loginAs(page, Users.role.district[0])
}

export const loginSelpaRole = async (page: Page): Promise<void> => {
	await loginAs(page, Users.role.selpa[0])
}

export const getTokenSelpaRole = async (request, baseApiUrl, env): Promise<string> => await generateAccessToken(request, {
	baseApiUrl: baseApiUrl,
	env: env,
	userName: Users.role.selpa[0]
})

