import { Page, Locator, expect } from '@playwright/test'
import { log } from 'console';

// New helper function for print operations with robust waiting
export const waitForPrintOperation = async (page: Page, timeout: number = 60000): Promise<void> => {
  // Wait for any loading indicators to disappear
  try {
    await page.waitForSelector('h3:has-text("Loading")', { state: 'hidden', timeout: 10000 });
  } catch {
    // Continue if no loading indicator
  }
  
  // Wait for print queue indicators to appear and stabilize
  try {
    await page.waitForSelector('.toast-title', { timeout: 15000 });
    await page.waitForTimeout(2000); // Allow print queue to process
  } catch {
    // Continue if no toast notification
  }
  
  // Wait for network idle after print operation
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  await page.waitForTimeout(1000);
}

// Enhanced modal handling function
export const handleModalDialog = async (page: Page, expectedText?: string, actionButton?: string): Promise<boolean> => {
  try {
    // Wait for modal to appear
    const modal = page.locator('.modal-dialog');
    await modal.waitFor({ state: 'visible', timeout: 5000 });
    
    if (expectedText) {
      // Verify expected text is present
      await expect(modal).toContainText(expectedText);
    }
    
    if (actionButton) {
      // Click the specified action button
      await modal.getByRole('button', { name: actionButton }).click();
    }
    
    // Wait for modal to disappear
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
    return true;
  } catch {
    // Modal didn't appear or action failed
    return false;
  }
}

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
	
	// Enhanced wait strategy with retry logic
	const effectiveTimeout = timeout || 45000; // Increased default timeout
	await element.waitFor({ state: 'visible', timeout: effectiveTimeout })
	
	// Additional check for element to be enabled and interactable
	await expect(element).toBeEnabled({ timeout: 5000 })
	
	// Retry click with exponential backoff if it fails
	let attempts = 0;
	const maxAttempts = 3;
	while (attempts < maxAttempts) {
		try {
			await element.click()
			break;
		} catch (error) {
			attempts++;
			if (attempts === maxAttempts) {
				throw error;
			}
			await page.waitForTimeout(1000 * attempts); // Exponential backoff
		}
	}
	
	await page.waitForLoadState('networkidle', { timeout: 15000 })
	await page.waitForTimeout(1000) // Increased from 500ms to 1000ms
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