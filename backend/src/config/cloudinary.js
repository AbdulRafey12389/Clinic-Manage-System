// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_CLOUD_NAME);

/**
 * Uploads a file buffer directly to Cloudinary
 * @param {Buffer} buffer - The file buffer from multer.memoryStorage
 * @param {string} folder - Cloudinary folder name
 * @param {string} mimetype - File MIME type (image/png, application/pdf, etc.)
 * @returns {Promise<string>} - The Cloudinary secure URL
 */
export const uploadBufferToCloudinary = async (buffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
};
