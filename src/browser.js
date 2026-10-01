const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function fetchCleanHtml(url) {
    console.log(`[INFO] Launching headless browser session for URL: ${url}`);
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const rawHtml = await page.content();
    await browser.close();

    console.log(`[INFO] Sanitizing DOM structure and stripping extraneous nodes...`);
    
    const $ = cheerio.load(rawHtml);
    
    $('script, style, svg, img, noscript, meta, link, header, footer').remove();
    
    const cleanHtml = $.text().replace(/\s+/g, ' ').trim();
    return {
        rawSize: rawHtml.length,
        cleanSize: cleanHtml.length,
        cleanHtml: cleanHtml
    };
}

module.exports = { fetchCleanHtml };
