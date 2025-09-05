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
	await login(page, 'teacher')
}

export const loginSiteRole = async (page: Page): Promise<void> => {
	await login(page, 'site')
}

export const loginDistrictRole = async (page: Page): Promise<void> => {
	await login(page, 'district')
}

export const loginSelpaRole = async (page: Page, idx: string = null): Promise<void> => {
	await login(page, 'selpa', idx)
}

const login = async (page: Page, role: string, idx: string = null): Promise<void> => {
	const users = Users.role[role]
	const rdx = Math.floor(Math.random() * users.length)
	log(`Logging in as ${role} user: ${users[idx || rdx]}`)
	await loginAs(page, users[idx || rdx])
	await waitForPageReady(page)
}

export const getTokenSelpaRole = async (request, baseApiUrl, env): Promise<string> => await generateAccessToken(request, {
	baseApiUrl: baseApiUrl,
	env: env,
	userName: Users.role.selpa[0]
})

