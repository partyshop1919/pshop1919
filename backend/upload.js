import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/**
 * __dirname pentru fișierul curent (src/)
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Urcăm din src/ în backend/
 * apoi în uploads/products
 */
const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "products"
);

/**
 * Ne asigurăm că folderul există
 */
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name =
      "product-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e6);

    cb(null, name + ext);
  }
});

export const uploadProductImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(
        new Error("Only image files allowed"),
        false
      );
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
