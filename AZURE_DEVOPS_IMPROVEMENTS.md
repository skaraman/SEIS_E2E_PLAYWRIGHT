# Azure DevOps Test Stability Improvements

This document outlines the improvements made to address inconsistent test pass/fail results on Azure DevOps platform.

## Root Causes Identified

### 1. Race Conditions
- **Issue**: `verifyTableHeaderColumns` used `forEach` with async operations without proper waiting
- **Fix**: Changed to `Promise.all()` to ensure all async operations complete before proceeding

### 2. Configuration Issues
- **Issue**: `timeout: 0` could cause hanging tests in CI environments
- **Fix**: Set reasonable 120-second timeout with CI-specific optimizations

### 3. Environment-Specific Problems
- **Issue**: Same settings used for local development and CI environments
- **Fix**: Added CI detection and environment-specific configurations

## Key Improvements

### 1. Enhanced Playwright Configuration
```javascript
// CI-optimized settings
retries: process.env.CI ? 3 : 1,
timeout: 120000, // 2 minutes instead of infinite
actionTimeout: process.env.CI ? 45000 : 35000,
video: process.env.CI ? 'retain-on-failure' : 'off',
```

### 2. Better Wait Strategies
- More robust `waitForPageReady()` function with fallback mechanisms
- Element stability checks before interactions
- Improved error handling with retry mechanisms

### 3. CI Environment Detection
```javascript
// Automatic detection of CI environments
const isCI = !!(process.env.CI || process.env.TF_BUILD || process.env.AGENT_NAME);
```

### 4. Optimized Worker Configuration
- **Local Development**: 6 workers (faster feedback)
- **CI Environment**: 2 workers (better stability, less resource contention)
- **Debug Mode**: 1 worker (easier debugging)

## Azure DevOps Specific Optimizations

### 1. Chrome Browser Flags
Added stability flags for CI environments:
```javascript
args: [
  '--disable-dev-shm-usage',
  '--disable-gpu', 
  '--no-sandbox',
  '--disable-setuid-sandbox'
]
```

### 2. Reduced Animation Delays
- **Local**: 250ms slowMo (better for debugging)
- **CI**: 100ms slowMo (faster execution)

### 3. Enhanced Error Handling
- Graceful fallbacks when network conditions are poor
- CI-appropriate assertions (more lenient where needed)
- Better logging for debugging CI failures

## Usage Instructions

### Running Tests Locally
```bash
# Standard run (all optimizations applied automatically)
npm run e2e qa

# Health check tests only
npm run e2e qa health-check

# Debug mode (uses local-optimized settings)
npm run e2e qa debug
```

### Azure DevOps Pipeline
The tests will automatically detect the CI environment and apply appropriate settings:
- Increased timeouts
- More retries
- Optimized worker counts
- Enhanced error handling

### Environment Variables
The following environment variables trigger CI optimizations:
- `CI=true`
- `TF_BUILD=true` (Azure DevOps)
- `AGENT_NAME` (Azure DevOps)

## Monitoring and Debugging

### 1. Enhanced Logging
- CI provider detection logged at startup
- Warning messages for timeout/stability issues
- Fallback strategies clearly indicated

### 2. Video Recording
- Videos automatically retained on CI failures
- Traces available for all test runs
- Screenshots captured on failures

### 3. Performance Monitoring
Slow test reporting configured to identify tests taking >5 minutes:
```javascript
reportSlowTests: { max: 0, threshold: 300000 }
```

## Expected Improvements

1. **Reduced Flakiness**: Better wait strategies and retry mechanisms
2. **Faster CI Runs**: Optimized settings for CI environments
3. **Better Debugging**: Enhanced logging and artifact retention
4. **More Reliable**: Graceful handling of network and timing issues

## Best Practices for New Tests

1. **Use Helper Functions**: Leverage `clickElement`, `waitForPageReady`, etc.
2. **Avoid Fixed Delays**: Use dynamic waits instead of `page.waitForTimeout()`
3. **Handle Errors Gracefully**: Use try-catch blocks for non-critical operations
4. **Test Locally First**: Ensure tests pass consistently locally before CI
5. **Use Appropriate Timeouts**: Let the system choose optimal timeouts when possible

## Troubleshooting

### If Tests Still Fail in CI:
1. Check the video recordings (automatically retained on failures)
2. Review trace files for detailed execution steps
3. Look for timeout-related error messages
4. Consider if the test needs environment-specific handling

### Common CI Issues:
- **Network delays**: Increased timeouts should handle this
- **Resource contention**: Reduced worker count should help
- **Browser stability**: Chrome flags should improve this
- **Element timing**: Stability checks should prevent premature interactions