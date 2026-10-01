const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function fetchCleanHtml(url) {
    console.log(`🌍 Opening invisible browser to fetch: ${url}`);
    
    // Launch headless browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Go to URL and wait for the network to be idle (so React/JS loads)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Get raw HTML
    const rawHtml = await page.content();
    await browser.close();

    console.log(`🧹 Cleaning HTML to save AI tokens...`);
    
    // Load into Cheerio to clean it
    const $ = cheerio.load(rawHtml);
    
    // Remove useless tags that confuse the AI and waste tokens
    $('script, style, svg, img, noscript, meta, link, header, footer').remove();
    
    // Return the cleaned text structure along with sizes for our metrics
    const cleanHtml = $.text().replace(/\s+/g, ' ').trim();
    return {
        rawSize: rawHtml.length,
        cleanSize: cleanHtml.length,
        cleanHtml: cleanHtml
    };
}

module.exports = { fetchCleanHtml };
