"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2_PUBLIC_URL = exports.R2_ENDPOINT = exports.R2_BUCKET_NAME = exports.r2Client = void 0;
// src/config/r2.config.ts
const client_s3_1 = require("@aws-sdk/client-s3");
const R2_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.CF_ACCESS_KEY_ID;
const R2_SECRET_KEY = process.env.CF_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CF_BUCKET_NAME;
exports.R2_BUCKET_NAME = R2_BUCKET_NAME;
// S3-compatible endpoint for Cloudflare R2
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
exports.R2_ENDPOINT = R2_ENDPOINT;
const R2_PUBLIC_URL = process.env.CF_PUBLIC_URL;
exports.R2_PUBLIC_URL = R2_PUBLIC_URL;
exports.r2Client = new client_s3_1.S3Client({
    endpoint: R2_ENDPOINT,
    region: "auto",
    credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
    },
});
