// Temporary exemption for the owner's live checkout verification.
// Remove the email after verification, or set SHIPPING_TEST_EMAIL to an empty value.
export function calculateShippingCents(subtotalCents, user = null) {
  const testEmail = String(process.env.SHIPPING_TEST_EMAIL ?? "cmanzatc@gmail.com").trim().toLowerCase();
  const email = String(user?.email || "").trim().toLowerCase();
  if (testEmail && email === testEmail) return 0;
  return subtotalCents >= 19900 ? 0 : 1999;
}
