// playwright.config.js
// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */

const { devices } = require('@playwright/test');

const envName = require('./e2e/environments/all-envs.json');
let getEnv = require('./e2e/environments/dev-env.json');
const env = process.env.NODE_ENV.trim();
switch (env) {
	case envName.v4:
		getEnv = require('./e2e/environments/v4-env.json')
		break
	case envName.qa:
		getEnv = require('./e2e/environments/qa-env.json')
		break
	case envName.prod:
		getEnv = require('./e2e/environments/prod-env.json')
		break
}

/** @type {import('@playwright/test').PlaywrightTestConfig<{ config: { baseUrl: string; apiBaseUrl: string; }  }>} */
const config = {
	// Look for test files in the "tests" directory, relative to this configuration file
	testDir: 'e2e/tests',
	snapshotDir: 'snapshots',
	// Forbid test.only on CI
	forbidOnly: !!process.env.CI,
	// Increase retries on CI environments (Azure DevOps) where tests are more prone to flakiness
	retries: process.env.CI ? 3 : 1,
	use: {
		baseURL: `${getEnv.baseUrl}`,
		headless: true,
		viewport: { width: 1200, height: 800 },
		ignoreHTTPSErrors: true,
		screenshot: 'only-on-failure',
		// workers: 4,

		video: process.env.CI ? 'retain-on-failure' : 'off', // Keep videos on CI for debugging
		trace: 'on',
		actionTimeout: process.env.CI ? 45000 : 35000, // Increase timeout on CI environments
		// extraHTTPHeaders: {
		// 	'Version': 'develop'
		// }

		launchOptions: {
			// Reduce slowMo on CI to speed up tests, keep it for local debugging
			slowMo: process.env.CI ? 100 : 250,
			// Add additional Chrome args for better CI stability
			args: process.env.CI ? [
				'--disable-dev-shm-usage',
				'--disable-gpu',
				'--no-sandbox',
				'--disable-setuid-sandbox'
			] : [],
		},
	},
	// reporter: [['list']],

	timeout: 120000, // Set a reasonable default timeout of 2 minutes per test to prevent hanging
	globalTimeout: 1800000, // this is the maximum duration for the entire suite. Setting this to prevent a CI build from locking up indefinitely
	reportSlowTests: { max: 0, threshold: 300000 }, // reports on slow tests, this will inform us when tests are slowing down.

	projects: [
		{
			name: 'chrome',
			use: {
				browserName: 'chromium',
				channel: 'chrome',
				viewport: { width: 1200, height: 800 },
				config:  getEnv
			},
		},
		// {
		//   name: 'Desktop Safari',
		//   use: {
		//     browserName: 'webkit',
		//     viewport: { width: 1200, height: 750 },
		//   }
		// },
		// Test against mobile viewports.
		// {
		//   name: 'Mobile Chrome',
		//   use: devices['Pixel 5'],
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: devices['iPhone 12'],
		// },
		// {
		//   name: 'Desktop Firefox',
		//   use: {
		//     browserName: 'firefox',
		//     viewport: { width: 800, height: 600 },
		//   }
		// },
	],
};

module.exports = config;
