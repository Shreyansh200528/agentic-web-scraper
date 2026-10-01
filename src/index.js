const { fetchCleanHtml } = require("./browser");
const { extractDataWithAI } = require("./agent");

async function main() {
    // This is a dummy e-commerce site designed for testing web scrapers
    const testUrl = "https://codeforces.com/contest/2001/problem/C"; 
    
    console.log("🚀 Starting Agentic Scraper...");
    
    try {
        // Step 1: Grab and clean the HTML
        const htmlText = await fetchCleanHtml(testUrl);
        console.log(`✅ Fetched and cleaned webpage. Reduced size to: ${htmlText.length} characters.`);
        
        // Step 2: Use AI to extract the JSON
        const data = await extractDataWithAI(htmlText);
        
        console.log("\n🎉 Extraction Complete! Here is the structured JSON data:\n");
        console.log(JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error("An error occurred during execution:", error);
    }
}

main();
