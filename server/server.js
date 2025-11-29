const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { getPostCaption } = require('./services/instagram');
const { generateComments } = require('./services/ai');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// Basic health check route (moved to /api/health)
app.get('/api/health', (req, res) => {
    res.send('Insta AI Comment Helper API is running');
});

// Endpoint for comment generation
app.post('/api/generate-comments', async (req, res) => {
    const { url, tone, length } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    try {
        // 1. Get Caption
        let caption = '';
        try {
            caption = await getPostCaption(url);
        } catch (err) {
            console.warn('Instagram fetch failed, using fallback or empty caption:', err.message);
            return res.status(422).json({
                success: false,
                message: 'Failed to fetch Instagram post. Please ensure the URL is correct and public.'
            });
        }

        // 2. Generate Comments
        const comments = await generateComments(caption, tone, length);

        res.json({
            success: true,
            url: url,
            caption: caption,
            comments: comments
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
