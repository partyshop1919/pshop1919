import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import routes from "./src/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/* =====================
   CORS
===================== */
const allowedOrigins = Array.from(
  new Set(
    [
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://172.31.112.1:3000"
    ]
      .map((x) => String(x || "").trim())
      .filter(Boolean)
  )
);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman / curl
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =====================
   STRIPE WEBHOOK (RAW) - MUST be before express.json
   (activează doar dacă ai ruta implementată)
===================== */
app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => next()
);

/* =====================
   JSON (for all other routes)
===================== */
app.use(express.json());

/* =====================
   SECURITY
===================== */
app.use(helmet());

/* =====================
   LOGIN LIMITER
===================== */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts" }
});
app.use("/api/admin/login", loginLimiter);

/* =====================
   STATIC FILES (UPLOADS)
===================== */
app.use(
  "/uploads",
  express.static(path.resolve("uploads"), {
    setHeaders: (res) => {
      if (allowedOrigins[0]) {
        res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
      }
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
  })
);

/* =====================
   HEALTH CHECK
===================== */
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* =====================
   ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api", routes);

/* =====================
   START
===================== */
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
