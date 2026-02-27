import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const USER = String(process.env.GMAIL_USER || "").trim();
const PASS = String(process.env.GMAIL_APP_PASSWORD || "").replaceAll(" ", "").trim();
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
const EMAIL_FROM = String(process.env.EMAIL_FROM || "").trim();
const APP_BASE_URL = String(process.env.APP_BASE_URL || "http://localhost:3000").trim();
const BACKEND_URL = String(process.env.BACKEND_URL || "http://localhost:4000").trim();

const useResend = RESEND_API_KEY && EMAIL_FROM;
let transporter = null;

if (useResend) {
  console.log("Email provider enabled: Resend");
} else if (USER && PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: USER, pass: PASS }
  });
  console.log("Email provider enabled: Gmail", USER);
} else {
  console.warn(
    "Email disabled - missing config (set RESEND_API_KEY + EMAIL_FROM, or GMAIL_USER + GMAIL_APP_PASSWORD)"
  );
}

export async function sendMail({ to, subject, html }) {
  const recipient = String(to || "").trim();
  const cleanSubject = String(subject || "").trim();
  const cleanHtml = String(html || "").trim();

  if (!recipient || !cleanSubject || !cleanHtml) {
    throw new Error("Invalid email payload");
  }

  if (useResend) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [recipient],
        subject: cleanSubject,
        html: cleanHtml
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || data?.error || "Resend API request failed");
    }

    return data;
  }

  if (!transporter) {
    throw new Error("Email disabled (missing config)");
  }

  return transporter.sendMail({
    from: `"Party Shop" <${USER}>`,
    to: recipient,
    subject: cleanSubject,
    html: cleanHtml
  });
}

export async function sendConfirmationEmail({ to, token }) {
  const confirmUrl = `${BACKEND_URL}/api/auth/confirm-email?token=${encodeURIComponent(
    String(token || "")
  )}`;

  return sendMail({
    to,
    subject: "Confirma adresa de email",
    html: `
      <h2>Bine ai venit!</h2>
      <p>Confirma adresa de email:</p>
      <p><a href="${confirmUrl}">Confirma emailul</a></p>
    `
  });
}

export async function sendOrderConfirmationEmail({ to, order }) {
  const ordersUrl = `${APP_BASE_URL}/orders`;
  const total = (Number(order.totalCents || 0) / 100).toFixed(2);
  const orderId = escapeHtml(order.id || "");
  const orderStatus = escapeHtml(order.status || "pending");

  const itemsHtml = Array.isArray(order.items)
    ? order.items
        .map(
          (it) => `
            <tr>
              <td style="padding:6px 0;">${it.quantity} x ${escapeHtml(it.name)}</td>
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
    subject: `Confirmare comanda #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2>Comanda ta a fost inregistrata</h2>
        <p>Numar comanda: <strong>#${orderId}</strong></p>
        <p>Status: <strong>${orderStatus}</strong></p>

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
