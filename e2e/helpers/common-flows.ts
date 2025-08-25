import { Page } from '@playwright/test'
import { loginPage } from '../components/seis-home'
import Users from '../data/users.json'
import { seisHeaderComponent } from '../components/header'
import { waitForPageReady } from './layout'

const { locators } = seisHeaderComponent
const { loginAs, generateAccessToken } = loginPage



export const logOut = async (page: Page): Promise<void> => {
	// await waitForPageReady(page)
	// await page.locator(locators.LOG_OUT).click({ force: true })
}

export const loginTeacherRole = async (page: Page): Promise<void> => {
	const users = Users.role.teacher
	const idx = Math.floor(Math.random() * users.length)
	//console.log(users[idx])
	await loginAs(page, users[0])
	await waitForPageReady(page)
}

export const loginSiteRole = async (page: Page): Promise<void> => {
	const users = Users.role.site
	const idx = Math.floor(Math.random() * users.length)
	//console.log(users[idx])
	await loginAs(page, users[0])
	await waitForPageReady(page)
}

export const loginDistrictRole = async (page: Page): Promise<void> => {
	const users = Users.role.district
	const idx = Math.floor(Math.random() * users.length)
	//console.log(users[idx])
	await loginAs(page, users[0])
	await waitForPageReady(page)
}

export const loginSelpaRole = async (page: Page): Promise<void> => {
	const users = Users.role.selpa
	const idx = Math.floor(Math.random() * users.length)
	//console.log(users[idx])
	await loginAs(page, users[0])
	await waitForPageReady(page)
}

export const getTokenSelpaRole = async (request, baseApiUrl, env): Promise<string> => await generateAccessToken(request, {
	baseApiUrl: baseApiUrl,
	env: env,
	userName: Users.role.selpa[0]
})

