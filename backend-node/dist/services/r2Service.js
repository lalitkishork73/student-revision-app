"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPDFToR2 = uploadPDFToR2;
// src/services/r2Upload.service.ts
const client_s3_1 = require("@aws-sdk/client-s3");
const r2_1 = require("../config/r2");
async function uploadPDFToR2(fileBuffer, fileName) {
    try {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: r2_1.R2_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: "application/pdf",
            //   ACL: "public-read", // optional: if you want public URL access
        });
        await r2_1.r2Client.send(command);
        // Return public URL (assuming bucket is public)
        return `${r2_1.R2_PUBLIC_URL}/${encodeURIComponent(fileName)}`;
    }
    catch (err) {
        console.error("R2 upload error:", err);
        throw new Error("Failed to upload PDF to R2");
    }
}
