# Autonomous Agentic Web Scraper

## Overview
The Autonomous Agentic Web Scraper is a Node.js-based data extraction pipeline that utilizes a Multi-Agent LLM architecture to intelligently scrape, classify, and structure data from the web. Unlike traditional scrapers that rely on fragile CSS selectors or XPaths, this system leverages zero-shot semantic extraction, making it highly resilient to dynamic UI and DOM changes.

## Capabilities & Features
- **Multi-Agent Semantic Routing:** Utilizes a fast "Router Agent" to classify incoming web pages (e.g., E-commerce, Articles, Job Postings, General) and dynamically select the appropriate strict JSON schema.
- **Zero-Shot Extraction:** Uses the Gemini API to extract nested, structured data directly from raw HTML, completely eliminating the need for manual DOM parsing.
- **Payload Sanitization:** Pre-processes HTML payloads with Cheerio to strip extraneous nodes (scripts, styles, SVGs), reducing LLM token consumption by over 90% and significantly decreasing latency.
- **Autonomous Self-Healing:** Built-in fault tolerance and backoff logic to seamlessly recover from HTTP 503 (Service Unavailable) and HTTP 429 (Rate Limiting) errors during batch processing.
- **Automated Benchmarking:** Includes a robust benchmarking suite to track extraction success rates, routing accuracy, and payload reduction metrics across heterogeneous endpoints.

## Performance Metrics
Based on automated batch benchmarking across distinct webpage categories, the extraction pipeline achieved the following results:
- **Extraction & Routing Success:** 100% accuracy in correctly identifying intent and structuring data.
- **Cost & Latency Optimization:** Achieved a **92.06% reduction** in LLM payload size (compressing 2.82 million raw HTML characters down to 224k sanitized text characters), drastically lowering API token costs.

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/agentic-web-scraper.git
   cd agentic-web-scraper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Ensure Browser Binary is Installed:**
   ```bash
   npx puppeteer browsers install chrome
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the root directory and securely add your Gemini API key:
   ```text
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

### Single URL Extraction
To test the extraction pipeline on a single predefined URL:
```bash
node src/index.js
```

### Batch Processing & Benchmarking
To process a batch of 20 URLs, track classification accuracy, respect API rate limits, and save the structured outputs:
```bash
node src/benchmark.js
```
*Note: The extracted JSON data will be serialized and saved to the `output/` directory.*

## Future Roadmap (Planned Enhancements)
The following advanced features are targeted for future iterations:
- **Stealth Mode Implementation:** Integrate `puppeteer-extra-plugin-stealth` to bypass advanced bot protection mechanisms (like Cloudflare) for stricter targets.
- **Autonomous Crawling (Agent 3):** Implement a third agent responsible for identifying pagination logic and "Next Page" links to enable recursive site-wide crawling without predefined URL arrays.
- **Direct Database Ingestion:** Replace the local file-system JSON serialization with a direct MongoDB or PostgreSQL ingestion pipeline for enterprise data storage.
