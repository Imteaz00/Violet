import "server-only";

if (!process.env.BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined");
}

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not defined");
}

if (!process.env.CLOUDINARY_UPLOAD_PRESET) {
  throw new Error("CLOUDINARY_UPLOAD_PRESET is not defined");
}

export const BACKEND_URL = process.env.BACKEND_URL;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET as string;
