import { Page } from '@playwright/test'
import { loginPage } from '../components/seis-home'
import Users from '../data/users.json'
import { seisHeaderComponent } from '../components/header'
import { waitForPageReady } from './layout'

const { locators } = seisHeaderComponent
const { loginAs, generateAccessToken } = loginPage

// Track current index for each role
const userRoleIndices = {
	teacher: 0,
	site: 0,
	district: 0,
	selpa: 0
}

export const logOut = async (page: Page): Promise<void> => {
	await page.waitForSelector('.navbar')
	await page.locator(locators.LOG_OUT).click()
}

export const loginTeacherRole = async (page: Page): Promise<void> => {
	const users = Users.role.teacher
	const idx = userRoleIndices.teacher
	await loginAs(page, users[idx])
	userRoleIndices.teacher = (idx + 1) < users.length ? idx + 1 : 0
	await waitForPageReady(page)
}

export const loginSiteRole = async (page: Page): Promise<void> => {
	const users = Users.role.site
	const idx = userRoleIndices.site
	await loginAs(page, users[idx])
	userRoleIndices.site = (idx + 1) < users.length ? idx + 1 : 0
	await waitForPageReady(page)
}

export const loginDistrictRole = async (page: Page): Promise<void> => {
	const users = Users.role.district
	const idx = userRoleIndices.district
	await loginAs(page, users[idx])
	userRoleIndices.district = (idx + 1) < users.length ? idx + 1 : 0
	await waitForPageReady(page)
}

export const loginSelpaRole = async (page: Page): Promise<void> => {
	const users = Users.role.selpa
	const idx = userRoleIndices.selpa
	await loginAs(page, users[idx])
	userRoleIndices.selpa = (idx + 1) < users.length ? idx + 1 : 0
	await waitForPageReady(page)
}

export const getTokenSelpaRole = async (request, baseApiUrl, env): Promise<string> => await generateAccessToken(request, {
	baseApiUrl: baseApiUrl,
	env: env,
	userName: Users.role.selpa[0]
})

