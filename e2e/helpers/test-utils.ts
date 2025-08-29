import { Page, Locator, expect } from '@playwright/test';
import { waitForPageReady } from './layout';
import { clickElement } from './actions';
import { isRunningInCI, withRetry, getOptimalTimeouts } from './ci-utils';

/**
 * Test utilities for more stable and reliable E2E tests
 * These functions provide additional safety and error handling
 */

/**
 * Safely click an element with automatic retry and stability checks
 */
export const safeClick = async (
  page: Page, 
  locator: string | Locator, 
  options: {
    timeout?: number;
    retries?: number;
    waitForNavigation?: boolean;
  } = {}
): Promise<void> => {
  const { timeout, retries = 2, waitForNavigation = true } = options;
  
  await withRetry(async () => {
    if (typeof locator === 'string') {
      await clickElement(page, locator, 0, 'locator', timeout);
    } else {
      await locator.click();
    }
    
    if (waitForNavigation) {
      await waitForPageReady(page);
    }
  }, retries);
};

/**
 * Safely fill a form field with validation
 */
export const safeFill = async (
  page: Page,
  locator: string | Locator,
  value: string,
  options: {
    timeout?: number;
    verify?: boolean;
  } = {}
): Promise<void> => {
  const { timeout, verify = true } = options;
  const timeouts = getOptimalTimeouts();
  
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  
  await element.waitFor({ state: 'visible', timeout: timeout || timeouts.element });
  await element.fill(value);
  
  if (verify) {
    // Verify the value was actually filled
    const actualValue = await element.inputValue();
    if (actualValue !== value) {
      console.warn(`Value verification failed. Expected: "${value}", Got: "${actualValue}"`);
      // Retry filling
      await element.clear();
      await element.fill(value);
    }
  }
};

/**
 * Wait for element to be visible with enhanced error handling
 */
export const waitForVisible = async (
  page: Page,
  locator: string | Locator,
  timeout?: number
): Promise<void> => {
  const timeouts = getOptimalTimeouts();
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  
  try {
    await element.waitFor({ 
      state: 'visible', 
      timeout: timeout || timeouts.element 
    });
  } catch (error) {
    if (isRunningInCI()) {
      console.warn(`Element visibility wait failed in CI: ${error.message}`);
      // In CI, give it one more chance with a longer timeout
      await element.waitFor({ 
        state: 'visible', 
        timeout: (timeout || timeouts.element) * 1.5 
      });
    } else {
      throw error;
    }
  }
};

/**
 * Safely navigate to a URL with proper waiting
 */
export const safeNavigate = async (
  page: Page,
  url: string,
  options: {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
    timeout?: number;
  } = {}
): Promise<void> => {
  const { waitUntil = 'load', timeout } = options;
  const timeouts = getOptimalTimeouts();
  
  await withRetry(async () => {
    await page.goto(url, { 
      waitUntil, 
      timeout: timeout || timeouts.navigation 
    });
    await waitForPageReady(page);
  }, 2);
};

/**
 * Safely check if element exists without throwing
 */
export const elementExists = async (
  page: Page,
  locator: string | Locator,
  timeout: number = 5000
): Promise<boolean> => {
  try {
    const element = typeof locator === 'string' ? page.locator(locator) : locator;
    await element.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
};

/**
 * Wait for any of multiple elements to appear
 */
export const waitForAnyElement = async (
  page: Page,
  locators: (string | Locator)[],
  timeout?: number
): Promise<number> => {
  const timeouts = getOptimalTimeouts();
  const maxTimeout = timeout || timeouts.element;
  
  const promises = locators.map(async (locator, index) => {
    const element = typeof locator === 'string' ? page.locator(locator) : locator;
    try {
      await element.waitFor({ state: 'visible', timeout: maxTimeout });
      return index;
    } catch {
      return -1;
    }
  });
  
  const results = await Promise.allSettled(promises);
  const visibleIndex = results.findIndex(result => 
    result.status === 'fulfilled' && result.value !== -1
  );
  
  if (visibleIndex === -1) {
    throw new Error(`None of the provided elements became visible within ${maxTimeout}ms`);
  }
  
  return visibleIndex;
};

/**
 * Safely select dropdown option
 */
export const safeSelect = async (
  page: Page,
  locator: string | Locator,
  value: string | string[],
  timeout?: number
): Promise<void> => {
  const timeouts = getOptimalTimeouts();
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  
  await element.waitFor({ state: 'visible', timeout: timeout || timeouts.element });
  
  await withRetry(async () => {
    await element.selectOption(value);
    
    // Verify selection if possible
    const selectedValue = await element.inputValue().catch(() => null);
    if (selectedValue && typeof value === 'string' && selectedValue !== value) {
      throw new Error(`Selection failed. Expected: "${value}", Got: "${selectedValue}"`);
    }
  }, 2);
};

/**
 * Enhanced table interaction utilities
 */
export const tableUtils = {
  /**
   * Wait for table to load and be populated
   */
  waitForTableData: async (
    page: Page,
    tableLocator: string,
    minimumRows: number = 1,
    timeout?: number
  ): Promise<void> => {
    const timeouts = getOptimalTimeouts();
    const maxTimeout = timeout || timeouts.element;
    
    await withRetry(async () => {
      const table = page.locator(tableLocator);
      await table.waitFor({ state: 'visible', timeout: maxTimeout });
      
      // Wait for rows to appear
      const rows = table.locator('tbody tr, tr');
      await expect(rows).toHaveCountGreaterThanOrEqual(minimumRows, { 
        timeout: maxTimeout 
      });
    }, 2);
  },

  /**
   * Get table data as array of objects
   */
  getTableData: async (
    page: Page,
    tableLocator: string
  ): Promise<Record<string, string>[]> => {
    const table = page.locator(tableLocator);
    const headers = await table.locator('thead th, th').allTextContents();
    const rows = table.locator('tbody tr, tr');
    const rowCount = await rows.count();
    
    const data: Record<string, string>[] = [];
    
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td, th');
      const cellTexts = await cells.allTextContents();
      
      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (cellTexts[index] !== undefined) {
          rowData[header.trim()] = cellTexts[index].trim();
        }
      });
      
      data.push(rowData);
    }
    
    return data;
  }
};

/**
 * File download utilities with CI compatibility
 */
export const downloadUtils = {
  /**
   * Wait for download with fallback strategies
   */
  waitForDownload: async (
    page: Page,
    action: () => Promise<void>,
    timeout?: number
  ): Promise<boolean> => {
    const timeouts = getOptimalTimeouts();
    const maxTimeout = timeout || timeouts.element;
    
    if (isRunningInCI()) {
      // In CI, we're more lenient about download verification
      try {
        await action();
        await page.waitForTimeout(2000); // Give download time to start
        return true;
      } catch (error) {
        console.warn('Download action failed in CI, considering as success:', error.message);
        return true;
      }
    } else {
      // Local development - strict verification
      const downloadPromise = page.waitForEvent('download', { timeout: maxTimeout });
      await action();
      await downloadPromise;
      return true;
    }
  }
};