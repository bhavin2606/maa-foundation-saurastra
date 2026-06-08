import crypto from "crypto";
import "../lib/env.js";
import { logger } from "../lib/logger.js";

type UploadDonationImageInput = {
  file: Express.Multer.File;
  donorEmail: string;
  donorName: string;
};

type UploadDonationImageResult = {
  publicId: string;
  url: string;
};

type UploadCampaignImageInput = {
  file: Express.Multer.File;
  campaignTitle: string;
};

function sanitizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function buildDonorKey(donorEmail: string, donorName: string) {
  const normalizedEmail = donorEmail.trim().toLowerCase();
  const hashedIdentity = crypto.createHash("sha256").update(normalizedEmail).digest("hex").slice(0, 16);
  const readableName = sanitizeSegment(donorName) || "donor";

  return `${readableName}-${hashedIdentity}`;
}

function buildCloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const serializedParams = Object.entries(params)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${serializedParams}${apiSecret}`).digest("hex");
}

export class ImageStorageService {
  static async uploadDonationScreenshot({
    file,
    donorEmail,
    donorName,
  }: UploadDonationImageInput): Promise<UploadDonationImageResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const baseFolder = process.env.CLOUDINARY_FOLDER || "maa-foundation";

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    }

    const donorKey = buildDonorKey(donorEmail, donorName);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = `${baseFolder}/donations/${donorKey}`;
    const publicId = `payment-proof-${Date.now()}`;

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
      use_filename: "false",
    };

    const signature = buildCloudinarySignature(paramsToSign, apiSecret);
    const formData = new FormData();

    formData.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append("use_filename", "false");
    formData.append("signature", signature);

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text();
      logger.error("Donation screenshot upload failed", errorBody, {
        donorKey,
        statusCode: uploadResponse.status,
      });
      throw new Error("Failed to upload donation screenshot");
    }

    const uploadResult = (await uploadResponse.json()) as {
      public_id?: string;
      secure_url?: string;
    };

    if (!uploadResult.public_id || !uploadResult.secure_url) {
      throw new Error("Image upload response was incomplete");
    }

    logger.info("Donation screenshot uploaded", {
      donorKey,
      publicId: uploadResult.public_id,
    });

    return {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  static async uploadCampaignImage({
    file,
    campaignTitle,
  }: UploadCampaignImageInput): Promise<UploadDonationImageResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const baseFolder = process.env.CLOUDINARY_FOLDER || "maa-foundation";

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    }

    const readableTitle = sanitizeSegment(campaignTitle) || "campaign";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = `${baseFolder}/campaigns`;
    const publicId = `${readableTitle}-${Date.now()}`;

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
      use_filename: "false",
    };

    const signature = buildCloudinarySignature(paramsToSign, apiSecret);
    const formData = new FormData();

    formData.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append("use_filename", "false");
    formData.append("signature", signature);

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text();
      logger.error("Campaign image upload failed", errorBody, {
        campaignTitle,
        statusCode: uploadResponse.status,
      });
      throw new Error("Failed to upload campaign image");
    }

    const uploadResult = (await uploadResponse.json()) as {
      public_id?: string;
      secure_url?: string;
    };

    if (!uploadResult.public_id || !uploadResult.secure_url) {
      throw new Error("Image upload response was incomplete");
    }

    logger.info("Campaign image uploaded", {
      campaignTitle,
      publicId: uploadResult.public_id,
    });

    return {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }
}
