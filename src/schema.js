const { SchemaType } = require("@google/generative-ai");

// 1. E-Commerce Product Schema
const productSchema = {
    type: SchemaType.OBJECT,
    properties: {
        product_name: { type: SchemaType.STRING, description: "Full name of the product" },
        price: { type: SchemaType.NUMBER, description: "Price as a number without currency symbols" },
        in_stock: { type: SchemaType.BOOLEAN, description: "Is the product currently in stock?" },
        rating: { type: SchemaType.NUMBER, description: "Average user rating out of 5, if available" }
    },
    required: ["product_name", "price", "in_stock"],
};

// 2. Article & News Schema
const articleSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING, description: "Title of the article or news piece" },
        author: { type: SchemaType.STRING, description: "Name of the author, if found" },
        publish_date: { type: SchemaType.STRING, description: "Date the article was published" },
        summary: { type: SchemaType.STRING, description: "A 2-sentence summary of the article" },
        key_topics: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING }, 
            description: "List of main entities or topics discussed" 
        }
    },
    required: ["title", "summary", "key_topics"],
};

// 3. Job Posting Schema
const jobSchema = {
    type: SchemaType.OBJECT,
    properties: {
        job_title: { type: SchemaType.STRING, description: "Title of the open position" },
        company: { type: SchemaType.STRING, description: "Name of the hiring company" },
        location: { type: SchemaType.STRING, description: "Job location or remote status" },
        salary_range: { type: SchemaType.STRING, description: "Salary range if explicitly mentioned" },
        requirements: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING }, 
            description: "List of key skills or requirements for the job" 
        }
    },
    required: ["job_title", "company", "location", "requirements"],
};

// 4. Safe Fallback (General) Schema
const generalSchema = {
    type: SchemaType.OBJECT,
    properties: {
        page_purpose: { type: SchemaType.STRING, description: "What is the main purpose of this webpage?" },
        main_text: { type: SchemaType.STRING, description: "A concise summary of the most important information on the page" }
    },
    required: ["page_purpose", "main_text"],
};

// Export all 4 schemas
module.exports = { productSchema, articleSchema, jobSchema, generalSchema };
