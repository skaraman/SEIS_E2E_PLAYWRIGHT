const { execSync } = require('child_process');
const env = process.argv[2] || 'dev';
const onlyOne = process.argv.includes('only-one');
const healthCheck = process.argv.includes('health-check');
const debug = process.argv.includes('debug');
const workerArgIndex = process.argv.findIndex(arg => arg === 'workers' || arg === 'worker');
const workers =
  workerArgIndex !== -1 && !isNaN(process.argv[workerArgIndex + 1])
    ? parseInt(process.argv[workerArgIndex + 1], 10)
    : null;

// Detect if running in CI environment (Azure DevOps, GitHub Actions, etc.)
const isCI = !!(process.env.CI || process.env.TF_BUILD || process.env.AGENT_NAME);

let grepArg = healthCheck ? '--grep @Health-Check' : '--grep-invert @Health-Check';
const debugArg = debug ? '--headed --debug' : '';
const debugEnv = debug ? 'PWDEBUG=console' : '';

// Optimize worker count for CI environments
let workersArg;
if (workers) {
  workersArg = workers;
} else if (debug) {
  workersArg = 1;
} else if (isCI) {
  // Use fewer workers on CI to reduce resource contention and improve stability
  workersArg = 2;
} else {
  workersArg = 6;
}

if (onlyOne) grepArg = "--grep @HD-Test-Debug";

// Add CI-specific environment variables
const ciEnv = isCI ? 'CI=true' : '';

const cmd = [
  'cross-env',
  `NODE_ENV=${env}`,
  ciEnv,
  debugEnv,
  'npx playwright test',
  '--reporter=list',
  `--workers=${workersArg}`,
  grepArg,
  debugArg
].filter(Boolean).join(' ');

console.log(cmd);

try {
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  console.error('E2E tests failed:', error.message);
  process.exit(1);
}