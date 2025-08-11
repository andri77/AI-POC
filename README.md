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
