import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "../../components/AdminGuard";
import { useAdmin } from "../../lib/auth";
import { adminGetOrders, adminUpdateOrder } from "../../lib/api";

function formatRON(cents) {
  return `${(Number(cents || 0) / 100).toFixed(2)} RON`;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "pending" },
  { value: "confirmed", label: "confirmed" },
  { value: "shipped", label: "shipped" },
  { value: "delivered", label: "delivered" },
  { value: "cancelled", label: "cancelled" }
];

export default function AdminOrders() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminGetOrders();
      const list = Array.isArray(res) ? res : Array.isArray(res?.items) ? res.items : Array.isArray(res?.orders) ? res.orders : [];
      setOrders(list);
    } catch (e) {
      console.error("ADMIN LOAD ORDERS ERROR", e);
      setOrders([]);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadOrders();
  }, [token, loadOrders]);

  const statusValues = useMemo(() => new Set(STATUS_OPTIONS.map((x) => x.value)), []);

  async function changeStatus(orderId, nextStatus) {
    const status = String(nextStatus || "").trim();
    if (!statusValues.has(status)) {
      alert("Invalid status");
      return;
    }
    setBusyId(orderId);
    setError(null);
    try {
      await adminUpdateOrder(orderId, status);
      await loadOrders();
    } catch (e) {
      console.error("UPDATE STATUS ERROR", e);
      setError("Unable to update the order status.");
      alert("Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function copyId(id) {
    try {
      await navigator.clipboard?.writeText(String(id));
      setCopiedId(String(id));
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      alert("Unable to copy the ID.");
    }
  }

  if (!token) return null;

  return (
    <AdminGuard>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h1 style={{ margin: 0 }}>Admin - Orders</h1>
          <button className="btn" type="button" onClick={loadOrders} disabled={loading}>Refresh</button>
        </div>

        {loading && <p style={{ marginTop: 12 }}>Loading...</p>}
        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

        {!loading && orders.length === 0 && (
          <div className="empty-state" style={{ marginTop: 20 }}>
            <div className="empty-icon">Mail</div>
            <h3>No orders available</h3>
            <p>The first order will appear here once it is placed.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
            {orders.map((order) => {
              const id = String(order?.id || "");
              const createdAt = order?.createdAt ? new Date(order.createdAt) : null;
              const total = Number(order?.totalCents || 0);
              const shipping = Number(order?.shippingCents || 0);
              const subtotal = Math.max(0, total - shipping);
              const customer = order?.customer || {};
              const customerName = order?.customerName || customer?.name || "-";
              const customerEmail = order?.customerEmail || customer?.email || "-";
              const customerPhone = order?.customerPhone || customer?.phone || "-";
              const customerCounty = order?.customerCounty || customer?.county || "-";
              const customerCity = order?.customerCity || customer?.city || "-";
              const customerAddress = order?.customerAddress || customer?.address || "-";
              const postalCode = order?.postalCode || customer?.postalCode || "";
              const paymentMethod = String(order?.paymentMethod || "-");
              const paymentStatus = String(order?.paymentStatus || "-");
              const status = String(order?.status || "pending");
              const isBusy = busyId === id;

              return (
                <div key={id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.96)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 320 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <strong>Order #{id}</strong>
                        {copiedId === id && <span style={{ fontSize: 12, color: "var(--secondary)" }}>Copied</span>}
                      </div>

                      {createdAt && <div style={{ fontSize: 13, color: "var(--secondary)", marginTop: 2 }}>{createdAt.toLocaleString()}</div>}

                      <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
                        <div><strong>Customer:</strong> {customerName}</div>
                        <div><strong>Email:</strong> {customerEmail}</div>
                        <div><strong>Phone:</strong> {customerPhone}</div>
                        <div style={{ marginTop: 6 }}><strong>Shipping:</strong> {customerAddress}, {customerCity}, {customerCounty}{postalCode ? ` (${postalCode})` : ""}</div>
                      </div>

                      <div style={{ marginTop: 12, display: "grid", gap: 4 }}>
                        <div>Subtotal: <strong>{formatRON(subtotal)}</strong></div>
                        <div>Shipping: <strong>{shipping === 0 ? "Free" : formatRON(shipping)}</strong></div>
                        <div>Total: <strong>{formatRON(total)}</strong></div>
                        <div>Payment: <strong>{paymentMethod}</strong> - <strong>{paymentStatus}</strong></div>
                        <div>Current status: <strong>{status}</strong></div>
                      </div>
                    </div>

                    <div style={{ minWidth: 240 }}>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Status</label>
                      <select value={statusValues.has(status) ? status : "pending"} onChange={(e) => changeStatus(id, e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid var(--border)" }} disabled={isBusy}>
                        {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                      <button className="btn" style={{ marginTop: 10, width: "100%" }} type="button" onClick={() => copyId(id)} disabled={isBusy}>Copy ID</button>
                    </div>
                  </div>

                  {Array.isArray(order?.items) && order.items.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <strong>Products:</strong>
                      <ul style={{ marginTop: 6 }}>
                        {order.items.map((item) => <li key={String(item.id || `${item.name}-${item.quantity}`)}>{Number(item.quantity || 0)} x {item.name} - {formatRON(item.priceCents)}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
