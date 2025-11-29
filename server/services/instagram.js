const puppeteer = require('puppeteer');

async function getPostCaption(postUrl) {
    let browser;
    try {
        console.log('Launching browser to scrape Instagram...');
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ko-KR']
        });
        const page = await browser.newPage();

        // Set user agent to avoid being blocked immediately
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log(`Navigating to ${postUrl}...`);
        await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Extract content from meta tag
        // Instagram usually puts the caption in og:description or title
        // Format: "Username on Instagram: "Caption...""
        const description = await page.$eval('meta[property="og:description"]', element => element.content);

        console.log('Scraped description:', description);

        if (!description) {
            throw new Error('No description found');
        }

        // Clean up the description
        // Usually starts with "Username on Instagram: " or similar
        // We can try to extract the part after the first colon or quote, but it varies.
        // For now, returning the whole description is safer, or simple cleanup:

        // Remove "Username on Instagram: " prefix if present (heuristic)
        let caption = description;
        const match = description.match(/on Instagram: "([^"]+)"/);
        if (match && match[1]) {
            caption = match[1];
        } else {
            // Fallback: try to remove the " - Instagram" suffix or similar
            caption = caption.replace(/ - Instagram.*$/, '');
        }

        return caption;

    } catch (error) {
        console.error('Puppeteer Scraping Error:', error.message);
        throw new Error('Failed to fetch Instagram post info (Scraping failed)');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { getPostCaption };
