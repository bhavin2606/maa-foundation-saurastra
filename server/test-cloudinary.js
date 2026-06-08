import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const url = cloudinary.url(`maa_foundation_gujarat/receipts/receipt_test.pdf`, {
  resource_type: "raw",
  type: "authenticated",
  sign_url: true,
  secure: true
});
console.log(url);
