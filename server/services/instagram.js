const axios = require('axios');

async function getPostCaption(postUrl) {
    try {
        // Instagram oEmbed API endpoint
        const oEmbedUrl = `https://graph.facebook.com/v17.0/instagram_oembed?url=${encodeURIComponent(postUrl)}&access_token=${process.env.FB_ACCESS_TOKEN}`;

        // Note: oEmbed requires an access token (App Access Token or User Access Token)
        // If we don't have a token, we might need to rely on a different method or ask the user for one.
        // For now, we assume the user provides a token in .env

        const response = await axios.get(oEmbedUrl);

        if (response.data && response.data.title) {
            return response.data.title; // The caption is often in the 'title' field for oEmbed
        } else {
            throw new Error('Caption not found in oEmbed response');
        }
    } catch (error) {
        console.error('Error fetching Instagram post:', error.message);
        // Fallback or re-throw
        throw new Error('Failed to fetch Instagram post info');
    }
}

module.exports = { getPostCaption };
