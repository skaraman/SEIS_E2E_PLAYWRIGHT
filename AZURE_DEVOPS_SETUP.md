# Azure DevOps Setup Guide for SEIS E2E Playwright Tests

This guide provides instructions for setting up and running SEIS E2E Playwright tests in Azure DevOps environment.

## Overview

The repository has been optimized for Azure DevOps with the following improvements:
- Automatic CI environment detection
- Optimized worker and timeout configurations for CI
- Proper test reporting with JUnit and HTML outputs
- Enhanced error handling and logging
- Browser installation verification

## Prerequisites

- Azure DevOps organization and project
- Repository connected to Azure DevOps
- Service connections configured (if accessing external services)

## Pipeline Configuration

The repository includes `azure-pipelines.yml` which defines a multi-stage pipeline:

### Stage 1: Health Check Tests
- Runs lightweight health check tests first
- Quick validation of environment setup
- Fails fast if basic connectivity issues exist

### Stage 2: Full Test Suite
- Runs only if health checks pass
- Matrix strategy for multiple environments (qa, prod)
- Comprehensive test execution

## Environment Variables

The following environment variables can be configured in Azure DevOps:

### Required
- `NODE_ENV`: Target environment (dev, qa, prod, v4)

### Optional
- `CI`: Automatically set by Azure DevOps
- `TF_BUILD`: Automatically set by Azure DevOps
- `SYSTEM_COLLECTIONID`: Automatically set by Azure DevOps

## Pipeline Setup Steps

1. **Create Pipeline**
   ```
   - Go to Azure DevOps project
   - Navigate to Pipelines > Create Pipeline
   - Select your repository
   - Choose "Existing Azure Pipelines YAML file"
   - Select "/azure-pipelines.yml"
   ```

2. **Configure Variables**
   ```
   - In pipeline settings, add any required variables
   - Set environment-specific configurations
   ```

3. **Run Pipeline**
   ```
   - Trigger manually or via code commit
   - Monitor execution in Azure DevOps
   ```

## CI Optimizations

### Worker Configuration
- **Local Development**: 6 workers (configurable)
- **Generic CI**: 1 worker
- **Azure DevOps**: 2 workers (optimized for Azure agents)

### Timeouts
- **Individual Actions**: 60 seconds (vs 35 seconds locally)
- **Individual Tests**: 10 minutes (vs 30 minutes locally)
- **Global Suite**: 60 minutes (vs 30 minutes locally)

### Retry Strategy
- **CI Environments**: 3 retries (vs 2 locally)
- Accounts for potential network/resource issues in CI

### Reporting
- **JUnit XML**: For Azure DevOps test integration
- **HTML Report**: Detailed visual test reports
- **Artifacts**: Test results uploaded on failure

## Troubleshooting

### Common Issues

1. **Browser Installation Failures**
   ```
   Solution: The pipeline includes explicit browser installation steps
   Check: Ensure agent has sufficient disk space
   ```

2. **Timeout Issues**
   ```
   Solution: Optimized timeouts for CI environment
   Check: Monitor individual test performance
   ```

3. **Worker Configuration Conflicts**
   ```
   Solution: CI automatically uses playwright.config.js worker settings
   Check: Avoid manual worker overrides in CI
   ```

4. **Environment Configuration**
   ```
   Solution: Environment files are validated during setup
   Check: Ensure all required environment files exist
   ```

### Debug Options

1. **Enable Debug Mode**
   ```bash
   # Add to pipeline variables
   DEBUG_MODE: true
   ```

2. **Increase Logging**
   ```bash
   # In pipeline YAML
   - script: npm run e2e qa debug
   ```

3. **Review Artifacts**
   ```
   - Check uploaded test artifacts for detailed logs
   - Review HTML reports for visual test analysis
   ```

## Local Development vs CI

| Feature | Local | CI |
|---------|-------|-----|
| Workers | 6 (default) | 2 (Azure DevOps) |
| Retries | 2 | 3 |
| Timeout (action) | 35s | 60s |
| Timeout (test) | 30m | 10m |
| Timeout (global) | 30m | 60m |
| Video | Off | On failure |
| Trace | On | On failure |
| Reporter | List | List + JUnit + HTML |

## Best Practices

1. **Use Health Checks**
   - Always run health checks first
   - Validate environment connectivity

2. **Environment Management**
   - Use separate pipelines for different environments
   - Configure environment-specific variables

3. **Resource Management**
   - Monitor agent resource usage
   - Adjust worker count based on agent capacity

4. **Error Handling**
   - Review failure artifacts
   - Use Azure DevOps test reporting features

## Support

For issues specific to Azure DevOps integration:
1. Check Azure DevOps pipeline logs
2. Review uploaded test artifacts
3. Validate environment configuration
4. Check agent resource availability

For test-specific issues:
1. Review Playwright HTML reports
2. Check individual test traces
3. Validate application connectivity