// backend/src/routes.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { uploadProductImage } from "../upload.js";
import { z } from "zod";

// dacă nu ai fișierul, comentează linia următoare
import { sendOrderConfirmationEmail } from "./utils/mailer.js";
import Stripe from "stripe";
import express from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20"
});
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

/* =====================
   ZOD
===================== */
const productCreateSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(160).optional(),
  priceCents: z.coerce.number().int().min(0),
  stock: z.coerce.number().int().min(0).default(0),
  image: z.string().optional().default(""),
  category: z.string().min(1).default("uncategorized"),
  featured: z.coerce.boolean().optional().default(false)
});

const productUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  slug: z.string().min(2).max(160).optional(),
  priceCents: z.coerce.number().int().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  image: z.string().optional(),
  category: z.string().min(1).optional(),
  featured: z.coerce.boolean().optional()
});


/* ============================================================
   SHIPPING CONSTANTS
============================================================ */

const FREE_SHIPPING_THRESHOLD_CENTS = 19900; // 199 RON
const SHIPPING_FLAT_CENTS = 1999; // 19.99 RON
/* =====================
   HELPERS
===================== */
function jsonError(res, status, message, extra = {}) {
  return res.status(status).json({ error: message, ...extra });
}

function getToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

function userAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return jsonError(res, 401, "Missing token");

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.userId) return jsonError(res, 401, "Invalid token");

    req.user = payload;
    return next();
  } catch {
    return jsonError(res, 401, "Invalid token");
  }
}

function adminAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return jsonError(res, 401, "Missing token");

    const payload = jwt.verify(token, JWT_SECRET);
    if (payload?.role !== "admin") return jsonError(res, 403, "Forbidden");

    req.admin = payload;
    return next();
  } catch {
    return jsonError(res, 401, "Invalid token");
  }
}

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(base, excludeId = null) {
  const cleanBase = slugify(base) || "product";
  let slug = cleanBase;
  let i = 2;

  while (true) {
    const exists = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      },
      select: { id: true }
    });

    if (!exists) return slug;
    slug = `${cleanBase}-${i++}`;
  }
}


/* ============================================================
   ADMIN LOGIN
   POST /api/admin/login
============================================================ */
router.post("/admin/login", (req, res) => {
  const inputPass = String(req.body?.password || "").trim();
  const envPass = String(process.env.ADMIN_PASSWORD || "").trim();

  if (!envPass) return jsonError(res, 500, "ADMIN_PASSWORD missing in .env");
  if (inputPass !== envPass) return jsonError(res, 401, "Invalid password");

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
  return res.json({ token });
});
/* =====================
   PRODUCTS (PUBLIC)
   GET /api/products
   Optional:
     ?featured=1
     ?category=Baloane
     ?search=balon
===================== */
router.get("/products", async (req, res) => {
  const { featured, category, search } = req.query;

  const where = {
    deletedAt: null
  };

  if (featured === "1" || featured === "true") where.featured = true;
  if (typeof category === "string" && category.trim()) where.category = category.trim();
  if (typeof search === "string" && search.trim()) {
    where.name = { contains: search.trim(), mode: "insensitive" };
  }

  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
      stock: true,
      image: true,
      category: true,
      featured: true
    }
  });

  res.json({ items });
});

/* =====================
   PRODUCT BY SLUG (PUBLIC)
   GET /api/products/slug/:slug
===================== */
router.get("/products/slug/:slug", async (req, res) => {
  const slug = String(req.params.slug || "").trim();
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  const product = await prisma.product.findFirst({
    where: { slug, deletedAt: null },
    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
      stock: true,
      image: true,
      category: true,
      featured: true
    }
  });

  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ item: product });
});

/* =====================
   PRODUCTS (ADMIN CREATE)
===================== */
router.post("/products", adminAuth, async (req, res) => {
  // NOTE: presupunem că ai deja slug required + unique în DB
  const { name, priceCents, stock, image, category, featured, slug } = req.body || {};

  if (!name || priceCents === undefined) {
    return res.status(400).json({ error: "Missing product data" });
  }

  const data = {
    name: String(name),
    priceCents: Number(priceCents),
    stock: Number(stock) || 0,
    image: image ? String(image) : "",
    category: category ? String(category) : "uncategorized",
    featured: Boolean(featured),
    // dacă nu trimiți slug din admin, îl poți genera în frontend sau îl pui aici ulterior
    slug: slug ? String(slug) : undefined
  };

  try {
    const product = await prisma.product.create({ data });
    res.json({ ok: true, product });
  } catch (e) {
    console.error("CREATE PRODUCT ERROR:", e);
    return res.status(400).json({ error: "Failed to create product (slug might be duplicate)" });
  }
});

/* =====================
   PRODUCTS (ADMIN UPDATE)
===================== */
router.put("/products/:id", adminAuth, async (req, res) => {
  const id = String(req.params.id);
  const { name, priceCents, stock, image, category, featured, slug } = req.body || {};

  const existing = await prisma.product.findUnique({
  where: { id }
});
  if (!existing) return res.status(404).json({ error: "Product not found" });

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: String(name) } : {}),
        ...(priceCents !== undefined ? { priceCents: Number(priceCents) } : {}),
        ...(stock !== undefined ? { stock: Number(stock) } : {}),
        ...(image !== undefined ? { image: image ? String(image) : "" } : {}),
        ...(category !== undefined ? { category: category ? String(category) : "uncategorized" } : {}),
        ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
        ...(slug !== undefined ? { slug: String(slug) } : {})
      }
    });

    res.json({ ok: true, product });
  } catch (e) {
    console.error("UPDATE PRODUCT ERROR:", e);
    return res.status(400).json({ error: "Failed to update product (slug might be duplicate)" });
  }
});

/* =====================
   PRODUCTS (ADMIN DELETE) - SOFT DELETE
===================== */
router.delete("/products/:id", adminAuth, async (req, res) => {
  const id = String(req.params.id);

  const existing = await prisma.product.findFirst({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Product not found" });

  const removed = await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() }
  });

  res.json({ ok: true, removed });
});


/* ============================================================
   FAVORITES (USER)
   GET    /api/favorites
   POST   /api/favorites/:productId
   DELETE /api/favorites/:productId
============================================================ */
router.get("/favorites", userAuth, async (req, res) => {
  const userId = req.user.userId;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" }
  });

  const items = favorites
    .map((f) => f.product)
    .filter((p) => p && p.deletedAt == null)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      priceCents: p.priceCents,
      stock: p.stock,
      image: p.image,
      category: p.category,
      featured: p.featured
    }));

  return res.json({ items });
});

router.post("/favorites/:productId", userAuth, async (req, res) => {
  const userId = req.user.userId;
  const productId = String(req.params.productId || "");

  // opțional: validare produs existent și ne-șters
  const p = await prisma.product.findFirst({
    where: { id: productId, deletedAt: null },
    select: { id: true }
  });
  if (!p) return jsonError(res, 404, "Product not found");

  try {
    await prisma.favorite.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId }
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("ADD FAVORITE ERROR:", e);
    return jsonError(res, 500, "Failed to add favorite");
  }
});

router.delete("/favorites/:productId", userAuth, async (req, res) => {
  const userId = req.user.userId;
  const productId = String(req.params.productId || "");

  try {
    await prisma.favorite.delete({
      where: { userId_productId: { userId, productId } }
    });
    return res.json({ ok: true });
  } catch {
    return res.json({ ok: true });
  }
});


/* ============================================================
   CART VALIDATION (DB) — single source of truth
   POST /api/cart/validate
   Returns:
     items: [{ id, name, priceCents, stock, image, quantity, lineTotalCents }]
     subtotalCents
     shippingCents
     grandTotalCents
     totalEUR (optional legacy)
     errors: [{ code, productId, message, available, requested }]
============================================================ */

router.post("/cart/validate", async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  // aggregate quantities by product id
  const qtyById = new Map();
  for (const it of items) {
    const id = String(it?.id || "").trim();
    const q = Math.max(1, Number(it?.quantity) || 1);
    if (!id) continue;
    qtyById.set(id, (qtyById.get(id) || 0) + q);
  }

  if (qtyById.size === 0) {
    return res.json({
      items: [],
      subtotalCents: 0,
      shippingCents: 0,
      grandTotalCents: 0,
      totalEUR: "0.00",
      errors: []
    });
  }

  const ids = [...qtyById.keys()];

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, deletedAt: null },
    select: {
      id: true,
      name: true,
      priceCents: true,
      stock: true,
      image: true
    }
  });

  const productById = new Map(products.map((p) => [String(p.id), p]));

  const errors = [];
  const validated = [];

  let subtotalCents = 0;

  // validate each requested id (even if product missing)
  for (const pid of ids) {
    const requested = qtyById.get(pid) || 0;
    const p = productById.get(pid);

    if (!p) {
      errors.push({
        code: "NOT_FOUND",
        productId: pid,
        message: "Produsul nu mai este disponibil."
      });
      continue;
    }

    const available = Number(p.stock) || 0;

    if (requested > available) {
      errors.push({
        code: "OUT_OF_STOCK",
        productId: pid,
        available,
        requested,
        message:
          available <= 0
            ? "Produsul este momentan indisponibil."
            : `Stoc insuficient. Disponibil: ${available}.`
      });
    }

    // allow line item, but clamp quantity to available (so totals make sense)
    const qty = Math.max(0, Math.min(requested, available));
    if (qty === 0) continue;

    const lineTotalCents = (Number(p.priceCents) || 0) * qty;
    subtotalCents += lineTotalCents;

    validated.push({
      id: p.id,
      name: p.name,
      priceCents: p.priceCents,
      stock: p.stock,
      image: p.image,
      quantity: qty,
      lineTotalCents
    });
  }

  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;

  const grandTotalCents = subtotalCents + (validated.length > 0 ? shippingCents : 0);

  return res.json({
    items: validated,
    subtotalCents,
    shippingCents: validated.length > 0 ? shippingCents : 0,
    grandTotalCents,
    totalEUR: (grandTotalCents / 100).toFixed(2), // legacy field (optional)
    errors
  });
});

/* ============================================================
   STRIPE — CREATE CHECKOUT SESSION
   POST /api/payments/stripe/create-session
   Body: { customer, items }
============================================================ */
router.post("/payments/stripe/create-session", userAuth, async (req, res) => {
  try {
    const stripeKey = String(process.env.STRIPE_SECRET_KEY || "").trim();
    if (!stripeKey) {
      return jsonError(res, 500, "STRIPE_SECRET_KEY missing");
    }
    if (!stripeKey.startsWith("sk_")) {
      return jsonError(res, 500, "Invalid STRIPE_SECRET_KEY format");
    }

    const stripeClient = new Stripe(stripeKey);
    const body = req.body || {};
    const customer = body.customer || {};
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (rawItems.length === 0) return jsonError(res, 400, "Empty cart");

    // required customer fields (same as /orders)
    const customerName = String(customer?.name || "").trim();
    const customerAddress = String(customer?.address || "").trim();
    const customerPhone = String(customer?.phone || "").trim();
    const customerCity = String(customer?.city || "").trim();
    const customerCounty = String(customer?.county || "").trim();
    const postalCode = customer?.postalCode != null ? String(customer.postalCode).trim() : null;

    if (!customerName || !customerAddress || !customerPhone || !customerCity || !customerCounty) {
      return jsonError(res, 400, "Missing customer data");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true }
    });
    if (!user) return jsonError(res, 401, "User not found");

    // 1) Reuse exact logic ca validate (server-side totals)
    // Copiem agregarea qtyById + fetch products + subtotal/shipping/grandTotal.
    const qtyById = new Map();
    for (const it of rawItems) {
      const id = String(it?.id || "").trim();
      const q = Math.max(1, Number(it?.quantity) || 1);
      if (!id) continue;
      qtyById.set(id, (qtyById.get(id) || 0) + q);
    }
    if (qtyById.size === 0) return jsonError(res, 400, "Invalid items");

    const ids = [...qtyById.keys()];
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, deletedAt: null },
      select: { id: true, name: true, priceCents: true, stock: true }
    });

    const productById = new Map(products.map((p) => [String(p.id), p]));

    // validate existence + stock
    for (const pid of ids) {
      const p = productById.get(pid);
      const requested = qtyById.get(pid) || 0;

      if (!p) {
        return res.status(409).json({ error: "Product not found", code: "NOT_FOUND", productId: pid });
      }
      if ((Number(p.stock) || 0) < requested) {
        return res.status(409).json({ error: "Out of stock", code: "OUT_OF_STOCK", productId: pid });
      }
    }

    // subtotal
    let subtotalCents = 0;
    const orderItemsData = [];

    for (const pid of ids) {
      const p = productById.get(pid);
      const q = qtyById.get(pid) || 0;
      if (!p || q <= 0) continue;

      subtotalCents += (Number(p.priceCents) || 0) * q;

      orderItemsData.push({
        productId: p.id,
        name: p.name,
        priceCents: p.priceCents,
        quantity: q
      });
    }

    const shippingCents =
      subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;

    const grandTotalCents = subtotalCents + shippingCents;

    // 2) Create order as pending + unpaid + card (NU scădem stoc încă)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "pending",

        totalCents: grandTotalCents,
        shippingCents,

        customerName,
        customerEmail: user.email,
        customerAddress,
        customerPhone,
        customerCity,
        customerCounty,
        ...(postalCode ? { postalCode } : {}),

        paymentMethod: "card",
        paymentStatus: "unpaid",

        items: { create: orderItemsData }
      },
      include: { items: true }
    });

    // 3) Stripe line items (RON)
    const line_items = order.items.map((it) => ({
      price_data: {
        currency: "ron",
        product_data: { name: it.name },
        unit_amount: it.priceCents
      },
      quantity: it.quantity
    }));

    if (shippingCents > 0) {
      line_items.push({
        price_data: {
          currency: "ron",
          product_data: { name: "Transport" },
          unit_amount: shippingCents
        },
        quantity: 1
      });
    }

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: user.email,

      metadata: { orderId: order.id, userId: user.id },

      success_url: `${FRONTEND_URL}/order-success?orderId=${encodeURIComponent(order.id)}`,
      cancel_url: `${FRONTEND_URL}/checkout?canceled=1&orderId=${encodeURIComponent(order.id)}`
    });

    // 4) Save session id on order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return res.json({ ok: true, url: session.url, orderId: order.id });
  } catch (e) {
    console.error("STRIPE CREATE SESSION ERROR:", e);
    const details =
      process.env.NODE_ENV !== "production"
        ? String(e?.raw?.message || e?.message || e)
        : undefined;
    return jsonError(res, 500, "Failed to create Stripe session", details ? { details } : {});
  }
});

/* ============================================================
   STRIPE — WEBHOOK
   POST /api/payments/stripe/webhook
============================================================ */
router.post(
  "/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return jsonError(res, 500, "STRIPE_WEBHOOK_SECRET missing");
      }

      const sig = req.headers["stripe-signature"];
      if (!sig) return res.status(400).send("Missing signature");

      const event = stripe.webhooks.constructEvent(
        req.body, // RAW Buffer
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const orderId = session?.metadata?.orderId;
        const paymentIntentId = session?.payment_intent ? String(session.payment_intent) : null;
        const stripeSessionId = String(session.id);

        if (orderId) {
          let emailPayload = null;

          await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
              where: { id: String(orderId) },
              include: { items: true }
            });
            if (!order) return;

            if (order.paymentStatus === "paid") return; // idempotent

            for (const it of order.items) {
              const p = await tx.product.findFirst({
                where: { id: it.productId, deletedAt: null },
                select: { stock: true }
              });
              const available = Number(p?.stock || 0);
              if (available < it.quantity) {
                await tx.order.update({
                  where: { id: order.id },
                  data: { paymentStatus: "failed" }
                });
                return;
              }
            }

            for (const it of order.items) {
              await tx.product.update({
                where: { id: it.productId },
                data: { stock: { decrement: it.quantity } }
              });
            }

            await tx.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: "paid",
                status: "confirmed",
                stripeSessionId,
                ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {})
              }
            });

            emailPayload = {
              to: order.customerEmail,
              order: {
                id: order.id,
                status: "confirmed",
                totalCents: order.totalCents,
                customer: {
                  name: order.customerName,
                  email: order.customerEmail,
                  address: order.customerAddress,
                  phone: order.customerPhone,
                  city: order.customerCity,
                  county: order.customerCounty,
                  postalCode: order.postalCode || ""
                },
                payment: {
                  method: "card",
                  status: "paid",
                  shippingCents: order.shippingCents
                },
                items: order.items.map((it) => ({
                  name: it.name,
                  priceCents: it.priceCents,
                  quantity: it.quantity
                }))
              }
            };
          });

          if (emailPayload) {
            Promise.resolve(sendOrderConfirmationEmail?.(emailPayload)).catch((e) =>
              console.error("ORDER EMAIL ERROR (STRIPE):", e)
            );
          }
        }
      }

      if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        const orderId = session?.metadata?.orderId;
        if (orderId) {
          await prisma.order
            .update({
              where: { id: String(orderId) },
              data: { paymentStatus: "failed" }
            })
            .catch(() => {});
        }
      }
      console.log("WEBHOOK TYPE:", event.type);

if (event.type === "checkout.session.completed") {
  const session = event.data.object;
  console.log("SESSION ID:", session.id);
  console.log("METADATA:", session.metadata);
}

      return res.json({ received: true });
    } catch (e) {
      console.error("STRIPE WEBHOOK ERROR:", e);
      return res.status(400).send("Webhook Error");
    }
    
  }
  
);
/* ============================================================
   ORDERS (CREATE) — production safe (atomic)
   POST /api/orders

   - validates items
   - checks product existence + stock
   - calculates shipping + grand total
   - decrements stock in same transaction
   - creates Order + OrderItems
============================================================ */

router.post("/orders", userAuth, async (req, res) => {
  const body = req.body || {};
  const customer = body.customer || {};
  const rawItems = Array.isArray(body.items) ? body.items : [];

  if (rawItems.length === 0) return jsonError(res, 400, "Empty cart");

  // Customer fields (required)
  const customerName = String(customer?.name || "").trim();
  const customerAddress = String(customer?.address || "").trim();
  const customerPhone = String(customer?.phone || "").trim();
  const customerCity = String(customer?.city || "").trim();
  const customerCounty = String(customer?.county || "").trim();

  // Optional
  const postalCode = customer?.postalCode != null ? String(customer.postalCode).trim() : null;

  if (!customerName || !customerAddress || !customerPhone || !customerCity || !customerCounty) {
    return jsonError(res, 400, "Missing customer data");
  }

  // Payment method (cod/card)
  const paymentMethodRaw = String(body.paymentMethod || "cod").toLowerCase();
  const paymentMethod = paymentMethodRaw === "card" ? "card" : "cod";

  // Card will be set to paid later via webhook; for now unpaid
  const paymentStatus = "unpaid";

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true }
  });
  if (!user) return jsonError(res, 401, "User not found");

  // Aggregate quantities by product id
  const qtyById = new Map();
  for (const it of rawItems) {
    const id = String(it?.id || "").trim();
    const q = Math.max(1, Number(it?.quantity) || 1);
    if (!id) continue;
    qtyById.set(id, (qtyById.get(id) || 0) + q);
  }
  if (qtyById.size === 0) return jsonError(res, 400, "Invalid items");

  try {
    const created = await prisma.$transaction(async (tx) => {
      const ids = [...qtyById.keys()];

      const products = await tx.product.findMany({
        where: { id: { in: ids }, deletedAt: null },
        select: { id: true, name: true, priceCents: true, stock: true }
      });

      const productById = new Map(products.map((p) => [String(p.id), p]));

      // Validate existence + stock
      for (const pid of ids) {
        const requested = qtyById.get(pid) || 0;
        const p = productById.get(pid);

        if (!p) {
          const err = new Error("NOT_FOUND");
          err.productId = pid;
          throw err;
        }

        const available = Number(p.stock) || 0;
        if (available < requested) {
          const err = new Error("OUT_OF_STOCK");
          err.productId = pid;
          err.available = available;
          err.requested = requested;
          throw err;
        }
      }

      // Compute subtotal
      let subtotalCents = 0;
      const orderItemsData = [];

      for (const pid of ids) {
        const p = productById.get(pid);
        const q = qtyById.get(pid) || 0;
        if (!p || q <= 0) continue;

        subtotalCents += (Number(p.priceCents) || 0) * q;

        orderItemsData.push({
          productId: p.id,
          name: p.name,
          priceCents: p.priceCents,
          quantity: q
        });
      }

      // Shipping
      const shippingCents =
        subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;

      const grandTotalCents = subtotalCents + shippingCents;

      // Decrement stock
      for (const pid of ids) {
        const q = qtyById.get(pid) || 0;
        await tx.product.update({
          where: { id: pid },
          data: { stock: { decrement: q } }
        });
      }

      // Create order (totalCents = grand total)
      return tx.order.create({
        data: {
          userId: user.id,

          status: "pending",
          totalCents: grandTotalCents,
          shippingCents,

          customerName,
          customerEmail: user.email,
          customerAddress,

          customerPhone,
          customerCity,
          customerCounty,
          ...(postalCode ? { postalCode } : {}),

          paymentMethod,
          paymentStatus,

          items: { create: orderItemsData }
        },
        include: {
          items: { select: { id: true, name: true, priceCents: true, quantity: true } }
        }
      });
    });

    // Email confirmare (async)
    Promise.resolve(
      sendOrderConfirmationEmail?.({
        to: created.customerEmail,
        order: {
          id: created.id,
          status: created.status,
          totalCents: created.totalCents,
          customer: {
            name: created.customerName,
            email: created.customerEmail,
            address: created.customerAddress,
            phone: created.customerPhone,
            city: created.customerCity,
            county: created.customerCounty,
            postalCode: created.postalCode || ""
          },
          payment: {
            method: created.paymentMethod,
            status: created.paymentStatus,
            shippingCents: created.shippingCents
          },
          items: created.items.map((it) => ({
            name: it.name,
            priceCents: it.priceCents,
            quantity: it.quantity
          }))
        }
      })
    ).catch((e) => console.error("ORDER EMAIL ERROR:", e));

    return res.status(201).json(created);
  } catch (e) {
    if (e?.message === "NOT_FOUND") {
      return res.status(409).json({
        error: "Product not found",
        code: "NOT_FOUND",
        productId: e.productId
      });
    }

    if (e?.message === "OUT_OF_STOCK") {
      return res.status(409).json({
        error: "Out of stock",
        code: "OUT_OF_STOCK",
        productId: e.productId,
        available: e.available,
        requested: e.requested
      });
    }

    console.error("CREATE ORDER ERROR:", e);
    return jsonError(res, 500, "Internal error");
  }
});

/* ============================================================
   ORDER BY ID (MY)
   GET /api/orders/:id
============================================================ */
router.get("/orders/:id", userAuth, async (req, res, next) => {
  const id = String(req.params.id || "").trim();
  if (id === "my") return next();
  if (!id) return jsonError(res, 400, "Missing order id");

  const order = await prisma.order.findFirst({
    where: { id, userId: req.user.userId },
    include: {
      items: { select: { id: true, name: true, priceCents: true, quantity: true } }
    }
  });

  if (!order) return jsonError(res, 404, "Order not found");

  return res.json({
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    totalCents: order.totalCents,
    shippingCents: order.shippingCents,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.customerAddress,
      city: order.customerCity,
      county: order.customerCounty,
      postalCode: order.postalCode || ""
    },
    items: order.items
  });
});
/* ============================================================
   ORDERS (MY)
   GET /api/orders/my
============================================================ */
router.get("/orders/my", userAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { id: true, name: true, priceCents: true, quantity: true } }
    }
  });

  // returnează exact câmpurile utile în UI
  return res.json(
    orders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,

      totalCents: o.totalCents,
      shippingCents: o.shippingCents,

      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,

      customer: {
        name: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        address: o.customerAddress,
        city: o.customerCity,
        county: o.customerCounty,
        postalCode: o.postalCode || ""
      },

      items: o.items
    }))
  );
});

/* ============================================================
   ADMIN ORDERS
   GET /api/admin/orders
============================================================ */
router.get("/admin/orders", adminAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { id: true, name: true, priceCents: true, quantity: true } }
    }
  });

  return res.json(
    orders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,

      totalCents: o.totalCents,
      shippingCents: o.shippingCents,

      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,

      customer: {
        name: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        address: o.customerAddress,
        city: o.customerCity,
        county: o.customerCounty,
        postalCode: o.postalCode || ""
      },

      items: o.items
    }))
  );
});

/* ============================================================
   ADMIN UPDATE ORDER STATUS
   PATCH /api/admin/orders/:id
   Body: { status: "pending|confirmed|shipped|delivered|cancelled" }
============================================================ */
router.patch("/admin/orders/:id", adminAuth, async (req, res) => {
  const id = String(req.params.id || "");
  const status = String(req.body?.status || "").trim();

  const ALLOWED = new Set(["pending", "confirmed", "shipped", "delivered", "cancelled"]);
  if (!ALLOWED.has(status)) {
    return jsonError(res, 400, "Invalid status");
  }

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!existing) return jsonError(res, 404, "Order not found");

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: { select: { id: true, name: true, priceCents: true, quantity: true } }
    }
  });

  return res.json({ ok: true, order: updated });
});

/* ============================================================
   ORDERS (CANCEL) - restock
   PATCH /api/orders/:id/cancel
============================================================ */
router.patch("/orders/:id/cancel", userAuth, async (req, res) => {
  const id = String(req.params.id || "");

  const order = await prisma.order.findFirst({
    where: { id, userId: req.user.userId },
    include: { items: true }
  });
  if (!order) return jsonError(res, 404, "Order not found");
  if (order.status !== "pending") return jsonError(res, 400, "Only pending orders can be cancelled");

  const updated = await prisma.$transaction(async (tx) => {
    for (const it of order.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { increment: it.quantity } }
      });
    }

    return tx.order.update({
      where: { id: order.id },
      data: { status: "cancelled" },
      include: {
        items: { select: { id: true, name: true, priceCents: true, quantity: true } }
      }
    });
  });

  return res.json({ ok: true, order: updated });
});


export default router;
