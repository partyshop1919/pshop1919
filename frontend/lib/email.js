export function sendVerificationEmail(email, token) {
  const url = `http://localhost:3000/api/auth/verify?token=${token}`;

  console.log("=== VERIFY EMAIL ===");
  console.log("To:", email);
  console.log("Link:", url);
  console.log("====================");
}
