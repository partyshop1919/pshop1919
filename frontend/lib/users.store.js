import crypto from "crypto";
import bcrypt from "bcryptjs";

const users = [];

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function createUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = users.find(
    (u) => u.email === normalizedEmail
  );

  if (existingUser) {
    throw new Error("Email already exists");
  }

  if (!password || String(password).length < 4) {
    throw new Error("Password too short");
  }

  const verificationToken = crypto
    .randomBytes(32)
    .toString("hex");

  // bcrypt hash (sync, ok pentru MVP)
  const passwordHash = bcrypt.hashSync(
    String(password),
    10
  );

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash,
    isVerified: false,
    verificationToken,
    createdAt: new Date()
  };

  users.push(user);
  return user;
}

export function verifyUser(token) {
  const user = users.find(
    (u) => u.verificationToken === token
  );

  if (!user) return false;

  user.isVerified = true;
  user.verificationToken = null;

  return true;
}

export function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return users.find((u) => u.email === normalizedEmail);
}

/**
 * Compara parola (compatibil și cu useri vechi care aveau `password`)
 * - dacă user are `passwordHash` -> bcrypt compare
 * - dacă user are `password` (legacy) -> compare simplu
 */
export function verifyPassword(user, password) {
  const plain = String(password ?? "");

  if (user?.passwordHash) {
    return bcrypt.compareSync(plain, user.passwordHash);
  }

  // fallback legacy (dev)
  if (user?.password) {
    return String(user.password) === plain;
  }

  return false;
}

