import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './mock_schema.json';

const API_BASE_URL = 'http://localhost:3000';

// Initialize JSON Schema validator
const ajv = new Ajv();
addFormats(ajv);

// Compile validators for different response types
const validators = {
    root: ajv.compile(schema.properties.root),
    user: ajv.compile(schema.definitions.user),
    users: ajv.compile({
        type: 'array',
        items: schema.definitions.user
    }),
    product: ajv.compile(schema.definitions.product),
    products: ajv.compile({
        type: 'array',
        items: schema.definitions.product
    }),
    post: ajv.compile(schema.definitions.post),
    posts: ajv.compile({
        type: 'array',
        items: schema.definitions.post 
    }),
    error: ajv.compile(schema.properties.error)
};

// Helper function to validate response against schema
const validateResponse = (data: unknown, validatorType: keyof typeof validators) => {
    const validate = validators[validatorType];
    const isValid = validate(data);
    if (!isValid) {
        console.error('Validation errors:', validate.errors);
    }
    return isValid;
};

test.describe('Mock API Generator Tests', () => {
    test.beforeAll(async () => {
        // Ensure the server is running before tests
        try {
            const response = await fetch(API_BASE_URL);
            expect(response.ok).toBeTruthy();
        } catch (error) {
            console.error('Please ensure the mock API server is running on http://localhost:3000');
            throw error;
        }
    });

    test('should get API information from root endpoint', async ({ request }) => {
        const response = await request.get(API_BASE_URL);
        const data = await response.json();
        
        expect(response.ok()).toBeTruthy();
        expect(validateResponse(data, 'root')).toBeTruthy();
        expect(data.message).toBe('Mock API Generator');
        expect(data.endpoints).toBeInstanceOf(Array);
        expect(data.endpoints.length).toBeGreaterThan(0);
    });

    test('should generate a single mock user', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/api/users`);
        const user = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(validateResponse(user, 'user')).toBeTruthy();
        expect(user).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            avatar: expect.any(String),
            address: expect.any(String),
            phone: expect.any(String)
        });
    });

    test('should generate multiple mock users', async ({ request }) => {
        const count = 5;
        const response = await request.get(`${API_BASE_URL}/api/users?count=${count}`);
        const users = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(validateResponse(users, 'users')).toBeTruthy();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users).toHaveLength(count);
        expect(users[0]).toHaveProperty('id');
        expect(users[0]).toHaveProperty('email');
    });

    test('should generate a single mock product', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/api/products`);
        const product = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(validateResponse(product, 'product')).toBeTruthy();
        expect(product).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(String),
            description: expect.any(String),
            category: expect.any(String),
            image: expect.any(String)
        });
    });

    test('should generate multiple mock products', async ({ request }) => {
        const count = 3;
        const response = await request.get(`${API_BASE_URL}/api/products?count=${count}`);
        const products = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(validateResponse(products, 'products')).toBeTruthy();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products).toHaveLength(count);
        expect(products[0]).toHaveProperty('name');
        expect(products[0]).toHaveProperty('price');
    });

    test('should generate mock posts', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/api/posts?count=2`);
        const posts = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(posts)).toBeTruthy();
        expect(posts).toHaveLength(2);
        expect(posts[0]).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            content: expect.any(String),
            author: expect.any(String),
            date: expect.any(String),
            tags: expect.any(Array)
        });
    });

    test('should handle invalid type requests', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/api/invalid-type`);
        const data = await response.json();

        expect(response.status()).toBe(400);
        expect(validateResponse(data, 'error')).toBeTruthy();
        expect(data).toHaveProperty('error');
    });

    test('should generate custom mock data', async ({ request }) => {
        const customSchema = {
            schema: {
                fullName: 'name',
                userEmail: 'email',
                phoneNumber: 'phone',
                companyName: 'company',
                isActive: 'boolean',
                createdAt: 'date'
            },
            count: 2
        };

        const response = await request.post(`${API_BASE_URL}/api/custom`, {
            data: customSchema
        });
        const data = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(data)).toBeTruthy();
        expect(data).toHaveLength(2);
        expect(data[0]).toHaveProperty('fullName');
        expect(data[0]).toHaveProperty('userEmail');
        expect(data[0]).toHaveProperty('phoneNumber');
        expect(data[0]).toHaveProperty('companyName');
        expect(data[0]).toHaveProperty('isActive');
        expect(data[0]).toHaveProperty('createdAt');
    });

    test('should handle invalid custom schema', async ({ request }) => {
        const invalidSchema = {
            schema: 'invalid',
            count: 1
        };

        const response = await request.post(`${API_BASE_URL}/api/custom`, {
            data: invalidSchema
        });
        const data = await response.json();

        expect(response.status()).toBe(400);
        expect(data).toHaveProperty('error');
    });

    test('should handle missing schema in custom request', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/api/custom`, {
            data: { count: 1 }
        });
        const data = await response.json();

        expect(response.status()).toBe(400);
        expect(data).toHaveProperty('error');
    });
});
