// playwright.config.js

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
	retries: 0,
	workers: 3,
	use: {
		baseURL: `${getEnv.baseUrl}`,
		headless: true,
		viewport: { width: 1200, height: 800 },
		ignoreHTTPSErrors: true,
		screenshot: 'only-on-failure',
		video: 'off',
		trace: 'on',
		actionTimeout: 60000, // Increased from 35000 to handle slow operations
		navigationTimeout: 45000, // Added explicit navigation timeout
		// extraHTTPHeaders: {
		// 	'Version': 'develop'
		// }
	},
	// reporter: [['list']],

	timeout: 1800000, // this is the timeout for each individual test(step)
	globalTimeout: 2400000, // this is the maximum duration for the entire suite. Setting this to prevent a CI build from locking up indefinitely
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
