import { expect, Locator, Page } from '@playwright/test'
import { getTextContent } from './actions'

// Module-scoped variable to store the download URL
let downloadUrl: string = '';

export const addDownloadListener = async (page: Page): Promise<() => void> => {
  const handler = async (download: any) => {
    downloadUrl = download.url();
    console.log(`File downloaded from: ${downloadUrl}`);
  };
  page.on('download', handler);
  return () => page.off('download', handler);
}

export const verifyIfElementIsVisible = async (
  page: Page,
  locator: Locator | string
): Promise<void> => {
  if (typeof locator === 'string') {
    expect(
      await page.isVisible(locator),
      `Element ${locator} was not visible on page ${await page.title()}`
    ).toBe(true)
  } else {
    expect(
      await locator.isVisible(),
      `Element ${locator} was not visible on page ${await page.title()}`
    ).toBe(true)
  }
}

export const verifyIfTitleIsCorrect = async (
  page: Page,
  title: string
): Promise<void> => {
  const headerTitle = page.locator('#headerTitle')
  const text = ((await headerTitle.textContent()) || '').trim()

  expect(text).toEqual(title)
}

export const verifyIfPageUrlIsCorrect = async (
  page: Page,
  url: string
): Promise<void> => {
  expect(page.url().indexOf(url)).toBeGreaterThan(-1)
}

export const verifyIfElementTextContentIsCorrect = async (
  page: Page,
  locator: Locator | string,
  text: string
): Promise<void> => {
  const textContent = await getTextContent(page, locator)
  expect(textContent).toContain(text)
}
export const verifyTableHeaderColumns = async (
  page: Page,
  headers: string[]
) => {
  headers.forEach(async (col) => {
    let locator = page.locator(`text="${col}"`).nth(0)
    await verifyIfElementIsVisible(page, locator)
  })
}

export const verifyFileDownload = async (
  page: Page
): Promise<void> => {
  // Wait a short time for network events to be processed
  await page.waitForTimeout(2000);
  // Assert that a download URL was captured in the network trace
  // TODO figure out away to verify name/content?
  expect(downloadUrl).toBeTruthy();
}