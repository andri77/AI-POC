const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const vm = require('vm');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create sandbox for pre-request scripts
const createSandbox = () => {
    return {
        request: {
            method: '',
            url: '',
            headers: {},
            data: null
        },
        environment: new Map(),
        console: {
            log: console.log,
            error: console.error
        },
        setTimeout,
        clearTimeout,
        Buffer,
        Date,
        Math,
        JSON
    };
};

// Store request history
let requestHistory = [];

// Execute pre-request script
const executePreRequestScript = (script, requestData) => {
    const sandbox = createSandbox();
    sandbox.request = {
        method: requestData.method || 'GET',
        url: requestData.url,
        headers: requestData.headers || {},
        data: requestData.data
    };

    const context = vm.createContext(sandbox);
    
    try {
        vm.runInContext(script, context, { timeout: 5000 });
        return {
            success: true,
            request: sandbox.request,
            environment: Object.fromEntries(sandbox.environment)
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Make HTTP requests
app.post('/api/request', async (req, res) => {
    const { url, method, headers, data, preRequestScript } = req.body;
    
    try {
        let requestConfig = { method: method || 'GET', url, headers, data };

        // Execute pre-request script if provided
        if (preRequestScript) {
            const scriptResult = executePreRequestScript(preRequestScript, requestConfig);
            if (!scriptResult.success) {
                return res.status(400).json({
                    error: 'Pre-request script error',
                    details: scriptResult.error
                });
            }
            // Update request with modified values from pre-request script
            requestConfig = {
                method: scriptResult.request.method,
                url: scriptResult.request.url,
                headers: scriptResult.request.headers,
                data: scriptResult.request.data
            };
        }

        const response = await axios(requestConfig);

        // Save to history
        requestHistory.unshift({
            timestamp: new Date(),
            request: req.body,
            response: {
                status: response.status,
                headers: response.headers,
                data: response.data
            }
        });

        // Keep only last 50 requests
        if (requestHistory.length > 50) {
            requestHistory = requestHistory.slice(0, 50);
        }

        res.json({
            status: response.status,
            headers: response.headers,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            response: error.response ? {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            } : null
        });
    }
});

// Get request history
app.get('/api/history', (req, res) => {
    res.json(requestHistory);
});

app.listen(port, () => {
    console.log(`REST API Tester running at http://localhost:${port}`);
});
