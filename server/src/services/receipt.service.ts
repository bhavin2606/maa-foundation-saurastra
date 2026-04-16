import PDFDocument from "pdfkit";
import { cloudinary } from "../lib/cloudinary.js";
import { logger } from "../lib/logger.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ReceiptService {
  static async generateReceipt(donation: any): Promise<{ url: string, buffer: Buffer }> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          margin: 50,
          size: 'A4'
        });
        const buffers: Buffer[] = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", async () => {
          const pdfBuffer = Buffer.concat(buffers);
          try {
            const uploadResult = await new Promise((res, rej) => {
              cloudinary.uploader.upload_stream(
                {
                  folder: `${process.env.CLOUDINARY_FOLDER}/receipts`,
                  public_id: `receipt_${donation.id}.pdf`,
                  overwrite: true,
                  resource_type: "raw", 
                },
                (error, result) => {
                  if (error) rej(error);
                  else res(result);
                }
              ).end(pdfBuffer);
            });
            resolve({ url: (uploadResult as any).secure_url, buffer: pdfBuffer });
          } catch (uploadError) {
            logger.error("Failed to upload receipt to Cloudinary", uploadError);
            reject(uploadError);
          }
        });

        // Design
        const logoPath = path.join(__dirname, "../assets/logo.png");
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, 45, { width: 60 });
        }

        doc
          .fillColor("#444444")
          .fontSize(20)
          .font("Helvetica-Bold")
          .text("Maa Foundation", 120, 55)
          .fontSize(10)
          .font("Helvetica")
          .text("Reg No: E/5239/Rajkot | Contact: +91 9925685995", 120, 80)
          .text("Email: maafondations75@gmail.com | Rajkot, Gujarat", 120, 95)
          .moveDown();

        doc
          .strokeColor("#E22D6E")
          .lineWidth(2)
          .moveTo(50, 115)
          .lineTo(550, 115)
          .stroke();

        doc
          .fillColor("#E22D6E")
          .fontSize(24)
          .font("Helvetica-Bold")
          .text("DONATION RECEIPT", 50, 140, { align: "center" });

        doc.moveDown(2);

        // Receipt Details
        const detailsTop = 200;
        doc
          .fillColor("#000000")
          .fontSize(10)
          .font("Helvetica")
          .text("Receipt Number:", 50, detailsTop)
          .font("Helvetica-Bold")
          .text(`MFG-${donation.id.slice(-6).toUpperCase()}`, 150, detailsTop)
          .font("Helvetica")
          .text("Date:", 50, detailsTop + 20)
          .text(new Date().toLocaleDateString("en-IN"), 150, detailsTop + 20);

        // Donor Info
        const donorTop = 260;
        doc
          .fillColor("#E22D6E")
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Donor Information", 50, donorTop)
          .strokeColor("#E22D6E")
          .lineWidth(1)
          .moveTo(50, donorTop + 15)
          .lineTo(200, donorTop + 15)
          .stroke();

        doc
          .fillColor("#444444")
          .fontSize(10)
          .font("Helvetica")
          .text("Name:", 50, donorTop + 30)
          .font("Helvetica-Bold")
          .text(donation.donorName, 120, donorTop + 30)
          .font("Helvetica")
          .text("Email:", 50, donorTop + 45)
          .text(donation.donorEmail, 120, donorTop + 45)
          .text("Phone:", 50, donorTop + 60)
          .text(donation.phone || "N/A", 120, donorTop + 60);

        // Line Item Table Header
        const tableTop = 380;
        doc.rect(50, tableTop, 500, 25).fill("#f9f9f9");
        doc.fillColor("#E22D6E").font("Helvetica-Bold").fontSize(10);
        doc.text("Description", 60, tableTop + 8);
        doc.text("Qty", 300, tableTop + 8, { width: 50, align: "center" });
        doc.text("Rate", 360, tableTop + 8, { width: 80, align: "right" });
        doc.text("Total (INR)", 450, tableTop + 8, { width: 90, align: "right" });

        // Line Item Content
        const rowTop = tableTop + 35;
        doc.fillColor("#444444").font("Helvetica");
        const itemLabel = donation.itemLabel || "General Donation";
        const qty = donation.quantity || 1;
        const rate = donation.amount / qty;
        
        doc.text(itemLabel, 60, rowTop);
        doc.text(qty.toString(), 300, rowTop, { width: 50, align: "center" });
        doc.text(`INR ${rate.toLocaleString("en-IN")}`, 360, rowTop, { width: 80, align: "right" });
        doc.text(`INR ${donation.amount.toLocaleString("en-IN")}`, 450, rowTop, { width: 90, align: "right" });

        // Table Bottom Line
        doc.strokeColor("#eeeeee").lineWidth(1).moveTo(50, rowTop + 20).lineTo(550, rowTop + 20).stroke();

        // Summary
        const summaryTop = rowTop + 40;
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#000000");
        doc.text("GRAND TOTAL:", 300, summaryTop, { width: 140, align: "right" });
        doc.text(`INR ${donation.amount.toLocaleString("en-IN")}`, 450, summaryTop, { width: 90, align: "right" });

        // Note
        doc
          .fontSize(9)
          .font("Helvetica-Oblique")
          .fillColor("#888888")
          .text(
            "Note: This is an electronically generated receipt for your donation. All donations to Maa Foundation are exempt from Income Tax under section 80G of the IT Act.",
            50,
            650,
            { align: "center", width: 500 }
          );

        // Footer
        doc
          .fontSize(8)
          .font("Helvetica")
          .fillColor("#444444")
          .text("MAA FOUNDATION GUJARAT | Together for a better tomorrow.", 50, 750, { align: "center" });

        doc.end();
      } catch (err) {
        logger.error("Error generating PDF receipt", err);
        reject(err);
      }
    });
  }
}
