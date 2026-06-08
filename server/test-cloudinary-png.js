import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import fs from "fs";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const doc = new PDFDocument();
const buffers = [];
doc.on("data", (chunk) => buffers.push(chunk));
doc.on("end", async () => {
  const pdfBuffer = Buffer.concat(buffers);
  
  cloudinary.uploader.upload_stream(
    {
      folder: `${process.env.CLOUDINARY_FOLDER}/receipts`,
      public_id: `receipt_test_png`,
      overwrite: true,
      resource_type: "image", 
      format: "png"
    },
    (error, result) => {
      if (error) console.error(error);
      else console.log(result.secure_url);
    }
  ).end(pdfBuffer);
});

doc.text("Hello World");
doc.end();
