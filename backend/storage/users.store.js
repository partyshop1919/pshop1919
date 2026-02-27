// backend/storage/users.store.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      emailVerified: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function resetUsers() {
  // atenție: îți șterge userii + comenzile (dacă ai relații)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  return true;
}

export async function findUserById(id) {
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email) {
  const e = normalizeEmail(email);
  if (!e) return null;
  return prisma.user.findUnique({ where: { email: e } });
}

export async function findUserByEmailTokenHash(emailTokenHash) {
  if (!emailTokenHash) return null;
  return prisma.user.findFirst({
    where: { emailTokenHash }
  });
}

export async function createUser({ id, email, passwordHash, emailVerified, emailTokenHash }) {
  const e = normalizeEmail(email);
  if (!e) throw new Error("Email invalid");

  return prisma.user.create({
    data: {
      id,
      email: e,
      passwordHash,
      emailVerified: Boolean(emailVerified),
      emailTokenHash
    }
  });
}

export async function updateUser(id, patch) {
  if (!id) return null;

  const data = {};
  if (patch?.email !== undefined) data.email = normalizeEmail(patch.email);
  if (patch?.passwordHash !== undefined) data.passwordHash = patch.passwordHash;
  if (patch?.emailVerified !== undefined) data.emailVerified = Boolean(patch.emailVerified);
  if (patch?.emailTokenHash !== undefined) data.emailTokenHash = patch.emailTokenHash;

  return prisma.user.update({
    where: { id },
    data
  });
}
