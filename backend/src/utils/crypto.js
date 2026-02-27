// backend/src/utils/crypto.js
import crypto from "crypto";

/* =====================================================
   PASSWORD HASHING (PBKDF2)
===================================================== */
const ITERATIONS = 100_000;
const KEYLEN = 64;
const DIGEST = "sha512";

/**
 * Hash parolă
 * @param {string} password
 * @returns {Promise<string>} salt:hash
 */
export async function hashPassword(password) {
  const pwd = String(password || "");
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(pwd, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
}

/**
 * Verifică parola
 * @param {string} password
 * @param {string} storedHash salt:hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, storedHash) {
  const pwd = String(password || "");
  const value = String(storedHash || "");

  const parts = value.split(":");
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;
  if (!salt || !originalHash) return false;

  const hash = crypto
    .pbkdf2Sync(pwd, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString("hex");

  // timingSafeEqual cere buffers de aceeași lungime
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(originalHash, "hex");
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

/* =====================================================
   EMAIL CONFIRMATION TOKEN
===================================================== */

/**
 * Token random sigur (email confirm)
 * Numele este `generateToken` ca să fie compatibil cu auth.routes.js
 */
export function generateToken() {

  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash token (stocare)
 */
export function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(String(token || ""))
    .digest("hex");
}
