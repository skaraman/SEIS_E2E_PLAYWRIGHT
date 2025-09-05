import { Page } from '@playwright/test'
import { loginPage } from '../components/seis-home'
import Users from '../data/users.json'
import { waitForPageReady } from './layout'
import { log } from 'console'

const { loginAs, generateAccessToken } = loginPage

export const logOut = async (page: Page): Promise<void> => {
	// await waitForPageReady(page)
	// await page.locator(locators.LOG_OUT).click({ force: true })
}

export const loginTeacherRole = async (page: Page): Promise<void> => {
	login(page, 'teacher')
}

export const loginSiteRole = async (page: Page): Promise<void> => {
	login(page, 'site')
}

export const loginDistrictRole = async (page: Page): Promise<void> => {
	login(page, 'district')
}

export const loginSelpaRole = async (page: Page): Promise<void> => {
	login(page, 'selpa')
}

const login = async (page: Page, role: string): Promise<void> => {
	const users = Users.role[role]
	const idx = Math.floor(Math.random() * users.length)
	log(`Logging in as ${role} user: ${users[idx]}`)
	await loginAs(page, users[idx])
	await waitForPageReady(page)
}

export const getTokenSelpaRole = async (request, baseApiUrl, env): Promise<string> => await generateAccessToken(request, {
	baseApiUrl: baseApiUrl,
	env: env,
	userName: Users.role.selpa[0]
})

