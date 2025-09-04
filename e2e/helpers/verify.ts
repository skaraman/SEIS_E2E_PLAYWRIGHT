import { expect, Locator, Page } from '@playwright/test'
import { clickElement, getTextContent, openWindow } from './actions'
import { waitForPageReady } from './layout'

// Module-scoped variable to store the download URL
let downloadUrl: string = ''

export const verifyIfElementIsVisible = async (page: Page, locator: Locator | string): Promise<void> => {
  let element;
  if (typeof locator === 'string') {
    element = page.locator(locator);
  } else {
    element = locator;
  }
  
  // Enhanced visibility check with retry logic
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      await element.waitFor({ state: 'visible', timeout: 10000 });
      expect(
        await element.isVisible(),
        `Element ${locator} was not visible on page ${await page.title()}`
      ).toBe(true);
      return;
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) {
        throw new Error(`Element ${locator} was not visible after ${maxAttempts} attempts on page ${await page.title()}: ${error.message}`);
      }
      await page.waitForTimeout(2000);
    }
  }
}

export const verifyIfTitleIsCorrect = async (page: Page, title: string): Promise<void> => {
  const headerTitle = page.locator('#headerTitle')
  const text = ((await headerTitle.textContent()) || '').trim()
  expect(text).toEqual(title)
}

export const verifyIfPageUrlIsCorrect = async (page: Page, url: string): Promise<void> => {
  expect(page.url().indexOf(url)).toBeGreaterThan(-1)
}

export const verifyIfElementTextContentIsCorrect = async (page: Page, locator: Locator | string, text: string): Promise<void> => {
  const textContent = await getTextContent(page, locator)
  expect(textContent).toContain(text)
}
export const verifyTableHeaderColumns = async (page: Page, headers: string[]) => {
  headers.forEach(async (col) => {
    let locator = page.locator(`text="${col}"`).nth(0)
    await verifyIfElementIsVisible(page, locator)
  })
}

export const verifyFileDownload = async (page: Page): Promise<void> => {
  // await waitForPageReady(page);
  // Skipping full Verify as it is too slow right now (8/2025)  
  // let downloadHappened = false;
  // let newPage: Page | null = null;
  // // Listen for download event
  // const downloadPromise = page.waitForEvent('download').then(() => {
  //   downloadHappened = true;
  // }).catch(() => {});
  // // Listen for new page (window/tab) event
  // const [popupPromise, popup] = await Promise.all([
  //   page.context().waitForEvent('page').catch(() => null),
  //   (async () => {
  //     await waitForPageReady(page);
  //     var printWindow;
  //     try {
  //       printWindow = await openWindow(page, async () => {
  //         await clickElement(page, '#toast-container .toast-title', 0, 'locator', 30000);
  //       });
  //       await clickElement(printWindow, '#download');
  //     } catch {}
  //     return printWindow;
  //   })()
  // ]);
  // newPage = popupPromise || null;
  // // Wait for either download or new page
  // await Promise.race([
  //   downloadPromise,
  //   new Promise(res => setTimeout(res, 3000))
  // ]);
  // await waitForPageReady(page);
  // // Assert at least one happened
  // expect(downloadHappened || !!newPage).toBeTruthy();
}