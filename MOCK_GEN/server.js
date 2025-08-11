const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const faker = require('faker');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to generate random data
const generateMockData = (type, count = 1) => {
    const generateSingleItem = () => {
        switch (type) {
            case 'user':
                return {
                    id: faker.datatype.uuid(),
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    avatar: faker.internet.avatar(),
                    address: faker.address.streetAddress(),
                    phone: faker.phone.phoneNumber()
                };
            case 'product':
                return {
                    id: faker.datatype.uuid(),
                    name: faker.commerce.productName(),
                    price: faker.commerce.price(),
                    description: faker.commerce.productDescription(),
                    category: faker.commerce.department(),
                    image: faker.image.imageUrl()
                };
            case 'post':
                return {
                    id: faker.datatype.uuid(),
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraphs(),
                    author: faker.name.findName(),
                    date: faker.date.recent(),
                    tags: Array(3).fill().map(() => faker.lorem.word())
                };
            default:
                return { error: 'Invalid type specified' };
        }
    };

    return count > 1 
        ? Array(count).fill().map(() => generateSingleItem())
        : generateSingleItem();
};

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Mock API Generator',
        endpoints: [
            { path: '/api/users', description: 'Get mock user data' },
            { path: '/api/products', description: 'Get mock product data' },
            { path: '/api/posts', description: 'Get mock post data' }
        ]
    });
});

// Dynamic route handler for different types of mock data
app.get('/api/:type', (req, res) => {
    const { type } = req.params;
    const count = parseInt(req.query.count) || 1;
    
    if (!['users', 'products', 'posts'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type specified' });
    }

    const singularType = type.slice(0, -1); // Remove 's' to get singular form
    const mockData = generateMockData(singularType, count);
    res.json(mockData);
});

// Custom mock data endpoint with specific schema
app.post('/api/custom', (req, res) => {
    const { schema, count = 1 } = req.body;
    
    if (!schema || typeof schema !== 'object') {
        return res.status(400).json({ error: 'Invalid schema provided' });
    }

    const generateCustomData = () => {
        const result = {};
        for (const [key, type] of Object.entries(schema)) {
            switch (type) {
                case 'name':
                    result[key] = faker.name.findName();
                    break;
                case 'email':
                    result[key] = faker.internet.email();
                    break;
                case 'phone':
                    result[key] = faker.phone.phoneNumber();
                    break;
                case 'address':
                    result[key] = faker.address.streetAddress();
                    break;
                case 'company':
                    result[key] = faker.company.companyName();
                    break;
                case 'date':
                    result[key] = faker.date.recent();
                    break;
                case 'number':
                    result[key] = faker.datatype.number();
                    break;
                case 'boolean':
                    result[key] = faker.datatype.boolean();
                    break;
                default:
                    result[key] = faker.lorem.word();
            }
        }
        return result;
    };

    const mockData = count > 1 
        ? Array(count).fill().map(() => generateCustomData())
        : generateCustomData();

    res.json(mockData);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Mock API Generator running on http://localhost:${port}`);
});
