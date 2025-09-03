// playwright.config.js
// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */

const { devices } = require('@playwright/test');

const envName = require('./e2e/environments/all-envs.json');
let getEnv = require('./e2e/environments/dev-env.json');
const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'dev';

// Detect CI environment
const isCI = !!process.env.CI || !!process.env.TF_BUILD || !!process.env.SYSTEM_COLLECTIONID;
const isAzureDevOps = !!process.env.TF_BUILD || !!process.env.SYSTEM_COLLECTIONID;
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
	forbidOnly: !!isCI,
	retries: isCI ? 3 : 2,
	workers: isCI ? (isAzureDevOps ? 2 : 1) : 1,
	use: {
		baseURL: `${getEnv.baseUrl}`,
		headless: true,
		viewport: { width: 1200, height: 800 },
		ignoreHTTPSErrors: true,
		screenshot: isCI ? 'only-on-failure' : 'only-on-failure',
		video: isCI ? 'retain-on-failure' : 'off',
		trace: isCI ? 'retain-on-failure' : 'on',
		actionTimeout: isCI ? 60000 : 35000, // this is the timeout for every individual action
		// extraHTTPHeaders: {
		// 	'Version': 'develop'
		// }
	},
	reporter: isCI ? [
		['list'],
		['junit', { outputFile: 'test-results/junit-results.xml' }],
		['html', { outputFolder: 'test-results/html-report', open: 'never' }]
	] : [['list']],

	timeout: isCI ? 600000 : 1800000, // this is the timeout for each individual test(step) - shorter for CI
	globalTimeout: isCI ? 3600000 : 1800000, // this is the maximum duration for the entire suite - allow more time for CI but not infinite
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
