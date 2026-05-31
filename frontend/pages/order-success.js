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
  if (method === "cod") return "Cash on delivery";
  if (method === "card") return "Online card payment";
  return method || "-";
}

function statusLabel(status) {
  if (status === "pending") return "Processing";
  if (status === "confirmed") return "Confirmed";
  if (status === "shipped") return "Shipped";
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  return status || "-";
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const { clearCart } = useCart();
  const clearedRef = useRef(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!router.isReady || clearedRef.current) return;
    clearCart();
    clearedRef.current = true;
  }, [router.isReady, clearCart]);

  useEffect(() => {
    if (!router.isReady || !orderId) return;
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const token = getUserToken();
        if (!token) throw new Error("You need to be signed in to view your order details.");
        const res = await fetch(`${API_URL}/orders/${encodeURIComponent(String(orderId))}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) throw new Error("Your session has expired. Please sign in again.");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "We could not load the order details.");
        }
        const data = await res.json();
        if (active) setOrder(data);
      } catch (e) {
        if (active) setErr(e?.message || "Failed to load the order.");
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
    return { subtotal: Math.max(0, total - shipping), shipping, total };
  }, [order?.shippingCents, order?.totalCents]);

  return (
    <div className="container order-success-page">
      <div className="order-success-box">
        <h1>Order placed successfully!</h1>
        {orderId && <p>Order number: <strong>{orderId}</strong></p>}

        {loading ? (
          <p>Loading order details...</p>
        ) : err ? (
          <>
            <p style={{ color: "red" }}>{err}</p>
            <p>You can also view the order from <Link href="/orders">My Orders</Link>.</p>
          </>
        ) : order ? (
          <>
            <div style={{ marginTop: 14, textAlign: "left" }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Status</span><strong>{statusLabel(order.status)}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Payment</span><strong>{paymentLabel(order.paymentMethod)}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Products subtotal</span><strong>{formatRON(totals.subtotal)}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Shipping</span><strong>{totals.shipping === 0 ? "Free" : formatRON(totals.shipping)}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}><span>Total</span><strong>{formatRON(totals.total)}</strong></div>

                <div>
                  <strong>Shipping address</strong>
                  <div style={{ marginTop: 6, opacity: 0.9 }}>
                    {order.customer?.name}<br />
                    {order.customer?.phone}<br />
                    {order.customer?.address}<br />
                    {order.customer?.city}, {order.customer?.county} {order.customer?.postalCode ? `(${order.customer.postalCode})` : ""}
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <strong>Products</strong>
                  <ul style={{ marginTop: 8 }}>
                    {(order.items || []).map((it) => (
                      <li key={it.id}>{it.quantity} x {it.name} - {formatRON(it.priceCents)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p style={{ marginTop: 14 }}>You will receive a confirmation email shortly.</p>
          </>
        ) : (
          <p>We could not find this order.</p>
        )}

        <div className="order-success-actions" style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center" }}>
          <Link href="/" className="btn">Back to home</Link>
          <Link href="/orders" className="btn secondary">View my orders</Link>
        </div>
      </div>
    </div>
  );
}
