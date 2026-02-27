import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const RAW_USER = process.env.GMAIL_USER;
const RAW_PASS = process.env.GMAIL_APP_PASSWORD;
const RAW_BASE = process.env.APP_BASE_URL;

const USER = String(RAW_USER || "").trim();
const PASS = String(RAW_PASS || "").replaceAll(" ", "").trim();
const APP_BASE_URL = String(RAW_BASE || "http://localhost:3000").trim();

let transporter = null;

if (USER && PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: USER, pass: PASS }
  });
  console.log("✅ Email enabled:", USER);
} else {
  console.warn("⚠️ Email disabled - missing config (GMAIL_USER / GMAIL_APP_PASSWORD)");
}

export async function sendMail({ to, subject, html }) {
  if (!transporter) {
    throw new Error("Email disabled (missing config)");
  }

  return transporter.sendMail({
    from: `"Party Shop" <${USER}>`,
    to,
    subject,
    html
  });
}

export async function sendConfirmationEmail({ to, token }) {
 const BACKEND_URL = String(process.env.BACKEND_URL || "http://localhost:4000").trim();
const confirmUrl = `${BACKEND_URL}/api/auth/confirm-email?token=${token}`;




  return sendMail({
    to,
    subject: "Confirmă adresa de email",
    html: `
      <h2>Bine ai venit!</h2>
      <p>Confirmă adresa de email:</p>
      <p><a href="${confirmUrl}">Confirmă emailul</a></p>
    `
  });
}

export async function sendOrderConfirmationEmail({ to, order }) {
  const ordersUrl = `${APP_BASE_URL}/orders`;
  const total = (Number(order.totalCents || 0) / 100).toFixed(2);

  const itemsHtml = Array.isArray(order.items)
    ? order.items
        .map(
          (it) => `
            <tr>
              <td style="padding:6px 0;">${it.quantity} × ${escapeHtml(it.name)}</td>
              <td style="padding:6px 0; text-align:right;">
                ${((it.priceCents * it.quantity) / 100).toFixed(2)} RON
              </td>
            </tr>
          `
        )
        .join("")
    : "";

  return sendMail({
    to,
    subject: `Confirmare comandă #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2>🎉 Comanda ta a fost înregistrată</h2>
        <p>Număr comandă: <strong>#${order.id}</strong></p>
        <p>Status: <strong>${escapeHtml(order.status || "pending")}</strong></p>

        <h3>Produse</h3>
        <table style="width:100%; border-collapse:collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding-top:10px; border-top:1px solid #eee;"><strong>Total</strong></td>
            <td style="padding-top:10px; border-top:1px solid #eee; text-align:right;">
              <strong>${total} RON</strong>
            </td>
          </tr>
        </table>

        <p style="margin-top:16px;">
          Vezi comenzile tale: <a href="${ordersUrl}">${ordersUrl}</a>
        </p>
      </div>
    `
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
