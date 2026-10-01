const fs = require('fs');
const path = require('path');
const { fetchCleanHtml } = require('./browser');
const { extractDataWithAI } = require('./agent');

const TEST_URLS = [
    // === PRODUCTS ===
    "https://webscraper.io/test-sites/e-commerce/allinone/product/50",
    "https://webscraper.io/test-sites/e-commerce/allinone/product/51",
    "https://webscraper.io/test-sites/e-commerce/allinone/product/52",
    "https://webscraper.io/test-sites/e-commerce/allinone/product/53",
    "https://webscraper.io/test-sites/e-commerce/allinone/product/54",
    
    // === ARTICLES ===
    "https://en.wikipedia.org/wiki/Artificial_intelligence",
    "https://en.wikipedia.org/wiki/Machine_learning",
    "https://en.wikipedia.org/wiki/Deep_learning",
    "https://en.wikipedia.org/wiki/Data_science",
    "https://en.wikipedia.org/wiki/Natural_language_processing",
    
    // === JOBS ===
    "https://realpython.github.io/fake-jobs/jobs/senior-python-developer-0.html",
    "https://realpython.github.io/fake-jobs/jobs/energy-engineer-1.html",
    "https://realpython.github.io/fake-jobs/jobs/legal-executive-2.html",
    "https://realpython.github.io/fake-jobs/jobs/fitness-centre-manager-3.html",
    "https://realpython.github.io/fake-jobs/jobs/product-manager-4.html",
    
    // === GENERAL (Fallbacks) ===
    "https://example.com",
    "https://www.w3.org/",
    "https://httpbin.org/html",
    "https://example.org",
    "https://info.cern.ch/hypertext/WWW/TheProject.html"
];

async function runBenchmark() {
    console.log(`🚀 Starting Agentic Scraper Benchmark on ${TEST_URLS.length} URLs...`);
    
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    let totalRawSize = 0;
    let totalCleanSize = 0;
    let successCount = 0;
    
    // Track routing accuracy internally for the report
    let routingStats = { PRODUCT: 0, ARTICLE: 0, JOB: 0, GENERAL: 0, UNKNOWN: 0 };

    for (let i = 0; i < TEST_URLS.length; i++) {
        const url = TEST_URLS[i];
        console.log(`\n[${i+1}/${TEST_URLS.length}] Processing: ${url}`);
        
        try {
            const { rawSize, cleanSize, cleanHtml } = await fetchCleanHtml(url);
            totalRawSize += rawSize;
            totalCleanSize += cleanSize;
            
            const data = await extractDataWithAI(cleanHtml);
            
            if (data && data.ExtractedData) {
                successCount++;
                const safeCategory = data.DetectedCategory || "UNKNOWN";
                routingStats[safeCategory] = (routingStats[safeCategory] || 0) + 1;
                
                const filename = `${safeCategory}_${Date.now()}.json`;
                fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(data, null, 2));
            }
            
            // Wait 8 seconds between URLs. 
            // Since we make 2 API calls per URL, this ensures we stay well under 
            // the free-tier limit of 15 Requests Per Minute.
            if (i < TEST_URLS.length - 1) {
                console.log("⏳ Waiting 8 seconds to respect free-tier API rate limits...");
                await new Promise(r => setTimeout(r, 8000));
            }
            
        } catch (error) {
            console.error(`❌ Error processing ${url}:`, error.message);
        }
    }

    console.log("\n==========================================");
    console.log("📊 FINAL BENCHMARK METRICS (For Resume)");
    console.log("==========================================");
    console.log(`✅ Extraction Success Rate: ${((successCount / TEST_URLS.length) * 100).toFixed(1)}% (${successCount}/${TEST_URLS.length})`);
    console.log(`🎯 Routing Breakdown:`);
    console.log(`   - Products: ${routingStats.PRODUCT}`);
    console.log(`   - Articles: ${routingStats.ARTICLE}`);
    console.log(`   - Jobs:     ${routingStats.JOB}`);
    console.log(`   - General:  ${routingStats.GENERAL}`);
    console.log(`📉 Total Raw HTML Downloaded: ${totalRawSize.toLocaleString()} characters`);
    console.log(`📉 Total Cleaned Text Sent to AI: ${totalCleanSize.toLocaleString()} characters`);
    
    if (totalRawSize > 0) {
        const reduction = ((totalRawSize - totalCleanSize) / totalRawSize) * 100;
        console.log(`🚀 Payload Reduction: ${reduction.toFixed(2)}% savings in LLM tokens and cost!`);
    }
    console.log("==========================================\n");
}

runBenchmark();
