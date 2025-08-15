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

let grepArg = healthCheck ? '--grep @Health-Check' : '--grep-invert @Health-Check';
const debugArg = debug ? '--headed --debug' : '';
const debugEnv = debug ? 'PWDEBUG=console' : '';
const workersArg = workers ? workers : (debug ? 1 : 6);
if (onlyOne) {
  grepArg = "--grep @HD-Test-Debug";
}

const cmd = [
  'cross-env',
  `NODE_ENV=${env}`,
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