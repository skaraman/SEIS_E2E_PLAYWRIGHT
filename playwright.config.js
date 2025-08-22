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

	// Each test is given 30 seconds
	// timeout: 30000,

	// Forbid test.only on CI
	forbidOnly: !!process.env.CI,

	// Two retries for each test
	// retries: 2,

	use: {
		baseURL: `${getEnv.baseUrl}`,
		headless: false,
		viewport: { width: 1500, height: 720 },
		ignoreHTTPSErrors: true,
		screenshot: 'only-on-failure',
		// workers: 4,

		video: 'on-first-retry',
		trace: 'on',
		actionTimeout: 30000, // this is the timeout for every individual action
		// extraHTTPHeaders: {
		// 	'Version': 'develop'
		// }

		launchOptions: {
			slowMo: 0,
		},
	},
	// reporter: [['list']],

	timeout: 0, // this is the timeout for each individual test(step)
	globalTimeout: 1800000, // this is the maximum duration for the entire suite. Setting this to prevent a CI build from locking up indefinitely
	reportSlowTests: { max: 0, threshold: 300000 }, // reports on slow tests, this will inform us when tests are slowing down.

	projects: [
		{
			name: 'chrome',
			use: {
				browserName: 'chromium',
				channel: 'chrome',
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
