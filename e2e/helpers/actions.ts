import { Page, Locator, expect } from '@playwright/test'

export const clickElement = async (
	page: Page,
	locator: Locator | string
): Promise<void> => {
	if (typeof locator === 'string') {
		await page.click(locator)
	} else {
		await locator.click()
	}
}

export const enterTextField = async (
	page: Page,
	locator: Locator | string,
	value: string
): Promise<void> => {
	if (typeof locator === 'string') {
		await page.fill(locator, value)
	} else {
		await locator.fill(value)
	}
}

export const enterTextDateField = async (
	page: Page,
	locator: Locator | string,
	value: string
): Promise<void> => {
	if (typeof locator === 'string') {
		await page.type(locator, value)
	} else {
		await locator.type(value)
	}
}

export const getTextContent = async (
	page: Page,
	locator: Locator | string
): Promise<string> => {
	if (typeof locator === 'string') {
		return ((await page.locator(locator).textContent()) || '').trim()
	}

	return ((await locator.textContent()) || '').trim()
}

export const openWindow = async (
	page: Page,
	action: () => Promise<void>, 
	timeout:number=50000
): Promise<Page> => {
	const [newPage] = await Promise.all([
		page.waitForEvent('popup', {timeout}),
		await action(),
	])

	await newPage.waitForLoadState()

	return newPage
}
//THIS IS FOR DOCUMENT LIBRARY USES ONLY
export const openWindowForDocLibrary = async (
	page: Page,
	action: () => Promise<void>
): Promise<Page> => {
	const [newPage] = await Promise.all([
		page.waitForEvent('popup'),
		await action(),
	])
	return newPage
}

/* expect(printWindow.) */

export const goToUrl = async (page: Page, url: string) => {
	await page.goto(url, { waitUntil: 'commit' })
	await page.waitForLoadState('domcontentloaded')
}

export const getDataTableColumnValues = async (
	page: Page,
	locator: string,
	rowNumber: number
): Promise<Record<string, string>> => {
	let splitString = (text: string)=> text?.replace('\n', '').split('\t')
	let headers = splitString((await page.locator(locator).locator('.dataTables_scrollHead thead > tr').nth(0).allInnerTexts())[0])//.filter(x=> x.trim() != '')
	let columns = splitString((await page.locator(locator).locator('.dataTables_scrollBody tbody > tr').nth(1+rowNumber).allInnerTexts())[0])

	let result: Record<string, string> = {}
	if(!headers){return result}
	for (let i = 0; i < headers.length; i++) {
		result[headers[i]] = columns[i]
	}

	return result
}


export const getSimpleTableColumnValues = async (
	page: Page,
	locator: string,
	rowNumber: number
): Promise<Record<string, string>> => {
	let splitString = (text: string)=> text?.replace('\n', '').split('\t') || []
	let rows = await page
		.locator(locator).locator('tr')

	let headers = splitString((await rows.nth(0).allInnerTexts())[0])//.filter(x=> x.trim() != '')
	let columns = splitString((await rows.nth(1+rowNumber).allInnerTexts())[0])

	let result: Record<string, string> = {}
	for (let i = 0; i < headers.length; i++) {
		result[headers[i]] = columns[i]
	}

	return result
}

