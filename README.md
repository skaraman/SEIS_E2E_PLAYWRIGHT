# SEIS E2E TESTS

SEIS is managed and maintained by CodeStack, a department of the San Joaquin County Office of Education. 

## Run Locally

Clone the project.

```bash
  git clone https://dev.azure.com/sjcodestack/SEIS_V2/_git/SEIS_E2E_PLAYWRIGHT
```

Go to the project directory.

```bash
  cd SEIS_E2E_PLAYWRIGHT
```

Build and Install dependencies.

```bash
  nvm use 16.13.0
```

Run health checks.
```bash
  npm run e2e:health-check
```

Run HD tests.
```bash
  npm run e2e:dev
  npm run e2e:qa
  npm run e2e:prod
```