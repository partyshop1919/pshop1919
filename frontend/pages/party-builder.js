import Head from "next/head";
import { useMemo, useState } from "react";
import Link from "next/link";

import { buildPartyPlan } from "../lib/api";
import { useCart } from "../lib/cart";

export default function PartyBuilderPage() {
  const { items: cartItems, addToCart, updateQty } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({
    eventType: "adult-birthday",
    guests: 20,
    budgetTier: "medium",
    location: "indoor"
  });

  const totalRON = useMemo(() => {
    const cents = Number(plan?.totalCents || 0);
    return (cents / 100).toFixed(2);
  }, [plan?.totalCents]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "guests" ? Number(value) || 5 : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = await buildPartyPlan(form);
    setLoading(false);
    if (!data) {
      setError("Nu am putut genera planul. Incearca din nou.");
      return;
    }
    setPlan(data);
  }

  function addPlanToCart() {
    const entries = Array.isArray(plan?.items) ? plan.items : [];
    if (!entries.length) return;

    const currentById = new Map((cartItems || []).map((x) => [String(x.id), Number(x.quantity) || 0]));

    for (const it of entries) {
      const id = String(it?.id || "");
      const qty = Math.max(1, Number(it?.quantity) || 1);
      if (!id) continue;

      const existing = currentById.get(id) || 0;
      if (existing > 0) {
        updateQty(id, existing + qty);
        currentById.set(id, existing + qty);
      } else {
        addToCart({ id });
        updateQty(id, qty);
        currentById.set(id, qty);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Party Builder - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Party Builder</h1>
        <p>Configureaza rapid o petrecere si primesti un cos recomandat cu cantitati.</p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
          <label>
            Tip eveniment
            <select name="eventType" value={form.eventType} onChange={onChange}>
              <option value="adult-birthday">Zi de nastere adult</option>
              <option value="child-birthday">Zi de nastere copil</option>
              <option value="baby-shower">Baby shower</option>
              <option value="gender-reveal">Gender reveal</option>
            </select>
          </label>

          <label>
            Numar invitati
            <input
              name="guests"
              type="number"
              min="5"
              max="200"
              value={form.guests}
              onChange={onChange}
            />
          </label>

          <label>
            Buget
            <select name="budgetTier" value={form.budgetTier} onChange={onChange}>
              <option value="low">Mic</option>
              <option value="medium">Mediu</option>
              <option value="high">Ridicat</option>
            </select>
          </label>

          <label>
            Locatie
            <select name="location" value={form.location} onChange={onChange}>
              <option value="indoor">Interior</option>
              <option value="outdoor">Exterior</option>
            </select>
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Generez..." : "Genereaza plan"}
          </button>
        </form>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

        {plan && (
          <section style={{ marginTop: 24 }}>
            <h2>Plan recomandat</h2>
            {!!plan?.notes?.length && (
              <ul>
                {plan.notes.map((n, idx) => (
                  <li key={idx}>{n}</li>
                ))}
              </ul>
            )}

            {!plan.items?.length ? (
              <p>Nu exista produse potrivite momentan.</p>
            ) : (
              <>
                <div style={{ display: "grid", gap: 10 }}>
                  {plan.items.map((it) => (
                    <div
                      key={it.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: 10
                      }}
                    >
                      <div>
                        <strong>{it.name}</strong>
                        <div style={{ opacity: 0.8 }}>{it.category}</div>
                        <div>Cantitate: {it.quantity}</div>
                      </div>
                      <div>{((Number(it.lineTotalCents) || 0) / 100).toFixed(2)} RON</div>
                    </div>
                  ))}
                </div>

                <p style={{ marginTop: 12 }}>
                  <strong>Total estimat: {totalRON} RON</strong>
                </p>

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn" type="button" onClick={addPlanToCart}>
                    Adauga planul in cos
                  </button>
                  <Link className="btn" href="/cart">
                    Vezi cosul
                  </Link>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </>
  );
}
