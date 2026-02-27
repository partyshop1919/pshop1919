import { verifyUser } from "../../../lib/users.store";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      message: "Missing verification token"
    });
  }

  const success = verifyUser(token);

  if (!success) {
    return res.status(400).json({
      message: "Invalid or expired verification token"
    });
  }

  // redirect UX-friendly
  return res.redirect("/verify-success");
}
