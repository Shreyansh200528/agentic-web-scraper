const { fetchCleanHtml } = require("./browser");
const { extractDataWithAI } = require("./agent");

async function main() {
    const testUrl = "https://webscraper.io/test-sites/e-commerce/allinone/product/50"; 
    
    console.log("[INFO] Initializing extraction pipeline...");
    
    try {
        const { rawSize, cleanSize, cleanHtml } = await fetchCleanHtml(testUrl);
        console.log(`[INFO] DOM sanitization complete. Payload size reduced from ${rawSize} to ${cleanSize} bytes.`);
        
        const data = await extractDataWithAI(cleanHtml);
        
        console.log("\n[SUCCESS] Extraction completed successfully. Output:\n");
        console.log(JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error("[ERROR] Execution terminated due to exception:", error.message);
    }
}

main();
