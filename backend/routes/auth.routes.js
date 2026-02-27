import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { hashPassword, verifyPassword, generateToken, hashToken } from "../src/utils/crypto.js";
import { createUser, findUserByEmail, findUserByEmailTokenHash, updateUser } from "../storage/users.store.js";
import { sendConfirmationEmail } from "../src/utils/mailer.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email și parolă obligatorii" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email deja folosit" });
    }

    const passwordHash = await hashPassword(password);
    const emailToken = generateToken();
    const emailTokenHash = hashToken(emailToken);

    await createUser({
      id: crypto.randomUUID(),
      email,
      passwordHash,
      emailVerified: false,
      emailTokenHash
    });

    try {
      await sendConfirmationEmail({ to: email, token: emailToken });
    } catch (e) {
      console.error("CONFIRM EMAIL SEND FAILED:", e.message);
    }

    return res.status(201).json({
      message: "Cont creat. Verifică emailul pentru confirmare."
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Eroare internă la crearea contului" });
  }
});

router.get("/confirm-email", async (req, res) => {
  const { token } = req.query || {};
  if (!token) return res.status(400).send("Token lipsă");

  const tokenHash = hashToken(token);
  const user = await findUserByEmailTokenHash(tokenHash);

  if (!user) return res.status(400).send("Token invalid sau expirat");

  await updateUser(user.id, { emailVerified: true, emailTokenHash: null });

  return res.redirect(`${process.env.APP_BASE_URL}/login?confirmed=1`);
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Date incomplete" });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Email sau parolă incorecte" });

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Email neconfirmat" });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Email sau parolă incorecte" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

    return res.json({
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Eroare internă la autentificare" });
  }
});

export default router;
