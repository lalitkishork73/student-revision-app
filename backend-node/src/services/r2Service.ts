// src/services/r2Upload.service.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_ENDPOINT,R2_PUBLIC_URL } from "../config/r2";

export async function uploadPDFToR2(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: "application/pdf",
    //   ACL: "public-read", // optional: if you want public URL access
    });

    await r2Client.send(command);

    // Return public URL (assuming bucket is public)
    return `${R2_PUBLIC_URL}/${encodeURIComponent(fileName)}`;
  } catch (err) {
    console.error("R2 upload error:", err);
    throw new Error("Failed to upload PDF to R2");
  }
}
