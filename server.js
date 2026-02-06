import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory data store
let restaurants = [
    {
        id: 'cafe-alram',
        name: 'Cafe Alram',
        tableCount: 20,
        menu: [],
        menuImage: null,
        logo: null,
        instagramUrl: '',
        googleMapsUrl: '',
        websiteUrl: ''
    },
    {
        id: 'burger-joint',
        name: 'Burger Point',
        tableCount: 15,
        menu: [],
        menuImage: null,
        logo: null,
        instagramUrl: '',
        googleMapsUrl: '',
        websiteUrl: ''
    }
];

let requests = [];

// --- Restaurants ---

// GET (Admin) - List all restaurants
app.get('/api/restaurants', (req, res) => {
    res.json(restaurants);
});

// GET - Get single restaurant
app.get('/api/restaurants/:id', (req, res) => {
    const r = restaurants.find(x => x.id === req.params.id);
    if (!r) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(r);
});

// PUT - Update Restaurant (Menu Image, Logo, Socials)
app.put('/api/restaurants/:id', (req, res) => {
    const r = restaurants.find(x => x.id === req.params.id);
    if (!r) return res.status(404).json({ error: 'Restaurant not found' });

    // Update fields if present in body
    if (req.body.menu !== undefined) r.menu = req.body.menu;
    if (req.body.menuImage !== undefined) r.menuImage = req.body.menuImage;
    if (req.body.logo !== undefined) r.logo = req.body.logo;
    if (req.body.instagramUrl !== undefined) r.instagramUrl = req.body.instagramUrl;
    if (req.body.googleMapsUrl !== undefined) r.googleMapsUrl = req.body.googleMapsUrl;
    if (req.body.websiteUrl !== undefined) r.websiteUrl = req.body.websiteUrl;
    if (req.body.name !== undefined) r.name = req.body.name;

    console.log(`[Update] ${r.name} updated settings`);
    res.json({ success: true, restaurant: r });
});

// --- Requests ---

// GET all requests (with optional filtering)
app.get('/api/requests', (req, res) => {
    const { restaurantId, tableId } = req.query;

    let filtered = requests;
    if (restaurantId) {
        filtered = filtered.filter(r => r.restaurantId === restaurantId);
    }
    if (tableId) {
        filtered = filtered.filter(r => r.tableId === tableId);
    }

    res.json(filtered);
});

// POST new request
app.post('/api/requests', (req, res) => {
    const newRequest = req.body;
    // Basic validation
    if (!newRequest.tableId || !newRequest.type || !newRequest.restaurantId) {
        return res.status(400).json({ error: 'Missing tableId, type, or restaurantId' });
    }

    // Check if restaurant exists
    if (!restaurants.find(r => r.id === newRequest.restaurantId)) {
        return res.status(404).json({ error: 'Invalid restaurantId' });
    }

    // Server-side timestamp to ensure consistency
    const requestWithTimestamp = {
        ...newRequest,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        status: 'PENDING'
    };

    requests.unshift(requestWithTimestamp); // Add to top
    console.log(`[${newRequest.restaurantId}] Table ${newRequest.tableId}: ${newRequest.type}`);
    res.status(201).json(requestWithTimestamp);
});

// PUT update request (complete)
app.put('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index] = { ...requests[index], status };
        console.log(`[Update Request] ${id} -> ${status}`);
        res.json(requests[index]);
    } else {
        res.status(404).json({ error: 'Request not found' });
    }
});

// Clear all requests (optional dev helper)
app.delete('/api/requests', (req, res) => {
    requests = [];
    console.log('[Reset] All requests cleared');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API accessible at http://localhost:${PORT}/api/requests`);
});
