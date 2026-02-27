import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useCart } from "../lib/cart";
import { BACKEND_URL } from "../lib/api";

function resolveImage(image) {
  if (!image) return null;
  if (typeof image === "string" && image.startsWith("/images")) return image; // Next /public
  if (typeof image === "string") return `${BACKEND_URL}${image}`; // backend uploads
  if (typeof image === "object" && image.url) {
    return image.url.startsWith("http") ? image.url : `${BACKEND_URL}${image.url}`;
  }
  return null;
}

export default function CartPage() {
  const router = useRouter();
  const { items, updateQty, removeFromCart, validate } = useCart();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    if (items.length === 0) {
      setSummary(null);
      return;
    }

    let active = true;
    setLoading(true);

    validate()
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch(() => {
        if (active) setSummary(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [items, mounted, validate]);

  const byId = useMemo(() => new Map((summary?.items || []).map((p) => [String(p.id), p])), [summary]);

  const errors = summary?.errors || [];

  const errorsByProductId = useMemo(() => {
    const m = new Map();
    for (const e of errors) {
      const pid = String(e.productId);
      if (!m.has(pid)) m.set(pid, []);
      m.get(pid).push(e);
    }
    return m;
  }, [errors]);

  const hasBlockingErrors = useMemo(() => {
    // dacă există NOT_FOUND sau OUT_OF_STOCK -> blocăm checkout
    return errors.some((e) => e.code === "NOT_FOUND" || e.code === "OUT_OF_STOCK");
  }, [errors]);

  if (!mounted) {
    return (
      <div className="container">
        <p>Loading cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <h1>Coșul tău</h1>
        <p>Coșul este gol.</p>
        <Link href="/" className="btn">
          Mergi la produse
        </Link>
      </div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="container">
        <p>Validating cart…</p>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <button type="button" className="back-link" onClick={() => router.back()}>
        ← Înapoi la cumpărături
      </button>

      <h1>Coșul tău</h1>

      {errors.length > 0 && (
        <div style={{ border: "1px solid #f1c40f", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <strong>⚠️ Atenție:</strong>
          <ul style={{ marginTop: 8 }}>
            {errors.map((e, idx) => (
              <li key={`${e.code}-${e.productId}-${idx}`}>
                {e.message} ({e.code}) — produs: <code>{String(e.productId)}</code>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 8, color: "var(--secondary)" }}>
            Te rog elimină/ajustează produsele marcate ca să poți finaliza comanda.
          </div>
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const itemId = String(item.id);
            const quantity = Number(item.quantity) || 1;

            const p = byId.get(itemId);
            const missing = !p; // nu a venit din backend validate -> nu există
            const perItemErrors = errorsByProductId.get(itemId) || [];

            const name = missing ? "Produs indisponibil" : String(p.name || "");
            const priceCents = missing ? 0 : Number(p.priceCents) || 0;
            const stock = missing ? 0 : Number(p.stock) || 0;

            const imageUrl = missing ? null : resolveImage(p.image);

            const canIncrease = !missing && quantity < stock; // dacă qty >= stock, blocăm +

            return (
              <div key={itemId} className="cart-item">
                <div className="cart-image">
                  {imageUrl ? <img src={imageUrl} alt={name} /> : <div className="image-placeholder" />}
                </div>

                <div className="cart-info">
                  <h3 style={{ color: missing ? "red" : "inherit" }}>{name}</h3>

                  <p>{(priceCents / 100).toFixed(2)} RON</p>

                  {!missing && (
                    <p style={{ color: "var(--secondary)", marginTop: 4 }}>
                      Stoc: <strong>{stock}</strong>
                    </p>
                  )}

                  <div className="qty-controls">
                    <button
                      type="button"
                      onClick={() => updateQty(itemId, quantity - 1)}
                      disabled={missing}
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateQty(itemId, quantity + 1)}
                      disabled={missing || !canIncrease}
                      title={!canIncrease && !missing ? "Stoc insuficient" : ""}
                    >
                      +
                    </button>
                  </div>

                  {(!missing && quantity > stock) && (
                    <p style={{ color: "red", marginTop: 8 }}>
                      Cantitatea depășește stocul. Redu cantitatea.
                    </p>
                  )}

                  {(!missing && quantity === stock) && (
                    <p style={{ color: "red", marginTop: 8 }}>
                      Ai atins stocul maxim disponibil.
                    </p>
                  )}

                  {missing && (
                    <p style={{ color: "red", marginTop: 8 }}>
                      Acest produs nu mai este disponibil. Te rugăm să îl elimini din coș.
                    </p>
                  )}

                  {perItemErrors.length > 0 && (
                    <ul style={{ marginTop: 8, color: "red" }}>
                      {perItemErrors.map((e, idx) => (
                        <li key={`${e.code}-${idx}`}>{e.message}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="cart-actions">
                  <strong>{((priceCents * quantity) / 100).toFixed(2)} RON</strong>

                  <button type="button" className="link-btn" onClick={() => removeFromCart(itemId)}>
                    Elimină
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Sumar comandă</h2>

          <div className="summary-row">
            <span>Total produse</span>
            <span>{(Number(summary.grandTotalCents || 0) / 100).toFixed(2)} RON</span>
          </div>

          <button
            className="btn full"
            onClick={() => router.push("/checkout")}
            disabled={hasBlockingErrors}
            title={hasBlockingErrors ? "Rezolvă erorile din coș înainte de checkout" : ""}
          >
            Finalizează comanda
          </button>
        </div>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{(Number(summary.subtotalCents || 0) / 100).toFixed(2)} RON</span>
        </div>

        <div className="summary-row">
          <span>Transport</span>
          <span>
            {Number(summary.shippingCents || 0) === 0
              ? "Gratuit"
              : `${(Number(summary.shippingCents || 0) / 100).toFixed(2)} RON`}
          </span>
        </div>

        <div className="summary-row">
          <span>Total</span>
          <span>{(Number(summary.grandTotalCents || 0) / 100).toFixed(2)} RON</span>
        </div>
      </div>
    </div>
  );
}
