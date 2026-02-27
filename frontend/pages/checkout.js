import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { useCart } from "../lib/cart";
import { API_URL } from "../lib/api";
import { getUserToken } from "../lib/auth";


// MVP shipping rules (trebuie să fie aceleași ca în backend)
const FREE_SHIPPING_THRESHOLD_CENTS = 19900; // 199 RON
const SHIPPING_FLAT_CENTS = 1999; // 19.99 RON

const COUNTIES_RO = [
  "Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","București",
  "Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu",
  "Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț",
  "Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, validate, clearCart } = useCart();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [stockErrorProductId, setStockErrorProductId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    county: "",
    city: "",
    address: "",
    postalCode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | card

  const hasItems = items.length > 0;

  <label>
  Metodă de plată
  <select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
    style={{ padding: 12, borderRadius: 10, border: "1px solid var(--border)" }}
  >
    <option value="cod">Ramburs (cash la livrare)</option>
    <option value="card">Card online (Stripe)</option>
  </select>
</label>

  // --- validate form
  const isFormInvalid = useMemo(() => {
    const name = form.name?.trim();
    const phone = form.phone?.trim();
    const county = form.county?.trim();
    const city = form.city?.trim();
    const address = form.address?.trim();

    // validare minimă telefon RO: 10 cifre (07xxxxxxxx)
    const digits = (phone || "").replace(/\D/g, "");
    const phoneOk = digits.length >= 10;

    return !name || !phoneOk || !county || !city || !address;
  }, [form]);

  const validateErrors = summary?.errors || [];
  const hasBlockingErrors = useMemo(() => {
    return validateErrors.some((e) => e.code === "NOT_FOUND" || e.code === "OUT_OF_STOCK");
  }, [validateErrors]);

  // --- totals
  const subtotalCents = Number(summary?.subtotalCents || 0);

  const shippingCents = Number(summary?.shippingCents || 0);

  const grandTotalCents = Number(summary?.grandTotalCents || 0);

  const disableSubmit =
    submitting ||
    Boolean(stockErrorProductId) ||
    isFormInvalid ||
    hasBlockingErrors ||
    !hasItems;

  useEffect(() => {
    let active = true;

    async function run() {
      setError(null);
      setStockErrorProductId(null);

      if (!hasItems) {
        setSummary(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await validate();
        if (!active) return;

        setSummary(data || null);

        const firstStockErr = (data?.errors || []).find((e) => e.code === "OUT_OF_STOCK");
        if (firstStockErr?.productId) {
          setStockErrorProductId(String(firstStockErr.productId));
        }
      } catch {
        if (!active) return;
        setSummary(null);
        setError("Nu am putut valida coșul. Reîncearcă.");
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [hasItems, validate]);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submitOrder(e) {
  e.preventDefault();
  if (disableSubmit) return;

  setSubmitting(true);
  setError(null);

  try {
    const token = getUserToken();
    if (!token) throw new Error("Trebuie să fii logat ca să plasezi comanda.");

    // ✅ payload unic, folosit și la COD și la CARD
    const payload = {
      customer: {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone?.trim?.() || "",       // dacă ai în form
        city: form.city?.trim?.() || "",         // dacă ai în form
        county: form.county?.trim?.() || "",     // dacă ai în form
        postalCode: form.postalCode?.trim?.() || "" // opțional
      },
      items: items.map((i) => ({
        id: String(i.id),
        quantity: Number(i.quantity) || 1
      })),
      paymentMethod // "cod" sau "card"
    };

    // ✅ CARD → create Stripe session + redirect
        if (paymentMethod === "card") {
      const res = await fetch(`${API_URL}/payments/stripe/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setStockErrorProductId(data?.productId ? String(data.productId) : null);
        throw new Error("Un produs nu mai este în stoc. Revino în coș.");
      }

      if (res.status === 401) throw new Error("Sesiune expirată. Te rog loghează-te din nou.");
      if (!res.ok) throw new Error(data?.details || data?.error || "Nu pot iniția plata cu card.");
      if (!data?.url) throw new Error("Stripe URL lipsește.");
      window.location.href = data.url; // redirect Stripe Checkout
      return;

    }

    // ✅ COD → /orders ca înainte
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 409) {
      const data = await res.json().catch(() => ({}));
      setStockErrorProductId(data?.productId ? String(data.productId) : null);
      throw new Error("Un produs nu mai este în stoc. Revino în coș.");
    }

    if (res.status === 401) throw new Error("Sesiune expirată. Te rog loghează-te din nou.");

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || data?.message || "Comanda nu a putut fi plasată.");
    }

    const data = await res.json();

    clearCart();
    router.push(`/order-success?orderId=${encodeURIComponent(data.id)}`);
  } catch (err) {
    setError(err?.message || "A apărut o eroare la plasarea comenzii.");
  } finally {
    setSubmitting(false);
  }
}

  if (!loading && !hasItems) {
    return (
      <div className="container">
        <h1>Checkout</h1>
        <p>Coșul este gol.</p>
        <button className="btn" onClick={() => router.push("/cart")}>
          Înapoi la coș
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <p>Se încarcă checkout…</p>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <button type="button" className="back-link" onClick={() => router.back()}>
        ← Înapoi la coș
      </button>

      <h1>Finalizează comanda</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {hasBlockingErrors && (
        <div style={{ border: "1px solid #f1c40f", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <strong>⚠️ Coșul are probleme:</strong>
          <ul style={{ marginTop: 8 }}>
            {validateErrors.map((e, idx) => (
              <li key={`${e.code}-${e.productId}-${idx}`}>
                {e.message} ({e.code})
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 8 }}>
            Te rog revino în coș și rezolvă erorile înainte să confirmi comanda.
          </p>
          <button className="btn" type="button" onClick={() => router.push("/cart")}>
            Înapoi la coș
          </button>
        </div>
      )}

      {summary && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gap: 6, maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal produse</span>
              <strong>{(subtotalCents / 100).toFixed(2)} RON</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Transport</span>
              <strong>
                {shippingCents === 0 ? "Gratuit" : `${(shippingCents / 100).toFixed(2)} RON`}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, marginTop: 6 }}>
              <span>Total</span>
              <strong>{(grandTotalCents / 100).toFixed(2)} RON</strong>
            </div>
          </div>

          <ul style={{ marginTop: 12 }}>
            {(summary.items || []).map((item) => {
              const id = String(item.id);
              const stockError = stockErrorProductId && id === String(stockErrorProductId);

              return (
                <li
                  key={id}
                  style={{
                    color: stockError ? "red" : "inherit",
                    fontWeight: stockError ? 600 : 400
                  }}
                >
                  {item.quantity} × {item.name}
                  {stockError ? " — stoc insuficient" : ""}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <form className="checkout-form" onSubmit={submitOrder}>
        <h3 style={{ margin: "8px 0 0" }}>Date livrare</h3>

        <label>
          Nume complet
          <input name="name" value={form.name} onChange={updateField} required />
        </label>

        <label>
          Telefon
          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="07xxxxxxxx"
            inputMode="tel"
            required
          />
        </label>

        <label>
          Județ
          <select name="county" value={form.county} onChange={updateField} required>
            <option value="">Alege județul</option>
            {COUNTIES_RO.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Oraș
          <input name="city" value={form.city} onChange={updateField} required />
        </label>

        <label>
          Adresă livrare
          <textarea name="address" value={form.address} onChange={updateField} required />
        </label>

        <label>
          Cod poștal (opțional)
          <input name="postalCode" value={form.postalCode} onChange={updateField} />
        </label>

        <h3 style={{ margin: "10px 0 0" }}>Metodă de plată</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Ramburs (plătești la livrare)
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Card online (Stripe)
          </label>
        </div>

        <button className="btn full" disabled={disableSubmit}>
          {submitting
            ? "Plasăm comanda…"
            : hasBlockingErrors
            ? "Rezolvă coșul"
            : stockErrorProductId
            ? "Actualizează coșul"
            : "Confirmă comanda"}
        </button>
      </form>
    </div>
  );
}


