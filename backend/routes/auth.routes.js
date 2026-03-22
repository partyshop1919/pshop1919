import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { URLSearchParams } from "url";

import { hashPassword, verifyPassword, generateToken, hashToken } from "../src/utils/crypto.js";
import { createUser, findUserByEmail, findUserByEmailTokenHash, updateUser } from "../storage/users.store.js";
import { sendConfirmationEmail } from "../src/utils/mailer.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const FRONTEND_URL =
  process.env.APP_BASE_URL || process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

const OAUTH_PROVIDERS = new Set(["google", "github", "facebook"]);

function buildRedirectUri(provider) {
  return `${BACKEND_URL.replace(/\/+$/, "")}/api/auth/oauth/${provider}/callback`;
}

function signOAuthState(provider) {
  return jwt.sign({ provider }, JWT_SECRET, { expiresIn: "10m" });
}

function verifyOAuthState(state, provider) {
  const payload = jwt.verify(String(state || ""), JWT_SECRET);
  return payload?.provider === provider;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error_description || data?.error || data?.message || "OAuth request failed";
    throw new Error(msg);
  }
  return data;
}

async function getGoogleProfile(code) {
  const clientId = String(process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = String(process.env.GOOGLE_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) throw new Error("Google OAuth is not configured");

  const redirectUri = buildRedirectUri("google");

  const tokenData = await fetchJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: String(code),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  const profile = await fetchJson("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  return {
    email: String(profile?.email || "").trim().toLowerCase(),
    emailVerified: Boolean(profile?.email_verified)
  };
}

async function getGithubProfile(code) {
  const clientId = String(process.env.GITHUB_CLIENT_ID || "").trim();
  const clientSecret = String(process.env.GITHUB_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) throw new Error("GitHub OAuth is not configured");

  const redirectUri = buildRedirectUri("github");

  const tokenData = await fetchJson("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: String(code),
      redirect_uri: redirectUri
    })
  });

  const emails = await fetchJson("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "party-shop-auth"
    }
  });

  const best =
    (Array.isArray(emails) &&
      emails.find((e) => e?.primary && e?.verified && e?.email)) ||
    (Array.isArray(emails) && emails.find((e) => e?.verified && e?.email)) ||
    (Array.isArray(emails) && emails.find((e) => e?.email));

  return {
    email: String(best?.email || "").trim().toLowerCase(),
    emailVerified: Boolean(best?.verified)
  };
}

async function getFacebookProfile(code) {
  const clientId = String(process.env.FACEBOOK_CLIENT_ID || "").trim();
  const clientSecret = String(process.env.FACEBOOK_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) throw new Error("Facebook OAuth is not configured");

  const redirectUri = buildRedirectUri("facebook");

  const tokenData = await fetchJson(
    `https://graph.facebook.com/v19.0/oauth/access_token?${new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: String(code)
    }).toString()}`
  );

  const profile = await fetchJson(
    `https://graph.facebook.com/me?${new URLSearchParams({
      fields: "id,email,name",
      access_token: String(tokenData.access_token || "")
    }).toString()}`
  );

  return {
    email: String(profile?.email || "").trim().toLowerCase(),
    emailVerified: Boolean(profile?.email)
  };
}

async function getOAuthProfile(provider, code) {
  if (provider === "google") return getGoogleProfile(code);
  if (provider === "github") return getGithubProfile(code);
  if (provider === "facebook") return getFacebookProfile(code);
  throw new Error("Unsupported provider");
}

function buildFrontendOAuthRedirect(params) {
  return `${FRONTEND_URL.replace(/\/+$/, "")}/oauth-success?${new URLSearchParams(params).toString()}`;
}

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email și parolă obligatorii" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      if (!existing.emailVerified) {
        const passwordHash = await hashPassword(password);
        const emailToken = generateToken();
        const emailTokenHash = hashToken(emailToken);

        await updateUser(existing.id, {
          passwordHash,
          emailVerified: false,
          emailTokenHash
        });

        try {
          await sendConfirmationEmail({ to: email, token: emailToken });
        } catch (e) {
          console.error("CONFIRM EMAIL RESEND FAILED:", e.message);
        }

        return res.status(200).json({
          message: "Cont existent, dar neconfirmat. Am retrimis emailul de confirmare."
        });
      }

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

router.get("/oauth/:provider/start", async (req, res) => {
  const provider = String(req.params.provider || "").trim().toLowerCase();
  if (!OAUTH_PROVIDERS.has(provider)) {
    return res.status(404).json({ message: "Provider invalid" });
  }

  try {
    const state = signOAuthState(provider);
    const redirectUri = buildRedirectUri(provider);

    if (provider === "google") {
      const clientId = String(process.env.GOOGLE_CLIENT_ID || "").trim();
      if (!clientId) return res.status(500).json({ message: "Google OAuth missing config" });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        access_type: "offline",
        prompt: "select_account"
      }).toString()}`;

      return res.redirect(authUrl);
    }

    if (provider === "github") {
      const clientId = String(process.env.GITHUB_CLIENT_ID || "").trim();
      if (!clientId) return res.status(500).json({ message: "GitHub OAuth missing config" });

      const authUrl = `https://github.com/login/oauth/authorize?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "read:user user:email",
        state
      }).toString()}`;

      return res.redirect(authUrl);
    }

    const clientId = String(process.env.FACEBOOK_CLIENT_ID || "").trim();
    if (!clientId) return res.status(500).json({ message: "Facebook OAuth missing config" });

    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "email,public_profile",
      response_type: "code",
      state
    }).toString()}`;

    return res.redirect(authUrl);
  } catch (err) {
    console.error("OAUTH START ERROR:", err);
    return res.status(500).json({ message: "Failed to start OAuth flow" });
  }
});

router.get("/oauth/:provider/callback", async (req, res) => {
  const provider = String(req.params.provider || "").trim().toLowerCase();
  const code = String(req.query?.code || "");
  const state = String(req.query?.state || "");

  if (!OAUTH_PROVIDERS.has(provider)) {
    return res.redirect(buildFrontendOAuthRedirect({ error: "Provider invalid" }));
  }

  if (!code || !state) {
    return res.redirect(buildFrontendOAuthRedirect({ error: "Lipseste code/state" }));
  }

  try {
    if (!verifyOAuthState(state, provider)) {
      return res.redirect(buildFrontendOAuthRedirect({ error: "State invalid sau expirat" }));
    }

    const profile = await getOAuthProfile(provider, code);
    const email = String(profile?.email || "").trim().toLowerCase();

    if (!email) {
      return res.redirect(
        buildFrontendOAuthRedirect({
          error: "Providerul nu a returnat email. Verifica permisiunile contului."
        })
      );
    }

    let user = await findUserByEmail(email);

    if (!user) {
      const randomPass = crypto.randomBytes(24).toString("hex");
      const passwordHash = await hashPassword(randomPass);

      user = await createUser({
        id: crypto.randomUUID(),
        email,
        passwordHash,
        emailVerified: true,
        emailTokenHash: null
      });
    } else if (!user.emailVerified && profile.emailVerified) {
      user = await updateUser(user.id, {
        emailVerified: true,
        emailTokenHash: null
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
    return res.redirect(
      buildFrontendOAuthRedirect({
        token,
        email: user.email
      })
    );
  } catch (err) {
    console.error("OAUTH CALLBACK ERROR:", err);
    return res.redirect(
      buildFrontendOAuthRedirect({
        error: err?.message || "OAuth failed"
      })
    );
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
