import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMyOrders, cancelOrder } from "../lib/api";
import { getUser } from "../lib/auth";

function formatRON(cents) {
  return `${(Number(cents || 0) / 100).toFixed(2)} RON`;
}

function statusLabel(status) {
  const s = String(status || "").toLowerCase();
  if (s === "pending") return "În procesare";
  if (s === "confirmed") return "Confirmată";
  if (s === "shipped") return "Expediată";
  if (s === "delivered") return "Livrată";
  if (s === "cancelled") return "Anulată";
  return s || "-";
}

export default function MyOrdersPage() {
  const [user, setUser] = useState(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getMyOrders();
        if (mounted) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("LOAD ORDERS ERROR", e);
        if (mounted) {
          setError("Nu pot încărca comenzile.");
          setOrders([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const empty = useMemo(() => !loading && !error && orders.length === 0, [loading, error, orders.length]);

  if (!user && !loading) {
    return (
      <div className="container">
        <h1>Comenzile mele</h1>
        <p>Trebuie să fii logat ca să vezi comenzile.</p>
        <Link className="btn" href="/login">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <p>Se încarcă comenzile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="container">
        <h1>Comenzile mele</h1>
        <p>Nu ai comenzi încă.</p>
        <Link className="btn" href="/">Mergi la produse</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Comenzile mele</h1>

      <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
        {orders.map((order) => {
          const status = String(order.status || "").toLowerCase();

          const shipping = Number(order.shippingCents || 0);
          const total = Number(order.totalCents || 0);
          const subtotal = Math.max(0, total - shipping);

          return (
            <div
              key={order.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 14,
                background: "rgba(255,255,255,0.95)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <strong>Comanda #{order.id}</strong>
                  {order.createdAt && (
                    <div style={{ fontSize: 13, color: "var(--secondary)", marginTop: 2 }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <div>
                    Status: <strong>{statusLabel(status)}</strong>
                  </div>
                  <div style={{ marginTop: 2 }}>
                    Total: <strong>{formatRON(total)}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <strong>{formatRON(subtotal)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Transport</span>
                  <strong>{shipping === 0 ? "Gratuit" : formatRON(shipping)}</strong>
                </div>
              </div>

              {Array.isArray(order.items) && order.items.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <strong>Produse:</strong>
                  <ul style={{ marginTop: 6 }}>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity} × {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <Link className="btn" href={`/order-success?orderId=${encodeURIComponent(order.id)}`}>
                  Vezi detalii
                </Link>

                {status === "pending" && (
                  <button
                    className="btn"
                    disabled={busyId === order.id}
                    onClick={async () => {
                      if (!confirm("Anulezi această comandă?")) return;

                      setBusyId(order.id);
                      try {
                        await cancelOrder(order.id);
                        const refreshed = await getMyOrders();
                        setOrders(Array.isArray(refreshed) ? refreshed : []);
                      } finally {
                        setBusyId(null);
                      }
                    }}
                  >
                    {busyId === order.id ? "Se anulează…" : "Anulează"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}