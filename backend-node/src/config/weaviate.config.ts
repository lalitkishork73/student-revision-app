import weaviate, { WeaviateClient } from "weaviate-client";
import dotenv from "dotenv";

dotenv.config();

let clientInstance: WeaviateClient | null = null;

export async function initWeaviateClient(): Promise<WeaviateClient> {
  if (clientInstance) {
    return clientInstance;
  }

  const host = (process.env.WEAVIATE_CLUSTER_URL || "").replace(/^https?:\/\//, "");

  try {
    clientInstance = await weaviate.connectToWeaviateCloud(host, {
      authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY || ""),
    });

    console.log("Weaviate client initialized successfully");
    return clientInstance;
  } catch (err: any) {
    console.error("Failed to initialize Weaviate client:", err?.message || err);
    throw new Error("Weaviate client initialization failed");
  }
}

export function getWeaviateClient(): WeaviateClient {
  if (!clientInstance) {
    throw new Error("Weaviate client not initialized. Call initWeaviateClient() first.");
  }
  return clientInstance;
}

export async function closeWeaviateClient(): Promise<void> {
  if (clientInstance) {
    await clientInstance.close();
    clientInstance = null;
    console.log("Weaviate client closed");
  }
}
