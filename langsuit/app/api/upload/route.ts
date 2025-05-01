/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the server and stores it in the public/uploads directory
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: File upload failed
 */

import fs from "fs";
import multer from "multer";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Create "uploads" folder if it doesn't exist
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const POST = async (req: NextRequest) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req as any, {} as any, (err) => {
      if (err) {
        console.error("File upload error:", err);
        return resolve(
          NextResponse.json({ error: "File upload failed" }, { status: 500 }),
        );
      }

      const file = (req as any).file;

      if (!file) {
        return resolve(
          NextResponse.json({ error: "No file uploaded" }, { status: 400 }),
        );
      }

      console.log("File uploaded:", file);

      resolve(
        NextResponse.json({
          message: "File uploaded successfully",
          filePath: `/uploads/${file.filename}`,
        }),
      );
    });
  });
};
