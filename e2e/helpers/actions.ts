import { Page, Locator, expect } from '@playwright/test'
import { log } from 'console';

export const clickElement = async (page: Page, locator: any, index: number = 0, mode: 'text' | 'role' | 'locator' | 'direct' = 'locator', timeout: number = undefined): Promise<void> => {
	await page.waitForLoadState('networkidle')
	let element;
	if (typeof locator === 'string') {
		if (mode === 'text') {
			const byText = page.getByText(locator, { exact: true })
			if (await byText.count() > 0) {
				element = byText.nth(index)
			}
		} else if (mode === 'role') {
			const parts = locator.trim().split(/\s+/)
			if (parts.length > 1) {
				const role = parts[0]
				const name = parts.slice(1).join(' ')
				const byRole = page.getByRole(role as any, { name, exact: true })
				if (await byRole.count() > 0) {
					element = byRole.nth(index)
				}
			}
		} else if (mode === 'locator') {
			element = page.locator(locator).nth(index)
		}
	} else {
		// mode === 'direct' or locator is already a Locator
		element = locator.nth(index)
	}
	await element.waitFor({ state: 'visible', timeout: timeout })
	await element.click()
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(500)
}

export const enterTextField = async (page: Page, locator: Locator | string, value: string): Promise<void> => {
	if (typeof locator === 'string') {
		await page.fill(locator, value)
	} else {
		await locator.fill(value)
	}
}

export const enterTextDateField = async (page: Page, locator: Locator | string, value: string): Promise<void> => {
	if (typeof locator === 'string') {
		await page.type(locator, value)
	} else {
		await locator.type(value)
	}
}

export const getTextContent = async (page: Page, locator: Locator | string): Promise<string> => {
	if (typeof locator === 'string') {
		return ((await page.locator(locator).textContent()) || '').trim()
	}
	return ((await locator.textContent()) || '').trim()
}

export const openWindow = async (page: Page, action: () => Promise<void>, timeout: number = 50000): Promise<Page> => {
	const [newPage] = await Promise.all([
		page.waitForEvent('popup', { timeout }),
		action()
	])
	await newPage.waitForLoadState()
	return newPage
}
//THIS IS FOR DOCUMENT LIBRARY USES ONLY
export const openWindowForDocLibrary = async (page: Page, action: () => Promise<void>): Promise<Page> => {
	const [newPage] = await Promise.all([
		page.waitForEvent('popup'),
		action()
	])
	return newPage
}

/* expect(printWindow.) */

export const goToUrl = async (page: Page, url: string) => {
	await page.goto(url, { waitUntil: 'commit' })
	await page.waitForLoadState('domcontentloaded')
}

export const getDataTableColumnValues = async (page: Page, locator: string, rowNumber: number): Promise<Record<string, string>> => {
	let splitString = (text: string) => text?.replace('\n', '').split('\t')
	let headers = splitString((await page.locator(locator).locator('.dataTables_scrollHead thead > tr').nth(0).allInnerTexts())[0])//.filter(x=> x.trim() != '')
	let columns = splitString((await page.locator(locator).locator('.dataTables_scrollBody tbody > tr').nth(1 + rowNumber).allInnerTexts())[0])
	let result: Record<string, string> = {}
	if (!headers) { return result }
	for (let i = 0; i < headers.length; i++) {
		result[headers[i]] = columns[i]
	}
	return result
}


export const getSimpleTableColumnValues = async (page: Page, locator: string, rowNumber: number): Promise<Record<string, string>> => {
	let splitString = (text: string) => text?.replace('\n', '').split('\t') || []
	let rows = await page.locator(locator).locator('tr')
	let headers = splitString((await rows.nth(0).allInnerTexts())[0])//.filter(x=> x.trim() != '')
	let columns = splitString((await rows.nth(1 + rowNumber).allInnerTexts())[0])
	let result: Record<string, string> = {}
	for (let i = 0; i < headers.length; i++) {
		result[headers[i]] = columns[i]
	}
	return result
}