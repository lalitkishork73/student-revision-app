"use strict";
// weaviateConfig.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWeaviateConnection = checkWeaviateConnection;
exports.ensureSchema = ensureSchema;
exports.storeVectors = storeVectors;
exports.queryVectors = queryVectors;
// ============================================
// weaviateService.ts
const weaviate_client_1 = require("weaviate-client");
const weaviate_config_1 = require("../config/weaviate.config");
const chunkText_1 = require("../utils/chunkText");
const openaiService_1 = require("./openaiService");
async function checkWeaviateConnection() {
    try {
        //  initWeaviateClient()
        const client = (0, weaviate_config_1.getWeaviateClient)();
        const isReady = await client.isReady();
        if (!isReady) {
            throw new Error("Weaviate is not ready");
        }
        return true;
    }
    catch (err) {
        console.error("Weaviate connection failed:", err?.message || err);
        throw new Error("Weaviate unavailable");
    }
}
async function ensureSchema() {
    try {
        const client = (0, weaviate_config_1.getWeaviateClient)();
        const exists = await client.collections.exists("PDFChunk");
        if (exists) {
            return;
        }
        await client.collections.create({
            name: "PDFChunk",
            description: "PDF text chunks with page metadata",
            vectorizers: weaviate_client_1.vectors.text2VecOpenAI(),
            generative: weaviate_client_1.configure.generative.openAI(),
            properties: [
                {
                    name: "pdfId",
                    dataType: weaviate_client_1.dataType.TEXT,
                },
                {
                    name: "page",
                    dataType: weaviate_client_1.dataType.INT,
                },
                {
                    name: "text",
                    dataType: weaviate_client_1.dataType.TEXT,
                },
            ],
        });
        console.log("Created collection PDFChunk in Weaviate");
    }
    catch (err) {
        console.error("Ensure schema failed:", err);
        throw err;
    }
}
async function storeVectors(pages, chunkFn = chunkText_1.recursiveChunk) {
    if (!Array.isArray(pages) || pages.length === 0) {
        throw new Error("No pages to store");
    }
    await ensureSchema();
    const pdfId = Date.now().toString();
    const client = (0, weaviate_config_1.getWeaviateClient)();
    const collection = client.collections.get("PDFChunk");
    const objectsToInsert = [];
    for (const { page, text } of pages) {
        const chunks = chunkFn(text, 200, 50); // split into ~200 word chunks
        for (const chunk of chunks) {
            const embedding = await (0, openaiService_1.getEmbedding)(chunk);
            console.log(embedding);
            objectsToInsert.push({
                properties: {
                    pdfId,
                    page,
                    text: chunk,
                },
                vectors: embedding,
            });
        }
    }
    // console.log(objectsToInsert,"this is one");
    // Batch insert for better performance
    await collection.data.insertMany(objectsToInsert);
    return pdfId;
}
async function queryVectors(pdfId, questionEmbedding, topK = 4) {
    const client = (0, weaviate_config_1.getWeaviateClient)();
    const collection = client.collections.get("PDFChunk");
    const da = await collection.query.fetchObjects();
    const result = await collection.query.nearVector(questionEmbedding, {
        limit: topK,
        returnMetadata: ["distance"],
        filters: collection.filter.byProperty("pdfId").equal(pdfId),
    });
    // console.log("collection:", da);
    return da.objects.map((obj) => ({
        text: obj.properties.text,
        page: obj.properties.page,
        score: obj.metadata?.distance ?? null,
    }));
}
// ============================================
// Example usage in your main app or server:
async function startApp() {
    // Initialize Weaviate client at app startup
    await (0, weaviate_config_1.initWeaviateClient)();
    // Your app logic here...
    // Optionally close the client on shutdown
    process.on("SIGINT", async () => {
        await (0, weaviate_config_1.closeWeaviateClient)();
        process.exit(0);
    });
}
startApp();
