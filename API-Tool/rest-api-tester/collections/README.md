# MOCK_GEN API Collection

This collection contains a set of pre-configured API requests to test the MOCK_GEN mock API generator.

## Collection Overview

### Base URL
- Development: `http://localhost:3000`
- Testing: `http://localhost:3000`

### Available Requests

1. **API Information**
   - Method: GET
   - Endpoint: `/`
   - Description: Get information about available endpoints

2. **User Data**
   - Generate Multiple Users
     - Method: GET
     - Endpoint: `/api/users?count=5`
   - Generate Single User
     - Method: GET
     - Endpoint: `/api/users?count=1`

3. **Product Data**
   - Generate Multiple Products
     - Method: GET
     - Endpoint: `/api/products?count=5`
   - Generate Single Product
     - Method: GET
     - Endpoint: `/api/products?count=1`

4. **Post Data**
   - Generate Multiple Posts
     - Method: GET
     - Endpoint: `/api/posts?count=5`
   - Generate Single Post
     - Method: GET
     - Endpoint: `/api/posts?count=1`

5. **Custom Data Generation**
   - User Profile Generator
     - Method: POST
     - Endpoint: `/api/custom`
     - Schema:
       ```json
       {
         "fullName": "name",
         "userEmail": "email",
         "phoneNumber": "phone",
         "address": "address",
         "companyName": "company",
         "joinDate": "date",
         "isActive": "boolean"
       }
       ```
   - Product Catalog Generator
     - Method: POST
     - Endpoint: `/api/custom`
     - Schema:
       ```json
       {
         "productName": "name",
         "price": "number",
         "manufacturer": "company",
         "inStock": "boolean",
         "lastUpdated": "date"
       }
       ```

## Using the Collection

1. Make sure the MOCK_GEN server is running on `http://localhost:3000`

2. Import the collection:
   - Open the REST API Tester
   - Load the collection from `collections/mock-gen-api.json`

3. Available Pre-request Scripts:
   - `setRandomCount`: Automatically sets a random count between 1 and 10 for data generation

## Testing Sequence

Recommended testing sequence:

1. Start with the API Information request to verify the server is running
2. Test basic data generation with single items (users, products, posts)
3. Test multiple item generation
4. Test custom data generation with different schemas

## Data Types for Custom Schema

Available data types for custom data generation:
- `name`: Random full name
- `email`: Random email address
- `phone`: Random phone number
- `address`: Random street address
- `company`: Random company name
- `date`: Random recent date
- `number`: Random number
- `boolean`: Random true/false value

## Error Handling

Common error responses:
- `400`: Invalid request (check your schema or parameters)
- `404`: Endpoint not found
- `500`: Server error

## Tips

1. Use the pre-request script `setRandomCount` to test with varying amounts of data
2. For custom data generation, start with simple schemas and gradually add complexity
3. Check response headers for rate limiting and other metadata
4. Use the environment variables to switch between different server instances
