import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { validateCart } from "./api";
import { getUserId } from "./user";

const CartContext = createContext(null);

function getCartKey(userId) {
  return userId ? `cart:${userId}` : "cart:guest";
}

function loadCart(userId) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getCartKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // normalize
    return parsed
      .map((x) => ({
        id: String(x?.id || ""),
        quantity: Math.max(1, Number(x?.quantity) || 1),
      }))
      .filter((x) => x.id);
  } catch {
    return [];
  }
}

function saveCart(userId, items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getCartKey(userId), JSON.stringify(items));
}

export function CartProvider({ children }) {
  const userId = getUserId();

  // stocăm strict: { id: "uuid", quantity }
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart(userId));
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(userId, items);
  }, [items, hydrated, userId]);

  /* =====================
     ADD / UPDATE / REMOVE
  ===================== */
  function addToCart(product) {
    const id = product?.id ? String(product.id) : "";
    if (!id) return;

    setItems((prev) => {
      const existing = prev.find((i) => String(i.id) === id);
      if (existing) {
        return prev.map((i) =>
          String(i.id) === id ? { ...i, quantity: (Number(i.quantity) || 0) + 1 } : i
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  }

  function updateQty(id, value) {
    const pid = String(id);
    const qty = Math.floor(Number(value));
    if (!Number.isFinite(qty)) return;

    if (qty <= 0) {
      removeFromCart(pid);
      return;
    }

    setItems((prev) => prev.map((i) => (String(i.id) === pid ? { ...i, quantity: qty } : i)));
  }

  function removeFromCart(id) {
    const pid = String(id);
    setItems((prev) => prev.filter((i) => String(i.id) !== pid));
  }

  function clearCart() {
    setItems([]);
  }

  /* =====================
     VALIDATE (BACKEND)
  ===================== */
  async function validate() {
    if (items.length === 0) {
      return { items: [], totalCents: 0, totalEUR: "0.00", errors: [] };
    }

    const payload = items.map((i) => ({
      id: String(i.id),
      quantity: Number(i.quantity) || 1
    }));

    // backend întoarce: { items: [{id,name,priceCents,quantity}], totalCents, totalEUR }
    return validateCart(payload);
  }

  /* =====================
     UI ITEMS
     (pe moment: doar id+qty; paginile Cart/Checkout pot afișa din validate())
  ===================== */
  const uiItems = useMemo(() => {
    return items.map((i) => ({
      id: String(i.id),
      quantity: Number(i.quantity) || 1
    }));
  }, [items]);

  const value = useMemo(
    () => ({
      items: uiItems,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      validate
    }),
    [uiItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
