const { GoogleGenerativeAI } = require("@google/generative-ai");
const schemas = require("./schema");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("[FATAL] Environment variable GEMINI_API_KEY is not defined. Execution terminated.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function fetchFromGeminiWithRetry(model, prompt) {
    let result;
    let retries = 5;
    while (retries > 0) {
        try {
            result = await model.generateContent(prompt);
            return result;
        } catch (err) {
            if (err.status === 503 && retries > 1) {
                console.log(`[WARN] HTTP 503 Service Unavailable encountered. Initiating 3000ms backoff...`);
                await new Promise(r => setTimeout(r, 3000));
                retries--;
            } else if (err.status === 429 && retries > 1) {
                console.log(`[WARN] HTTP 429 Too Many Requests encountered. Enforcing 40000ms rate-limit backoff...`);
                await new Promise(r => setTimeout(r, 40000));
                retries--;
            } else {
                throw err;
            }
        }
    }
}

async function extractDataWithAI(cleanHtml) {
    const textChunk = cleanHtml.substring(0, 50000); 
    
    console.log(`[INFO] [Router Agent] Analyzing DOM payload for intent classification...`);
    const routerModel = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const routerPrompt = `You are a semantic router. Look at the following webpage text and classify it into exactly ONE of these four categories: PRODUCT, ARTICLE, JOB, or GENERAL.
    Respond with ONLY the exact category word in uppercase. No other text.
    
    Webpage: ${textChunk}`;
    
    let category = "GENERAL";
    try {
        const routerResult = await fetchFromGeminiWithRetry(routerModel, routerPrompt);
        category = routerResult.response.text().trim().toUpperCase();
        
        if (!["PRODUCT", "ARTICLE", "JOB", "GENERAL"].includes(category)) {
            category = "GENERAL";
        }
    } catch (err) {
        console.error("[ERROR] Router agent exception encountered. Defaulting to GENERAL schema fallback.");
    }

    console.log(`[INFO] [Router Agent] Classification resolved: ${category}. Schema selected.`);

    let selectedSchema;
    if (category === "PRODUCT") selectedSchema = schemas.productSchema;
    else if (category === "ARTICLE") selectedSchema = schemas.articleSchema;
    else if (category === "JOB") selectedSchema = schemas.jobSchema;
    else selectedSchema = schemas.generalSchema;


    console.log(`[INFO] [Extractor Agent] Initiating structured data extraction via LLM...`);
    
    const extractorModel = genAI.getGenerativeModel({ 
        model: "gemini-3.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: selectedSchema,
            temperature: 0.1, 
        }
    });

    const extractorPrompt = `You are an expert web scraper. Extract the details from the following raw webpage text. 
    
    CRITICAL RULES:
    1. If a field is not explicitly stated on the page, you MUST return null. 
    2. Do NOT guess or hallucinate values (e.g. do not use the title as the author).
    
    Webpage Text:
    ${textChunk}`;

    try {
        const result = await fetchFromGeminiWithRetry(extractorModel, extractorPrompt);
        const extractedJson = JSON.parse(result.response.text());
        
        return { 
            DetectedCategory: category, 
            ExtractedData: extractedJson 
        };
    } catch (error) {
        console.error("[ERROR] Extractor agent exception:", error.message);
        return null;
    }
}

module.exports = { extractDataWithAI };
