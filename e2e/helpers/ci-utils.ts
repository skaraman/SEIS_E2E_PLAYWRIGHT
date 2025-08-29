import { Page } from '@playwright/test';

/**
 * Utility functions for handling CI-specific behaviors and optimizations
 */

export const isRunningInCI = (): boolean => {
  return !!(
    process.env.CI || 
    process.env.TF_BUILD || // Azure DevOps
    process.env.AGENT_NAME || // Azure DevOps
    process.env.GITHUB_ACTIONS || // GitHub Actions
    process.env.JENKINS_URL || // Jenkins
    process.env.BUILDKITE // Buildkite
  );
};

export const getCIProvider = (): string => {
  if (process.env.TF_BUILD || process.env.AGENT_NAME) return 'Azure DevOps';
  if (process.env.GITHUB_ACTIONS) return 'GitHub Actions';
  if (process.env.JENKINS_URL) return 'Jenkins';
  if (process.env.BUILDKITE) return 'Buildkite';
  if (process.env.CI) return 'Generic CI';
  return 'Local';
};

export const getOptimalTimeouts = () => {
  const isCI = isRunningInCI();
  return {
    action: isCI ? 45000 : 35000,
    navigation: isCI ? 60000 : 30000,
    element: isCI ? 30000 : 15000,
    pageReady: isCI ? 20000 : 15000
  };
};

export const logCIInfo = (): void => {
  const provider = getCIProvider();
  console.log(`Running tests on: ${provider}`);
  
  if (isRunningInCI()) {
    console.log('CI Environment detected - using optimized settings');
    console.log('- Increased timeouts');
    console.log('- Reduced workers');
    console.log('- Enhanced error handling');
  }
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }
  }
  
  throw lastError;
};

export const waitForStableElement = async (
  page: Page,
  selector: string,
  timeout: number = getOptimalTimeouts().element
): Promise<void> => {
  const startTime = Date.now();
  let lastPosition: { x: number; y: number } | null = null;
  let stableCount = 0;
  const requiredStableChecks = 3;
  
  while (Date.now() - startTime < timeout) {
    try {
      const element = page.locator(selector).first();
      await element.waitFor({ state: 'visible', timeout: 5000 });
      
      const box = await element.boundingBox();
      if (box) {
        const currentPosition = { x: box.x, y: box.y };
        
        if (lastPosition && 
            Math.abs(currentPosition.x - lastPosition.x) < 1 && 
            Math.abs(currentPosition.y - lastPosition.y) < 1) {
          stableCount++;
          if (stableCount >= requiredStableChecks) {
            return; // Element is stable
          }
        } else {
          stableCount = 0;
        }
        
        lastPosition = currentPosition;
      }
      
      await page.waitForTimeout(100);
    } catch (error) {
      console.warn(`Element stability check failed: ${error.message}`);
      await page.waitForTimeout(500);
    }
  }
  
  console.warn(`Element ${selector} did not stabilize within ${timeout}ms`);
};