import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { API_URL } from "../lib/api";
import { getUserToken } from "../lib/auth";
import { useCart } from "../lib/cart";

function formatRON(cents) {
  return `${(Number(cents || 0) / 100).toFixed(2)} RON`;
}

function paymentLabel(method) {
  if (method === "cod") return "Ramburs (plătești la livrare)";
  if (method === "card") return "Card online";
  return method || "-";
}

function statusLabel(status) {
  switch (status) {
    case "pending":
      return "În procesare";
    case "confirmed":
      return "Confirmată";
    case "shipped":
      return "Expediată";
    case "delivered":
      return "Livrată";
    case "cancelled":
      return "Anulată";
    default:
      return status || "-";
  }
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // clear cart once (safe)
  useEffect(() => {
    if (!router.isReady) return;
    if (clearedRef.current) return;
    clearCart();
    clearedRef.current = true;
  }, [router.isReady, clearCart]);

  // fetch order details
  useEffect(() => {
    if (!router.isReady) return;
    if (!orderId) return;

    let active = true;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const token = getUserToken();
        if (!token) throw new Error("Trebuie să fii logat ca să vezi detaliile comenzii.");

        const res = await fetch(`${API_URL}/orders/${encodeURIComponent(String(orderId))}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) throw new Error("Sesiune expirată. Te rog loghează-te din nou.");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Nu pot încărca detaliile comenzii.");
        }

        const data = await res.json();
        if (active) setOrder(data);
      } catch (e) {
        if (active) setErr(e?.message || "Eroare la încărcarea comenzii.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [router.isReady, orderId]);

  const totals = useMemo(() => {
    const shipping = Number(order?.shippingCents || 0);
    const total = Number(order?.totalCents || 0);
    const subtotal = Math.max(0, total - shipping);
    return { subtotal, shipping, total };
  }, [order?.shippingCents, order?.totalCents]);

  return (
    <div className="container order-success-page">
      <div className="order-success-box">
        <h1>🎉 Comandă plasată cu succes!</h1>

        {orderId && (
          <p>
            Număr comandă: <strong>{orderId}</strong>
          </p>
        )}

        {loading ? (
          <p>Se încarcă detaliile comenzii…</p>
        ) : err ? (
          <>
            <p style={{ color: "red" }}>{err}</p>
            <p>
              Poți vedea comanda și din pagina <Link href="/orders">My Orders</Link>.
            </p>
          </>
        ) : order ? (
          <>
            <div style={{ marginTop: 14, textAlign: "left" }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Status</span>
                  <strong>{statusLabel(order.status)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Plată</span>
                  <strong>{paymentLabel(order.paymentMethod)}</strong>
                </div>

                <hr style={{ opacity: 0.4 }} />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal produse</span>
                  <strong>{formatRON(totals.subtotal)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Transport</span>
                  <strong>{totals.shipping === 0 ? "Gratuit" : formatRON(totals.shipping)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
                  <span>Total</span>
                  <strong>{formatRON(totals.total)}</strong>
                </div>

                <hr style={{ opacity: 0.4 }} />

                <div>
                  <strong>Livrare</strong>
                  <div style={{ marginTop: 6, opacity: 0.9 }}>
                    {order.customer?.name}
                    <br />
                    {order.customer?.phone}
                    <br />
                    {order.customer?.address}
                    <br />
                    {order.customer?.city}, {order.customer?.county}{" "}
                    {order.customer?.postalCode ? `(${order.customer.postalCode})` : ""}
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <strong>Produse</strong>
                  <ul style={{ marginTop: 8 }}>
                    {(order.items || []).map((it) => (
                      <li key={it.id}>
                        {it.quantity} × {it.name} — {formatRON(it.priceCents)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p style={{ marginTop: 14 }}>
              Vei primi un email de confirmare în scurt timp.
            </p>
          </>
        ) : (
          <p>Nu am găsit detaliile comenzii.</p>
        )}

        <div className="order-success-actions" style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center" }}>
          <Link href="/" className="btn">
            Înapoi la Home
          </Link>

          <Link href="/orders" className="btn secondary">
            Vezi comenzile mele
          </Link>
        </div>
      </div>
    </div>
  );
}