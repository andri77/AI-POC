document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const methodSelect = document.getElementById('method');
    const urlInput = document.getElementById('url');
    const sendButton = document.getElementById('send');
    const copyButton = document.getElementById('copy-curl');
    const curlCommand = document.getElementById('curl-command');
    const requestBody = document.getElementById('request-body');
    const responseData = document.getElementById('response-data');
    const statusElement = document.querySelector('.status');
    const timeElement = document.querySelector('.time');
    const historyList = document.getElementById('history-list');
    const collectionsContainer = document.getElementById('collections-list');
    const importButton = document.getElementById('import-collection');
    const fileInput = document.getElementById('collection-file');

    // Store collections
    let collections = new Map();

    // Collection Management
    function addCollection(collection) {
        collections.set(collection.name, collection);
        updateCollectionsUI();
    }

    function updateCollectionsUI() {
        collectionsContainer.innerHTML = '';
        collections.forEach((collection, name) => {
            const collectionElement = document.createElement('div');
            collectionElement.className = 'collection-item';

            const header = document.createElement('div');
            header.className = 'collection-header';

            const nameElement = document.createElement('div');
            nameElement.className = 'collection-name';
            nameElement.textContent = name;

            const actionsElement = document.createElement('div');
            actionsElement.className = 'collection-actions';

            header.appendChild(nameElement);
            header.appendChild(actionsElement);
            collectionElement.appendChild(header);

            // Add requests
            collection.requests.forEach(request => {
                const requestElement = document.createElement('div');
                requestElement.className = 'collection-request';
                requestElement.textContent = request.name;
                requestElement.addEventListener('click', () => loadRequest(request));
                collectionElement.appendChild(requestElement);
            });

            collectionsContainer.appendChild(collectionElement);
        });
    }

    function loadRequest(request) {
        // Update UI with request data
        methodSelect.value = request.method;
        urlInput.value = request.url;
        
        // Clear existing headers
        document.querySelectorAll('.header-row:not(:first-child)').forEach(row => row.remove());
        const firstHeaderRow = document.querySelector('.header-row');
        const [keyInput, valueInput] = firstHeaderRow.querySelectorAll('input');
        keyInput.value = '';
        valueInput.value = '';

        // Add headers
        if (request.headers) {
            Object.entries(request.headers).forEach(([key, value], index) => {
                if (index === 0) {
                    // Use first row
                    keyInput.value = key;
                    valueInput.value = value;
                } else {
                    // Add new rows for additional headers
                    const headerRow = document.createElement('div');
                    headerRow.className = 'header-row';
                    headerRow.innerHTML = `
                        <input type="text" placeholder="Key" value="${key}" />
                        <input type="text" placeholder="Value" value="${value}" />
                        <button class="remove-header">-</button>
                    `;
                    document.querySelector('.headers-list').appendChild(headerRow);
                }
            });
        }

        // Update request body if exists
        if (request.body) {
            requestBody.value = JSON.stringify(request.body, null, 2);
        } else {
            requestBody.value = '';
        }

        // If there's a pre-request script, load it
        const preRequestScript = document.getElementById('pre-request-script');
        if (preRequestScript && request.preRequestScript) {
            preRequestScript.value = request.preRequestScript;
        }
    }

    // Import collection handling
    importButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const collection = JSON.parse(e.target.result);
                addCollection(collection);
                alert('Collection imported successfully!');
            } catch (error) {
                alert('Error importing collection: ' + error.message);
            }
        };
        reader.readAsText(file);
        fileInput.value = ''; // Reset file input
    });

    // Generate cURL command
    function generateCurlCommand() {
        let url = urlInput.value;
        const method = methodSelect.value;
        const headers = getHeaders();
        const params = getParams();
        let data = null;

        try {
            if (requestBody.value.trim()) {
                data = JSON.parse(requestBody.value);
            }
        } catch (e) {
            console.error('Invalid JSON in request body');
            return null;
        }

        // Add parameters to URL
        if (params.toString()) {
            url += (url.includes('?') ? '&' : '?') + params.toString();
        }

        // Start building cURL command
        let curlParts = [`curl -X ${method}`];

        // Add headers
        for (const [key, value] of Object.entries(headers)) {
            curlParts.push(`-H '${key}: ${value}'`);
        }

        // Add request body
        if (data) {
            curlParts.push(`-d '${JSON.stringify(data)}'`);
        }

        // Add URL (escaped)
        curlParts.push(`'${url.replace(/'/g, "'\\''")}'`);

        return curlParts.join(' \\\n    ');
    }

    // Copy cURL command to clipboard
    copyButton.addEventListener('click', () => {
        const curl = generateCurlCommand();
        if (!curl) {
            alert('Unable to generate cURL command. Please check your request configuration.');
            return;
        }

        // Show the cURL command
        curlCommand.textContent = curl;
        curlCommand.classList.add('show');

        // Copy to clipboard
        navigator.clipboard.writeText(curl).then(() => {
            const successMessage = document.createElement('div');
            successMessage.className = 'copy-success';
            successMessage.textContent = 'Copied!';
            curlCommand.appendChild(successMessage);

            // Show success message
            setTimeout(() => successMessage.classList.add('show'), 10);
            
            // Remove success message
            setTimeout(() => {
                successMessage.classList.remove('show');
                setTimeout(() => successMessage.remove(), 300);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
    });

    // Tab Handling
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            const tabContainer = button.closest('.tabs').nextElementSibling;
            
            // Update active button
            button.closest('.tabs').querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update active tab content
            tabContainer.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            tabContainer.querySelector(`#${tabName}`).classList.add('active');
        });
    });

    // Headers Management
    document.querySelector('.add-header').addEventListener('click', () => {
        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        headerRow.innerHTML = `
            <input type="text" placeholder="Key" />
            <input type="text" placeholder="Value" />
            <button class="remove-header">-</button>
        `;
        document.querySelector('.headers-list').appendChild(headerRow);
    });

    // Parameters Management
    document.querySelector('.add-param').addEventListener('click', () => {
        const paramRow = document.createElement('div');
        paramRow.className = 'param-row';
        paramRow.innerHTML = `
            <input type="text" placeholder="Key" />
            <input type="text" placeholder="Value" />
            <button class="remove-param">-</button>
        `;
        document.querySelector('.params-list').appendChild(paramRow);
    });

    // Remove header/param row
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-header') || e.target.classList.contains('remove-param')) {
            e.target.parentElement.remove();
        }
    });

    // Get headers from UI
    function getHeaders() {
        const headers = {};
        document.querySelectorAll('.header-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key && value) {
                headers[key] = value;
            }
        });
        return headers;
    }

    // Get parameters from UI
    function getParams() {
        const params = new URLSearchParams();
        document.querySelectorAll('.param-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key && value) {
                params.append(key, value);
            }
        });
        return params;
    }

    // Format JSON with syntax highlighting
    function formatJSON(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, 2);
        }
        return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
            function (match) {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
    }

    // Send Request
    sendButton.addEventListener('click', async () => {
        const method = methodSelect.value;
        let url = urlInput.value;
        const headers = getHeaders();
        const params = getParams();
        const preRequestScript = document.getElementById('pre-request-script').value;
        
        // Add parameters to URL
        if (params.toString()) {
            url += (url.includes('?') ? '&' : '?') + params.toString();
        }

        let data = null;
        if (requestBody.value.trim()) {
            try {
                data = JSON.parse(requestBody.value);
            } catch (e) {
                alert('Invalid JSON in request body');
                return;
            }
        }

        try {
            const startTime = new Date();
            const response = await fetch('/api/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method,
                    url,
                    headers,
                    data,
                    preRequestScript: preRequestScript.trim() || null
                })
            });

            const endTime = new Date();
            const responseJson = await response.json();

            // Update status
            statusElement.textContent = `${responseJson.status || response.status}`;
            statusElement.className = 'status ' + (response.ok ? 'success' : 'error');

            // Update time
            timeElement.textContent = `${endTime - startTime}ms`;

            // Update response
            responseData.innerHTML = formatJSON(responseJson);

            // Update history
            loadHistory();
        } catch (error) {
            statusElement.textContent = 'Error';
            statusElement.className = 'status error';
            responseData.textContent = error.message;
        }
    });

    // Load History
    async function loadHistory() {
        try {
            const response = await fetch('/api/history');
            const history = await response.json();
            
            historyList.innerHTML = history.map(item => `
                <div class="history-item">
                    <span class="method">${item.request.method}</span>
                    <span class="url">${item.request.url}</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    // Load history on startup
    loadHistory();
});
