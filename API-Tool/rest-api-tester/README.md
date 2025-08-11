# REST API Testing Tool

A lightweight, browser-based REST API testing tool similar to Postman. This tool allows you to test HTTP endpoints, manage requests, view responses, and maintain a history of your API calls.

## Features

- 🚀 Support for all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- 📝 Request builder with URL parameters
- 🔑 Custom headers management
- 📦 JSON request body editor with validation
- 🎨 Response preview with syntax highlighting
- ⏱ Response timing and status information
- 📜 Request history (last 50 requests)
- 🔄 Reusable requests from history
- 📜 Pre-request scripts for dynamic request modification
- 🔄 Export requests as cURL commands
- 📁 Import and manage request collections

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository or download the source code:
```bash
git clone <repository-url>
# or download and extract the ZIP file
```

2. Navigate to the project directory:
```bash
cd rest-api-tester
```

3. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon, which automatically restarts when you make changes to the code.

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3001`

## Usage Guide

### Making a Request

1. **Enter URL**: Type your API endpoint URL in the URL input field
   - Example: `https://api.example.com/users`

2. **Select HTTP Method**: Choose from the dropdown menu:
   - GET: Retrieve data
   - POST: Create new data
   - PUT: Update existing data
   - DELETE: Remove data
   - PATCH: Partially update data

3. **Add Headers** (Optional):
   - Click the "Headers" tab
   - Add header key-value pairs (e.g., Authorization, Content-Type)
   - Click "+" to add more headers
   - Click "-" to remove headers

4. **Add URL Parameters** (Optional):
   - Click the "Params" tab
   - Add parameter key-value pairs
   - Parameters will be automatically appended to the URL
   - Example: `key=value` becomes `?key=value` in the URL

5. **Add Request Body** (for POST/PUT/PATCH):
   - Click the "Body" tab
   - Enter valid JSON data
   - The editor validates JSON format
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com"
   }
   ```

6. **Add Pre-request Script** (Optional):
   - Click the "Pre-request Script" tab
   - Write JavaScript code to modify the request before it's sent
   - Access request properties: `request.method`, `request.url`, `request.headers`, `request.data`
   - Store and access variables: `environment.set('key', 'value')`, `environment.get('key')`
   ```javascript
   // Example pre-request script
   request.headers['Authorization'] = 'Bearer ' + environment.get('token');
   request.data.timestamp = new Date().toISOString();
   environment.set('requestId', Math.random().toString(36).substring(7));
   ```

7. **Export as cURL**:
   - Click the "Copy as cURL" button to generate a cURL command
   - The command will be displayed and automatically copied to clipboard
   - Includes all headers, parameters, and request body
   - Perfect for sharing or using in scripts/terminal

8. **Import Collections**:
   - Click the "Import Collection" button in the sidebar
   - Select a JSON collection file
   - Collection structure:
   ```json
   {
     "name": "Collection Name",
     "description": "Collection description",
     "requests": [
       {
         "name": "Request Name",
         "description": "Request description",
         "method": "GET",
         "url": "http://api.example.com/endpoint",
         "headers": {
           "Accept": "application/json"
         },
         "body": {
           "key": "value"
         },
         "preRequestScript": "// Optional pre-request script"
       }
     ]
   }
   ```
   - Collections appear in the sidebar
   - Click on any request to load it

9. **Send Request**: Click the "Send" button

### Understanding the Response

The response section shows:
- HTTP Status Code (color-coded)
  - Green: Success (2xx)
  - Red: Error (4xx, 5xx)
- Response Time in milliseconds
- Response Headers
- Response Body (formatted JSON with syntax highlighting)

### Using Request History

- Recent requests appear in the sidebar
- Click any historical request to load it
- History shows:
  - HTTP method
  - URL
  - Status code
- Last 50 requests are stored

## Error Handling

Common errors and solutions:

1. **Invalid JSON Error**
   - Check your request body format
   - Ensure all quotes are properly closed
   - Validate JSON structure

2. **Connection Refused**
   - Verify the API endpoint is accessible
   - Check your internet connection
   - Confirm the API server is running

3. **CORS Error**
   - The tool includes CORS handling
   - If issues persist, check API server CORS settings

## Project Structure

```
rest-api-tester/
├── server.js           # Express server and API endpoint
├── package.json        # Project dependencies and scripts
└── public/
    ├── index.html     # Main application HTML
    ├── styles.css     # Application styles
    └── app.js         # Frontend JavaScript
```

## Development Notes

### Backend (`server.js`)
- Express server handles API requests
- Manages request history
- Handles CORS
- Proxies API requests to avoid CORS issues

### Frontend (`public/app.js`)
- Manages UI interactions
- Handles request/response formatting
- Maintains request history
- Provides JSON validation
- Handles error states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

1. **Server Won't Start**
   ```bash
   # Check if port 3001 is in use
   lsof -i :3001
   # Kill process if needed
   kill -9 <PID>
   ```

2. **Nodemon Not Found**
   ```bash
   # Install nodemon globally
   npm install -g nodemon
   ```

3. **Dependencies Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues and feature requests, please create an issue in the repository.
