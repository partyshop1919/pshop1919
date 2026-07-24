import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useCart } from "../lib/cart";
import { API_URL } from "../lib/api";
import { getUserToken } from "../lib/auth";

const CARD_PAYMENT_TIMEOUT_MS = 45000;
const COUNTIES_RO = [
  "Alba", "Arad", "Arges", "Bacau", "Bihor", "Bistrita-Nasaud", "Botosani", "Braila", "Brasov", "Bucuresti",
  "Buzau", "Calarasi", "Caras-Severin", "Cluj", "Constanta", "Covasna", "Dambovita", "Dolj", "Galati", "Giurgiu",
  "Gorj", "Harghita", "Hunedoara", "Ialomita", "Iasi", "Ilfov", "Maramures", "Mehedinti", "Mures", "Neamt",
  "Olt", "Prahova", "Salaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timis", "Tulcea", "Valcea", "Vaslui", "Vrancea"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, validate, clearCart } = useCart();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stockErrorProductId, setStockErrorProductId] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", county: "", city: "", address: "", postalCode: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  const hasItems = items.length > 0;
  const isFormInvalid = useMemo(() => {
    const digits = String(form.phone || "").replace(/\D/g, "");
    return !form.name.trim() || digits.length < 10 || !form.county.trim() || !form.city.trim() || !form.address.trim();
  }, [form]);

  const validateErrors = summary?.errors || [];
  const hasBlockingErrors = useMemo(() => validateErrors.some((e) => e.code === "NOT_FOUND" || e.code === "OUT_OF_STOCK"), [validateErrors]);
  const subtotalCents = Number(summary?.subtotalCents || 0);
  const shippingCents = Number(summary?.shippingCents || 0);
  const grandTotalCents = Number(summary?.grandTotalCents || 0);
  const disableSubmit = submitting || Boolean(stockErrorProductId) || isFormInvalid || hasBlockingErrors || !hasItems;

  const submitBlocker = useMemo(() => {
    if (!hasItems) return "Coșul tău este gol.";
    if (stockErrorProductId || hasBlockingErrors) return "Coșul conține produse indisponibile sau stoc insuficient.";
    if (isFormInvalid) return "Completează datele de livrare: nume complet, telefon valid, județ, oraș și adresă.";
    if (!acceptedLegal) return "Te rugăm să accepți Termenii și Politica de confidențialitate.";
    return "";
  }, [acceptedLegal, hasBlockingErrors, hasItems, isFormInvalid, stockErrorProductId]);

  async function fetchJsonWithTimeout(url, options, timeoutMs = CARD_PAYMENT_TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      const data = await res.json().catch(() => ({}));
      return { res, data };
    } catch (e) {
      if (e?.name === "AbortError") throw new Error("Serverul a răspuns prea greu. Te rugăm să încerci din nou în câteva secunde.");
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  }

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
        if (firstStockErr?.productId) setStockErrorProductId(String(firstStockErr.productId));
      } catch {
        if (!active) return;
        setSummary(null);
        setError("Nu am putut valida coșul. Te rugăm să încerci din nou.");
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
    if (!acceptedLegal) {
      const msg = "Te rugăm să accepți Termenii și Condițiile și Politica de confidențialitate înainte de confirmarea comenzii.";
      setError(msg);
      if (typeof window !== "undefined") window.alert(msg);
      return;
    }
    if (disableSubmit) {
      setError(submitBlocker || "Comanda nu poate fi trimisă încă. Verifică datele completate.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = getUserToken();
      if (!token) throw new Error("Trebuie să fii autentificat pentru a plasa o comandă.");

      const payload = {
        customer: {
          name: form.name.trim(),
          address: form.address.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          county: form.county.trim(),
          postalCode: form.postalCode.trim()
        },
        items: items.map((i) => ({ id: String(i.id), quantity: Number(i.quantity) || 1 })),
        paymentMethod
      };

      if (paymentMethod === "card") {
        const { res, data } = await fetchJsonWithTimeout(`${API_URL}/payments/stripe/create-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.status === 409) {
          setStockErrorProductId(data?.productId ? String(data.productId) : null);
          throw new Error("Un produs nu mai este în stoc. Te rugăm să revii în coș.");
        }
        if (res.status === 401) {
          throw new Error(data?.error || data?.message || "Autentificarea a eșuat. Te rugăm să te autentifici din nou.");
        }
        if (!res.ok) throw new Error(data?.details || data?.error || "Nu am putut porni plata cu cardul.");
        if (!data?.url) throw new Error("Lipsește linkul pentru checkout Stripe.");
        window.location.assign(data.url);
        return;
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        setStockErrorProductId(data?.productId ? String(data.productId) : null);
        throw new Error("Un produs nu mai este în stoc. Te rugăm să revii în coș.");
      }
      if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || data?.message || "Autentificarea a eșuat. Te rugăm să te autentifici din nou.");
      }
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
    return <div className="container"><h1>Finalizare comandă</h1><p>Coșul tău este gol.</p><button className="btn" onClick={() => router.push("/cart")}>Înapoi la coș</button></div>;
  }

  if (loading) return <div className="container"><p>Se încarcă finalizarea comenzii...</p></div>;

  return (
    <div className="container checkout-page">
      <button type="button" className="back-link" onClick={() => router.back()}>Înapoi la coș</button>
      <h1>Finalizare comandă</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "4px 10px" }}>Plată securizată Stripe</span>
        <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "4px 10px" }}>Date protejate GDPR</span>
        <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "4px 10px" }}>Suport rapid</span>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {hasBlockingErrors && (
        <div style={{ border: "1px solid #f1c40f", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <strong>Există probleme în coș:</strong>
          <ul style={{ marginTop: 8 }}>
            {validateErrors.map((e, idx) => <li key={`${e.code}-${e.productId}-${idx}`}>{e.message} ({e.code})</li>)}
          </ul>
          <p style={{ marginTop: 8 }}>Te rugăm să revii în coș și să rezolvi problemele înainte de confirmarea comenzii.</p>
          <button className="btn" type="button" onClick={() => router.push("/cart")}>Înapoi la coș</button>
        </div>
      )}

      {summary && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gap: 6, maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal produse</span><strong>{(subtotalCents / 100).toFixed(2)} RON</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Livrare</span><strong>{shippingCents === 0 ? "Gratuită" : `${(shippingCents / 100).toFixed(2)} RON`}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, marginTop: 6 }}><span>Total</span><strong>{(grandTotalCents / 100).toFixed(2)} RON</strong></div>
          </div>
        </div>
      )}

      <form className="checkout-form" onSubmit={submitOrder}>
        <h3 style={{ margin: "8px 0 0" }}>Date de livrare</h3>
        <label>Nume complet<input name="name" value={form.name} onChange={updateField} required /></label>
        <label>Telefon<input name="phone" value={form.phone} onChange={updateField} placeholder="07xxxxxxxx" inputMode="tel" required /></label>
        <label>Județ<select name="county" value={form.county} onChange={updateField} required><option value="">Alege județul</option>{COUNTIES_RO.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
        <label>Oraș<input name="city" value={form.city} onChange={updateField} required /></label>
        <label>Adresă de livrare<textarea name="address" value={form.address} onChange={updateField} required /></label>
        <label>Cod poștal (opțional)<input name="postalCode" value={form.postalCode} onChange={updateField} /></label>

        <h3 style={{ margin: "10px 0 0" }}>Metodă de plată</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}><input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />Ramburs la livrare</label>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}><input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />Plată online cu cardul (Stripe)</label>
        </div>

        <label className="auth-inline-check" style={{ marginTop: 8 }}>
          <input type="checkbox" checked={acceptedLegal} onChange={(e) => setAcceptedLegal(e.target.checked)} required />
          <span>Am citit și sunt de acord cu <Link href="/termeni-si-conditii">Termenii și Condițiile</Link> și cu <Link href="/politica-confidentialitate">Politica de confidențialitate</Link>.</span>
        </label>

        <button className="btn full" disabled={disableSubmit}>
          {submitting ? "Se plasează comanda..." : hasBlockingErrors ? "Rezolvă problemele din coș" : stockErrorProductId ? "Actualizează coșul" : "Confirmă comanda"}
        </button>
        {disableSubmit && !submitting && submitBlocker ? <p style={{ marginTop: 8, color: "#8a5a4f" }}>{submitBlocker}</p> : null}
      </form>
    </div>
  );
}
