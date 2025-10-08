// src/config/r2.config.ts
import { S3Client } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.CF_ACCOUNT_ID!;
const R2_ACCESS_KEY = process.env.CF_ACCESS_KEY_ID!;
const R2_SECRET_KEY = process.env.CF_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.CF_BUCKET_NAME!;

// S3-compatible endpoint for Cloudflare R2
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_PUBLIC_URL = process.env.CF_PUBLIC_URL;

export const r2Client = new S3Client({
  endpoint: R2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export { R2_BUCKET_NAME, R2_ENDPOINT, R2_PUBLIC_URL };
