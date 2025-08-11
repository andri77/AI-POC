# Mock API Generator

A flexible mock API generator that creates random data for testing and development purposes.

## Features

- Generate mock data for users, products, and posts
- Custom data generation with user-defined schemas
- Support for generating multiple records
- RESTful API endpoints
- CORS enabled

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Get Mock Data
- GET `/api/users?count=5` - Get mock user data
- GET `/api/products?count=5` - Get mock product data
- GET `/api/posts?count=5` - Get mock post data

The `count` query parameter is optional and defaults to 1.

### Custom Mock Data
POST `/api/custom` - Generate custom mock data based on a schema

Example request body:
```json
{
    "schema": {
        "fullName": "name",
        "userEmail": "email",
        "phoneNumber": "phone",
        "companyName": "company",
        "isActive": "boolean",
        "createdAt": "date"
    },
    "count": 3
}
```

## Supported Data Types for Custom Schema

- name: Random full name
- email: Random email address
- phone: Random phone number
- address: Random street address
- company: Random company name
- date: Random recent date
- number: Random number
- boolean: Random true/false value

## Example Usage

### Get 5 mock users
```bash
curl http://localhost:3000/api/users?count=5
```

### Get a single product
```bash
curl http://localhost:3000/api/products
```

### Generate custom data
```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "schema": {
        "name": "name",
        "email": "email",
        "company": "company"
    },
    "count": 2
}' http://localhost:3000/api/custom
```
