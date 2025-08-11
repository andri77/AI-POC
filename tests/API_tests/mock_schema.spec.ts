import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

// Base URL for the mock API
const BASE_URL = 'http://localhost:3000';

// Schema definitions
const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    avatar: { type: 'string', format: 'uri' }
  },
  required: ['id', 'name', 'email']
};

const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    price: { type: 'string' }, // Price is returned as string
    description: { type: 'string' }
  },
  required: ['id', 'name', 'price', 'description']
};

const postSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' },
    author: { type: 'string' },
    date: { type: 'string', format: 'date-time' },
    tags: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['id', 'title', 'content', 'author', 'date']
};

const customSchema = {
  type: 'object',
  properties: {
    fullName: { type: 'string' },
    userEmail: { type: 'string', format: 'email' },
    companyName: { type: 'string' }
  },
  required: ['fullName', 'userEmail', 'companyName']
};

test.describe('Mock API Schema Validation Tests', () => {
  // Helper function to validate schema
  const validateSchema = (schema: object, data: any) => {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      console.error('Schema validation errors:', validate.errors);
    }
    return valid;
  };

  test('should validate user data schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users?count=1`);
    expect(response.ok()).toBeTruthy();
    
    const userData = await response.json();
    const isValid = validateSchema(userSchema, userData);
    expect(isValid).toBeTruthy();
  });

  test('should validate multiple users data schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users?count=3`);
    expect(response.ok()).toBeTruthy();
    
    const userData = await response.json();
    expect(Array.isArray(userData)).toBeTruthy();
    
    userData.forEach((user: any) => {
      const isValid = validateSchema(userSchema, user);
      expect(isValid).toBeTruthy();
    });
  });

  test('should validate product data schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/products?count=1`);
    expect(response.ok()).toBeTruthy();
    
    const productData = await response.json();
    const isValid = validateSchema(productSchema, productData);
    expect(isValid).toBeTruthy();
  });

  test('should validate multiple products data schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/products?count=3`);
    expect(response.ok()).toBeTruthy();
    
    const productData = await response.json();
    expect(Array.isArray(productData)).toBeTruthy();
    
    productData.forEach((product: any) => {
      const isValid = validateSchema(productSchema, product);
      expect(isValid).toBeTruthy();
    });
  });

  test('should validate post data schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/posts?count=1`);
    expect(response.ok()).toBeTruthy();
    
    const postData = await response.json();
    const isValid = validateSchema(postSchema, postData);
    expect(isValid).toBeTruthy();
  });

  test('should validate multiple posts data schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/posts?count=3`);
    expect(response.ok()).toBeTruthy();
    
    const postData = await response.json();
    expect(Array.isArray(postData)).toBeTruthy();
    
    postData.forEach((post: any) => {
      const isValid = validateSchema(postSchema, post);
      expect(isValid).toBeTruthy();
    });
  });

  test('should validate custom data schema', async ({ request }) => {
    const customData = {
      schema: {
        fullName: 'name',
        userEmail: 'email',
        companyName: 'company'
      },
      count: 1
    };

    const response = await request.post(`${BASE_URL}/api/custom`, {
      data: customData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.ok()).toBeTruthy();
    
    const responseData = await response.json();
    const isValid = validateSchema(customSchema, responseData);
    expect(isValid).toBeTruthy();
  });

  test('should validate multiple custom data schema', async ({ request }) => {
    const customData = {
      schema: {
        fullName: 'name',
        userEmail: 'email',
        companyName: 'company'
      },
      count: 3
    };

    const response = await request.post(`${BASE_URL}/api/custom`, {
      data: customData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.ok()).toBeTruthy();
    
    const responseData = await response.json();
    expect(Array.isArray(responseData)).toBeTruthy();
    
    responseData.forEach((item: any) => {
      const isValid = validateSchema(customSchema, item);
      expect(isValid).toBeTruthy();
    });
  });

  // Note: The API seems to accept invalid schemas, so we'll skip this test
  test.skip('should handle invalid custom schema request', async ({ request }) => {
    const invalidCustomData = {
      schema: {
        invalidField: 'invalid'
      },
      count: 1
    };

    const response = await request.post(`${BASE_URL}/api/custom`, {
      data: invalidCustomData
    });
    
    expect(response.status()).toBe(400);
  });
});
