import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_UPLOAD_DIR = path.join(__dirname, "uploads", "products");
fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();

export const uploadProductImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file?.mimetype?.startsWith("image/")) {
      cb(new Error("Only image files allowed"), false);
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

function sanitizeExt(fileName = "") {
  const ext = path.extname(String(fileName || "")).toLowerCase();
  return ext && ext.length <= 8 ? ext : ".jpg";
}

function buildFileName(originalName = "") {
  const ext = sanitizeExt(originalName);
  return `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
}

function r2Config() {
  const accessKeyId = String(process.env.R2_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = String(process.env.R2_SECRET_ACCESS_KEY || "").trim();
  const endpoint = String(process.env.R2_ENDPOINT || "").trim();
  const bucket = String(process.env.R2_BUCKET_NAME || "").trim();
  const publicBaseUrl = String(process.env.R2_PUBLIC_BASE_URL || "").trim();

  const enabled =
    Boolean(accessKeyId) &&
    Boolean(secretAccessKey) &&
    Boolean(endpoint) &&
    Boolean(bucket) &&
    Boolean(publicBaseUrl);

  return { enabled, accessKeyId, secretAccessKey, endpoint, bucket, publicBaseUrl };
}

async function uploadToR2(file) {
  const cfg = r2Config();
  if (!cfg.enabled) return null;

  const fileName = buildFileName(file?.originalname);
  const key = `products/${fileName}`;

  const client = new S3Client({
    region: "auto",
    endpoint: cfg.endpoint,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey
    }
  });

  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "public, max-age=31536000, immutable"
    })
  );

  return `${cfg.publicBaseUrl.replace(/\/$/, "")}/${key}`;
}

async function uploadToLocal(file) {
  const fileName = buildFileName(file?.originalname);
  const absPath = path.join(LOCAL_UPLOAD_DIR, fileName);
  await fs.promises.writeFile(absPath, file.buffer);
  return `/uploads/products/${fileName}`;
}

export async function storeProductImage(file) {
  if (!file?.buffer) throw new Error("Missing file data");
  const remote = await uploadToR2(file).catch(() => null);
  if (remote) return remote;
  return uploadToLocal(file);
}
