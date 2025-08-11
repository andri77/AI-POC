import { test, expect } from '@playwright/test';

test.describe('Product Creation Tests', () => {
    const apiUrl = 'https://fakestoreapi.com/products';

    test('should create a product with valid input for title field', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                price: 13.5,
                title: 'Test Product',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.title).toBe('Test Product');
        expect(responseBody.price).toBe(13.5);
        expect(responseBody.description).toBe('lorem ipsum set');
        expect(responseBody.image).toBe('https://i.pravatar.cc');
        expect(responseBody.category).toBe('electronic');
    });

    test('should handle empty string for title field', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                price: 13.5,
                title: '',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.title).toBe('');
    });

    test('should handle null value for title field', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                price: 13.5,
                title: null,
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.title).toBe(null);
    });

    test('should create a product with valid image URL', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                price: 13.5,
                title: 'Test Product',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.image).toBe('https://i.pravatar.cc');
    });

    test('should handle empty string for image field', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: '',
                price: 13.5,
                title: 'Test Product',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.image).toBe('');
    });

    test('should handle null value for image field', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: null,
                price: 13.5,
                title: 'Test Product',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.image).toBe(null);
    });

    test('should handle missing price field', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                title: 'Test Product',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.price).toBeUndefined();
    });

    test('should handle negative price', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                price: -13.5,
                title: 'Test Product',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.price).toBe(-13.5);
    });

    test('should handle zero price', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                price: 0,
                title: 'Test Product',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.price).toBe(0);
    });

    test('should handle very long title', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                image: 'https://i.pravatar.cc',
                price: 13.5,
                title: 'This is a very long title that exceeds the typical character limit for titles in the application',
                category: 'electronic',
                description: 'lorem ipsum set'
            }
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.title).toBe('This is a very long title that exceeds the typical character limit for titles in the application');
    });
});