import crypto from "crypto";
import {
  findUserByEmail,
  verifyPassword
} from "../../../lib/users.store";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = findUserByEmail(email);

  // same response for user not found or wrong password
  if (!user || !verifyPassword(user, password)) {
    return res
      .status(401)
      .json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message:
        "Please verify your email address before logging in"
    });
  }

  const token = crypto
    .randomBytes(24)
    .toString("hex");

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
}
