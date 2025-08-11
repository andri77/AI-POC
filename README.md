# Mock API Generator and Testing Suite

This project contains a mock API generator and a comprehensive testing suite using Playwright.

## Project Structure

```
PW_Demo/
├── MOCK_GEN/               # Mock API Generator
│   ├── server.js          # API server implementation
│   ├── package.json       # API dependencies
│   └── README.md         # API documentation
└── tests/
    └── API_tests/        # API test suites
        └── mock_api.spec.ts  # Mock API tests
```

## Part 1: Mock API Generator (MOCK_GEN)

### Setup and Running the Mock API

1. Navigate to the MOCK_GEN directory:
```bash
cd MOCK_GEN
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on http://localhost:3000

### Available API Endpoints

- GET `/` - API information and available endpoints
- GET `/api/users?count=5` - Generate mock user data
- GET `/api/products?count=5` - Generate mock product data
- GET `/api/posts?count=5` - Generate mock post data
- POST `/api/custom` - Generate custom mock data

### Example Custom Data Request

```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "schema": {
        "fullName": "name",
        "userEmail": "email",
        "companyName": "company"
    },
    "count": 2
}' http://localhost:3000/api/custom
```

## Part 2: API Testing Suite

### Running the Tests

1. Ensure the Mock API server is running first (see Part 1)

2. From the project root directory, run all API tests:
```bash
npx playwright test tests/API_tests/mock_api.spec.ts
```

To run tests with a browser UI:
```bash
npx playwright test tests/API_tests/mock_api.spec.ts --headed
```

To run tests in debug mode:
```bash
npx playwright test tests/API_tests/mock_api.spec.ts --debug
```

### Test Coverage

The test suite (`mock_api.spec.ts`) covers:

1. Basic API Functionality
   - Root endpoint validation
   - Error handling
   - Response structure verification

2. User Endpoints
   - Single user generation
   - Multiple users generation
   - Data structure validation

3. Product Endpoints
   - Single product generation
   - Multiple products generation
   - Data structure validation

4. Post Endpoints
   - Posts generation
   - Data structure validation

5. Custom Data Generation
   - Schema validation
   - Multiple items generation
   - Error handling

### Viewing Test Results

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## UI Testing Suite

The project includes comprehensive UI tests located in the `tests/UI_tests` directory.

### Prerequisites

1. Install Playwright and browsers:
```bash
npm install
npx playwright install
```

2. Install system dependencies (if needed):
```bash
npx playwright install-deps
```

### Available UI Test Suites

- `ecommerce.spec.ts`: Tests for e-commerce functionality
  - Product listing and search
  - Shopping cart operations
  - Checkout process
- `example.spec.ts`: Example test scenarios and templates
- `homepage.spec.ts`: Homepage functionality tests
  - Navigation menu
  - Search functionality
  - Dynamic content loading
- `webinars-navigation.spec.ts`: Navigation tests for webinars section
  - Webinar listing
  - Filtering and sorting
  - Registration flow

### Test Configuration

The project uses `playwright.config.ts` for test configuration:
- Timeout settings
- Browser configurations
- Parallel execution settings
- Screenshot and video capture settings
- Viewport sizes
- Custom device emulation

### Running UI Tests

1. Run all UI tests:
```bash
npx playwright test tests/UI_tests/
```

2. Run a specific UI test file:
```bash
npx playwright test tests/UI_tests/homepage.spec.ts
```

3. Run UI tests with browser visible:
```bash
npx playwright test tests/UI_tests/ --headed
```

4. Run UI tests in debug mode:
```bash
npx playwright test tests/UI_tests/ --debug
```

5. Run tests with specific workers:
```bash
npx playwright test tests/UI_tests/ --workers=4
```

### Running Tests in Different Browsers

By default, tests run in all configured browsers. To run in specific browsers:

```bash
# Run in Chromium only
npx playwright test tests/UI_tests/ --project=chromium

# Run in Firefox only
npx playwright test tests/UI_tests/ --project=firefox

# Run in WebKit only
npx playwright test tests/UI_tests/ --project=webkit
```

### Test Reports and Artifacts

1. HTML Report:
```bash
npx playwright show-report
```

2. Generate and open report after test run:
```bash
npx playwright test tests/UI_tests/ --reporter=html && npx playwright show-report
```

3. Locate test artifacts:
- Screenshots: `test-results/*/screenshots/`
- Videos: `test-results/*/video/`
- Traces: `test-results/*/traces/`

### UI Test Best Practices

1. Keep test files organized by feature or page
2. Use Page Object Model pattern when applicable
3. Write descriptive test names
4. Add proper assertions for UI elements
5. Handle dynamic content and loading states
6. Use test isolation to prevent dependencies between tests
7. Implement retry mechanisms for flaky tests
8. Use test data fixtures for consistent test data
9. Implement custom test helpers for common operations
10. Follow mobile-first testing approach when applicable

### Debugging Tips

1. Use Playwright Inspector:
```bash
PWDEBUG=1 npx playwright test tests/UI_tests/
```

2. Save trace for failed tests:
```bash
npx playwright test tests/UI_tests/ --trace on-first-retry
```

3. Record test scripts:
```bash
npx playwright codegen http://your-application-url
```

4. Take screenshots during test execution:
```bash
npx playwright test tests/UI_tests/ --screenshot=on
```

## Troubleshooting

1. If the server fails to start with EADDRINUSE:
```bash
lsof -i :3000  # Find process using port 3000
kill -9 <PID>  # Kill the process
```

2. If tests fail with connection refused:
   - Ensure the Mock API server is running
   - Verify it's accessible at http://localhost:3000

## Data Types for Custom Schema

Available types for custom data generation:
- name: Random full name
- email: Random email address
- phone: Random phone number
- address: Random street address
- company: Random company name
- date: Random recent date
- number: Random number
- boolean: Random true/false value

## Environment Requirements

- Node.js 14+
- npm 6+
- Playwright Test Runner

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for any new functionality
4. Ensure all tests pass
5. Submit a pull request
