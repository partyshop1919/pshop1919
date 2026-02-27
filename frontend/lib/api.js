import axios from "axios";
import { getAdminToken, getUserToken } from "./auth";

/* =====================
   AXIOS INSTANCE
===================== */
export const BACKEND_URL = "http://localhost:4000";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

/* =====================
   HELPERS
===================== */
function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleError(label, err, fallback) {
  console.error(`[API] ${label}`, err?.response?.data || err);
  return fallback;
}

/* =====================
   PRODUCTS (PUBLIC)
   GET /products?featured=1&category=Baloane&search=abc&ids=a,b,c
===================== */
export async function fetchProducts(params = {}) {
  try {
    const q = new URLSearchParams();

    if (params.category) q.set("category", String(params.category));
    if (params.featured) q.set("featured", "1");
    if (params.search) q.set("search", String(params.search));

    if (params.ids && Array.isArray(params.ids) && params.ids.length > 0) {
      q.set(
        "ids",
        params.ids.map(String).filter(Boolean).join(",")
      );
    }

    const url = q.toString() ? `/products?${q.toString()}` : "/products";

    const res = await api.get(url);
    return Array.isArray(res.data?.items) ? res.data.items : [];
  } catch (err) {
    return handleError("fetchProducts", err, []);
  }
}

export async function fetchProductsByCategory(category) {
  return fetchProducts({ category });
}

export async function fetchFeaturedProducts() {
  return fetchProducts({ featured: true });
}

export async function fetchProductsByIds(ids) {
  return fetchProducts({ ids });
}

/* =====================
   PRODUCT (SINGLE)
   GET /products/slug/:slug  -> { item }
===================== */
export async function fetchProductBySlug(slug) {
  try {
    if (!slug) return null;
    const res = await api.get(`/products/slug/${encodeURIComponent(String(slug))}`);
    return res.data?.item || null;
  } catch (err) {
    return handleError("fetchProductBySlug", err, null);
  }
}

/* =====================
   CART
===================== */
export async function validateCart(items) {
  try {
    const res = await api.post("/cart/validate", { items });
    const rawItems = Array.isArray(res.data?.items) ? res.data.items : [];
    const subtotalCents = Number(res.data?.subtotalCents ?? res.data?.totalCents ?? 0) || 0;
    const shippingCents = Number(res.data?.shippingCents ?? 0) || 0;
    const grandTotalCents =
      Number(res.data?.grandTotalCents ?? subtotalCents + shippingCents) || 0;

    return {
      items: rawItems.map((item) => ({
        ...item,
        id: String(item?.id ?? ""),
        quantity: Number(item?.quantity) || 1,
        priceCents: Number(item?.priceCents ?? item?.unitAmount ?? item?.price ?? 0) || 0
      })),
      subtotalCents,
      shippingCents,
      grandTotalCents,
      totalCents: grandTotalCents,
      totalEUR: res.data?.totalEUR || "0.00",
      errors: res.data?.errors || []
    };
  } catch (err) {
    return handleError("validateCart", err, {
      items: [],
      subtotalCents: 0,
      shippingCents: 0,
      grandTotalCents: 0,
      totalCents: 0,
      totalEUR: "0.00",
      errors: []
    });
  }
}

/* =====================
   ORDERS (USER)
===================== */
export async function createOrder(order) {
  try {
    const token = getUserToken();
    if (!token) throw new Error("No user token");

    const res = await api.post("/orders", order, {
      headers: authHeader(token)
    });

    return res.data;
  } catch (err) {
    return handleError("createOrder", err, null);
  }
}

export async function getMyOrders() {
  try {
    const token = getUserToken();
    if (!token) return [];

    const res = await api.get("/orders/my", {
      headers: authHeader(token)
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return handleError("getMyOrders", err, []);
  }
}

export async function cancelOrder(orderId) {
  try {
    const token = getUserToken();
    if (!token) throw new Error("No user token");

    const res = await api.patch(
      `/orders/${encodeURIComponent(String(orderId))}/cancel`,
      {},
      { headers: authHeader(token) }
    );

    return res.data;
  } catch (err) {
    return handleError("cancelOrder", err, null);
  }
}

/* =====================
   ADMIN AUTH
===================== */
export async function adminLogin(password) {
  try {
    const res = await api.post("/admin/login", { password });
    return res.data;
  } catch (err) {
    return handleError("adminLogin", err, null);
  }
}

/* =====================
   ADMIN PRODUCTS
===================== */
export async function adminGetProducts() {
  try {
    const token = getAdminToken();
    if (!token) return [];

    const res = await api.get("/products", {
      headers: authHeader(token)
    });

    return Array.isArray(res.data?.items) ? res.data.items : [];
  } catch (err) {
    return handleError("adminGetProducts", err, []);
  }
}

export async function adminUploadProductImage(file) {
  try {
    const token = getAdminToken();
    if (!token) throw new Error("No admin token");

    const fd = new FormData();
    fd.append("image", file);

    const res = await api.post("/upload/product-image", fd, {
      headers: authHeader(token) // nu seta Content-Type manual
    });

    // { ok: true, image: "/uploads/products/..." }
    return res.data;
  } catch (err) {
    return handleError("adminUploadProductImage", err, null);
  }
}

export async function adminCreateProduct(product) {
  try {
    const token = getAdminToken();
    if (!token) throw new Error("No admin token");

    const res = await api.post("/products", product, {
      headers: authHeader(token)
    });

    return res.data;
  } catch (err) {
    return handleError("adminCreateProduct", err, null);
  }
}

export async function adminUpdateProduct(id, product) {
  try {
    const token = getAdminToken();
    if (!token) throw new Error("No admin token");

    const res = await api.put(`/products/${encodeURIComponent(String(id))}`, product, {
      headers: authHeader(token)
    });

    return res.data;
  } catch (err) {
    return handleError("adminUpdateProduct", err, null);
  }
}

export async function adminDeleteProduct(id) {
  try {
    const token = getAdminToken();
    if (!token) throw new Error("No admin token");

    const res = await api.delete(`/products/${encodeURIComponent(String(id))}`, {
      headers: authHeader(token)
    });

    return res.data;
  } catch (err) {
    return handleError("adminDeleteProduct", err, null);
  }
}

/* =====================
   ADMIN ORDERS
===================== */
export async function adminGetOrders() {
  try {
    const token = getAdminToken();
    if (!token) return [];

    const res = await api.get("/admin/orders", {
      headers: authHeader(token)
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return handleError("adminGetOrders", err, []);
  }
}

export async function adminUpdateOrder(orderId, status) {
  try {
    const token = getAdminToken();
    if (!token) throw new Error("No admin token");

    const res = await api.patch(
      `/admin/orders/${encodeURIComponent(String(orderId))}`,
      { status },
      { headers: authHeader(token) }
    );

    return res.data;
  } catch (err) {
    return handleError("adminUpdateOrder", err, null);
  }
}

/* =====================
   FAVORITES (USER) — production
===================== */
export async function getMyFavorites() {
  try {
    const token = getUserToken();
    if (!token) return [];

    const res = await api.get("/favorites", { headers: authHeader(token) });

    const raw = Array.isArray(res.data?.items)
      ? res.data.items
      : Array.isArray(res.data)
      ? res.data
      : [];

    // Normalizare: backend poate întoarce:
    // 1) produse direct: { id, name, ... }
    // 2) favorite records: { id, productId, product: {...} }
    // 3) alt format similar
    const normalized = raw
      .map((x) => {
        const product = x?.product ?? x;

        const id =
          x?.productId ??
          x?.product_id ??
          product?.id ??
          x?.id;

        if (id == null) return null;

        return {
          ...product,
          id: String(id)
        };
      })
      .filter(Boolean);

    // uniq by product id (ca să nu se dubleze)
    const map = new Map();
    for (const p of normalized) {
      if (!map.has(p.id)) map.set(p.id, p);
    }

    return Array.from(map.values());
  } catch (err) {
    return handleError("getMyFavorites", err, []);
  }
}
export async function addFavorite(productId) {
  try {
    const token = getUserToken();
    if (!token) throw new Error("No user token");

    await api.post(
      `/favorites/${encodeURIComponent(String(productId))}`,
      {},
      { headers: authHeader(token) }
    );
    return true;
  } catch (err) {
    handleError("addFavorite", err, false);
    return false;
  }
}

export async function removeFavorite(productId) {
  try {
    const token = getUserToken();
    if (!token) throw new Error("No user token");

    await api.delete(
      `/favorites/${encodeURIComponent(String(productId))}`,
      { headers: authHeader(token) }
    );
    return true;
  } catch (err) {
    handleError("removeFavorite", err, false);
    return false;
  }
}
/* =====================
   FAVORITES (ALIASES)
   pentru compatibilitate cu lib/favorites.js
===================== */
export const favoritesGet = getMyFavorites;
export const favoritesAdd = addFavorite;
export const favoritesRemove = removeFavorite;
