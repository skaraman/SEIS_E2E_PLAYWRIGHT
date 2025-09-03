const { execSync } = require('child_process');
const env = process.argv[2] || 'dev';
const onlyOne = process.argv.includes('only-one');
const healthCheck = process.argv.includes('health-check');
const debug = process.argv.includes('debug');
const workerArgIndex = process.argv.findIndex(arg => arg === 'workers' || arg === 'worker');

// Detect CI environment
const isCI = !!process.env.CI || !!process.env.TF_BUILD || !!process.env.SYSTEM_COLLECTIONID;
const isAzureDevOps = !!process.env.TF_BUILD || !!process.env.SYSTEM_COLLECTIONID;

const workers =
  workerArgIndex !== -1 && !isNaN(process.argv[workerArgIndex + 1])
    ? parseInt(process.argv[workerArgIndex + 1], 10)
    : null;

let grepArg = healthCheck ? '--grep @Health-Check' : '--grep-invert @Health-Check';
const debugArg = debug ? '--headed --debug' : '';
const debugEnv = debug ? 'PWDEBUG=console' : '';

// Intelligent worker configuration - respect playwright.config.js in CI
let workersArg;
if (workers) {
  workersArg = workers;
} else if (debug) {
  workersArg = 1;
} else if (isCI) {
  // Let playwright.config.js handle worker configuration in CI
  workersArg = null;
} else {
  workersArg = 6;
}

if (onlyOne) grepArg = "--grep @HD-Test-Debug";

// Set environment variable directly in CI
if (isCI) {
  process.env.NODE_ENV = env;
}

const cmd = [
  isCI ? '' : 'cross-env',
  isCI ? '' : `NODE_ENV=${env}`,
  debugEnv,
  'npx playwright test',
  '--reporter=list',
  workersArg ? `--workers=${workersArg}` : null,
  grepArg,
  debugArg
].filter(Boolean).join(' ');

console.log(cmd);

// Add environment validation
try {
  if (isCI) {
    console.log('Running in CI environment:', isAzureDevOps ? 'Azure DevOps' : 'Generic CI');
  }
  
  // Validate NODE_ENV
  const validEnvs = ['dev', 'qa', 'prod', 'v4'];
  if (!validEnvs.includes(env)) {
    console.warn(`Warning: NODE_ENV '${env}' is not in valid environments: ${validEnvs.join(', ')}`);
  }
  
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  console.error('E2E tests failed:', error.message);
  
  if (isCI && error.status) {
    console.error('Exit code:', error.status);
    // Provide helpful CI-specific error information
    if (isAzureDevOps) {
      console.error('##vso[task.logissue type=error]E2E tests failed in Azure DevOps pipeline');
    }
  }
  
  process.exit(1);
}