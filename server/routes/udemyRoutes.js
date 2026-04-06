const express = require('express');
const router = express.Router();

// Udemy API Kurs Proxy
router.get('/courses', async (req, res) => {
    try {
        const client_id = process.env.UDEMY_CLIENT_ID;
        const client_secret = process.env.UDEMY_CLIENT_SECRET;

        if (!client_id || !client_secret) {
            console.warn('Udemy API credentials missing from .env');
            return res.status(200).json({ 
                results: [], 
                message: 'Udemy API keys required for live results' 
            });
        }

        const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
        const search = req.query.search || 'programming';
        
        const response = await fetch(`https://www.udemy.com/api-2.0/courses/?page_size=12&search=${encodeURIComponent(search)}&fields[course]=title,headline,image_480x270,avg_rating,url,num_subscribers`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Udemy API Error:', error);
            return res.status(response.status).json(error);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch from Udemy:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
