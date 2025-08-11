import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './mock_schema.json';

const ajv = new Ajv();
addFormats(ajv);

// Example test with schema validation
test('should validate user response against schema', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/users');
    const data = await response.json();
    
    const validateUser = ajv.compile(schema.definitions.user);
    const valid = validateUser(data);
    expect(valid).toBeTruthy();
    if (!valid) {
        console.error('Validation errors:', validateUser.errors);
    }
});
