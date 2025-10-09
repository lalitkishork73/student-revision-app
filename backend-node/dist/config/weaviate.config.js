"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWeaviateClient = initWeaviateClient;
exports.getWeaviateClient = getWeaviateClient;
exports.closeWeaviateClient = closeWeaviateClient;
const weaviate_client_1 = __importDefault(require("weaviate-client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let clientInstance = null;
async function initWeaviateClient() {
    if (clientInstance) {
        return clientInstance;
    }
    const host = (process.env.WEAVIATE_CLUSTER_URL || "").replace(/^https?:\/\//, "");
    try {
        clientInstance = await weaviate_client_1.default.connectToWeaviateCloud(host, {
            authCredentials: new weaviate_client_1.default.ApiKey(process.env.WEAVIATE_API_KEY || ""),
        });
        console.log("Weaviate client initialized successfully");
        return clientInstance;
    }
    catch (err) {
        console.error("Failed to initialize Weaviate client:", err?.message || err);
        throw new Error("Weaviate client initialization failed");
    }
}
function getWeaviateClient() {
    if (!clientInstance) {
        throw new Error("Weaviate client not initialized. Call initWeaviateClient() first.");
    }
    return clientInstance;
}
async function closeWeaviateClient() {
    if (clientInstance) {
        await clientInstance.close();
        clientInstance = null;
        console.log("Weaviate client closed");
    }
}
