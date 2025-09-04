import { Page, Locator, expect } from '@playwright/test'

export async function waitForPageLayoutStable(page: Page, options: {
  stableMs?: number;
  timeout?: number;
  includeViewport?: boolean;
} = {}) {
  const { stableMs = 500, timeout = 5000, includeViewport = false } = options;
  
  let lastSnapshot = null;
  let stableStart = Date.now();
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    // Get page dimensions and viewport info
    const pageInfo = await page.evaluate((includeViewport) => {
      const body = document.body;
      const html = document.documentElement;

      type Snapshot = {
        scrollWidth: number;
        scrollHeight: number;
        clientWidth: number;
        clientHeight: number;
        readyState: DocumentReadyState;
        elementCount: number;
        viewport?: {
          width: number;
          height: number;
          scrollX: number;
          scrollY: number;
        };
      };

      const snapshot: Snapshot = {
        // Page dimensions
        scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
        scrollHeight: Math.max(body.scrollHeight, html.scrollHeight),
        clientWidth: Math.max(body.clientWidth, html.clientWidth),
        clientHeight: Math.max(body.clientHeight, html.clientHeight),

        // Document ready state
        readyState: document.readyState,

        // Count of elements (rough page complexity indicator)
        elementCount: document.querySelectorAll('*').length,
      };

      // Optionally include viewport info
      if (includeViewport) {
        snapshot.viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY
        };
      }

      return snapshot;
    }, includeViewport);
    
    const currentSnapshot = JSON.stringify(pageInfo);
    
    if (currentSnapshot === lastSnapshot) {
      if (Date.now() - stableStart >= stableMs) {
        return pageInfo; // Return the stable page info
      }
    } else {
      stableStart = Date.now();
      lastSnapshot = currentSnapshot;
    }
    
    await page.waitForTimeout(100);
  }
  
  throw new Error(`Page layout did not stabilize within ${timeout}ms`);
}

// Alternative approach using multiple stability checks
export async function waitForPageLayoutStableAdvanced(page: Page, options: {
  stableMs?: number;
  timeout?: number;
  checkNetworkIdle?: boolean;
  checkAnimations?: boolean;
} = {}) {
  const { stableMs = 500, timeout = 10000, checkNetworkIdle = true, checkAnimations = false } = options;
  
  let lastSnapshot = null;
  let stableStart = Date.now();
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    // Get comprehensive page state
    const pageState = await page.evaluate((checkAnimations) => {
      const body = document.body;
      const html = document.documentElement;
      
      const state: {
        scrollWidth: number;
        scrollHeight: number;
        clientWidth: number;
        clientHeight: number;
        readyState: DocumentReadyState;
        elementCount: number;
        imagesTotal: number;
        imagesLoaded: number;
        hasActiveAnimations?: boolean;
      } = {
        // Layout dimensions
        scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
        scrollHeight: Math.max(body.scrollHeight, html.scrollHeight),
        clientWidth: Math.max(body.clientWidth, html.clientWidth),
        clientHeight: Math.max(body.clientHeight, html.clientHeight),
        
        // Document state
        readyState: document.readyState,
        elementCount: document.querySelectorAll('*').length,
        
        // Images loaded
        imagesTotal: document.querySelectorAll('img').length,
        imagesLoaded: document.querySelectorAll('img[complete="true"]').length,
      };
      
      // Check for running animations if requested
      if (checkAnimations) {
        const animatedElements = Array.from(document.querySelectorAll('*'));
        let hasAnimations = false;
        
        for (const el of animatedElements) {
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.animationName !== 'none' || 
              computedStyle.transitionProperty !== 'none') {
            hasAnimations = true;
            break;
          }
        }
        
        state.hasActiveAnimations = hasAnimations;
      }
      
      return state;
    }, checkAnimations);
    
    // Optional: Wait for network idle
    if (checkNetworkIdle) {
      try {
        await page.waitForLoadState('networkidle', { timeout: 100 });
      } catch {
        // Continue if network idle check fails quickly
      }
    }
    
    const currentSnapshot = JSON.stringify(pageState);
    
    if (currentSnapshot === lastSnapshot) {
      if (Date.now() - stableStart >= stableMs) {
        return pageState;
      }
    } else {
      stableStart = Date.now();
      lastSnapshot = currentSnapshot;
    }
    
    await page.waitForTimeout(100);
  }
  
  throw new Error(`Page layout did not stabilize within ${timeout}ms`);
}

export async function waitForPageReady(page: Page, timeout = 15000) {
  // Increased default timeout and added more robust waiting strategy
  await page.waitForTimeout(1000); // Increased initial wait
  
  // Wait for network to be idle with retry logic
  let networkIdleAttempts = 0;
  const maxNetworkIdleAttempts = 3;
  while (networkIdleAttempts < maxNetworkIdleAttempts) {
    try {
      await page.waitForLoadState('networkidle', { timeout: timeout });
      break;
    } catch (error) {
      networkIdleAttempts++;
      if (networkIdleAttempts === maxNetworkIdleAttempts) {
        console.warn('Network idle timeout reached, continuing...');
      }
      await page.waitForTimeout(2000);
    }
  }
  
  await waitForPageLayoutStable(page, { timeout: timeout, stableMs: 1000 }); // Increased stable time
  await page.waitForTimeout(1000); // Final stabilization wait

}