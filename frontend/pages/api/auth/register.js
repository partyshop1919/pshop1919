import { createUser } from "../../../lib/users.store";
import { sendVerificationEmail } from "../../../lib/email";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const user = createUser({ email, password });

    sendVerificationEmail(
      user.email,
      user.verificationToken
    );

    return res.status(201).json({
      message:
        "Account created. Please check your email to confirm your account."
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}
