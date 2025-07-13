# GitHub Actions CI/CD Setup for Python Chronicles

This document outlines the automated testing and deployment pipeline configured for the Python Chronicles project.

## Workflow Files

### 1. `python-tests.yml` - Primary Python Testing

- **Triggers**: Push/PR to main/develop branches, changes to Python files
- **Python Versions**: 3.9, 3.10, 3.11, 3.12
- **Tests**: Runs all Python test suites
- **Purpose**: Ensures Python code quality across multiple versions

### 2. `ci-cd.yml` - Full CI/CD Pipeline

- **Triggers**: Push/PR to main/develop branches
- **Jobs**:
  - Python tests (3.11, 3.12)
  - Next.js build and lint
  - Deployment readiness check
- **Purpose**: Complete application testing and deployment preparation

### 3. `cross-platform-tests.yml` - Cross-Platform Testing

- **Triggers**: Push/PR to main, weekly schedule
- **Platforms**: Ubuntu, Windows, macOS
- **Python Versions**: 3.11, 3.12
- **Purpose**: Ensures compatibility across different operating systems

### 4. `security-checks.yml` - Security & Dependencies

- **Triggers**: Push/PR to main, weekly schedule
- **Checks**:
  - npm audit for Node.js dependencies
  - Bandit security analysis for Python
  - Safety vulnerability scanning
- **Purpose**: Maintains security and dependency health

## Test Structure

### Python Tests Location

```
public/python/tests/
├── __init__.py
├── run_all_tests.py    # Main test runner
├── test_hello.py       # Tests for hello.py module
└── test_add.py         # Tests for add.py module
```

### NPM Scripts

```bash
npm test           # Run Python tests
npm run test:python # Run Python tests (explicit)
npm run build      # Build Next.js application
npm run lint       # Run ESLint checks
```

## Status Badges

The following badges are available in the README:

- [![Python Tests](https://github.com/achudars/python-chronicles/actions/workflows/python-tests.yml/badge.svg)](https://github.com/achudars/python-chronicles/actions/workflows/python-tests.yml)
- [![CI/CD Pipeline](https://github.com/achudars/python-chronicles/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/achudars/python-chronicles/actions/workflows/ci-cd.yml)

## Deployment Gates

All workflows must pass before deployment to production:

1. ✅ **Python Tests**: All test suites pass on multiple Python versions
2. ✅ **Next.js Build**: Application builds successfully
3. ✅ **Cross-Platform**: Tests pass on Ubuntu, Windows, and macOS
4. ✅ **Security**: No high-severity security issues detected
5. ✅ **Dependencies**: All dependencies are secure and up-to-date

## Manual Testing

### Local Python Tests

```bash
# Run all tests
cd public/python
python tests/run_all_tests.py

# Run specific test modules
python -c "from tests.test_hello import test_hello_output; test_hello_output()"
python -c "from tests.test_add import test_add_numbers_function; test_add_numbers_function()"
```

### Local Next.js Testing

```bash
npm install
npm run lint
npm run build
npm test
```

## Monitoring & Notifications

- **Workflow Status**: Visible in GitHub Actions tab
- **Email Notifications**: Automatic on workflow failures
- **Badge Status**: Real-time status in README
- **PR Checks**: Required status checks before merging

## Future Enhancements

1. **Code Coverage**: Add coverage reporting for Python tests
2. **Performance Testing**: Add performance benchmarks
3. **E2E Testing**: Add end-to-end testing with Playwright
4. **Automated Releases**: Add semantic versioning and releases
5. **Docker**: Add containerized testing environments
