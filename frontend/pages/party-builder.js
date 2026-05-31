import Head from "next/head";
import { useMemo, useState } from "react";
import Link from "next/link";

import { BACKEND_URL, buildPartyPlan, fetchProducts } from "../lib/api";
import { useCart } from "../lib/cart";

export default function PartyBuilderPage() {
  const { items: cartItems, addToCart, updateQty } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [customItems, setCustomItems] = useState([]);
  const [removedItemIds, setRemovedItemIds] = useState([]);
  const [quantityOverrides, setQuantityOverrides] = useState({});
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({
    eventType: "adult-birthday",
    guests: 20,
    budgetTier: "medium",
    location: "indoor"
  });

  const mergedItems = useMemo(() => {
    const baseItems = Array.isArray(plan?.items) ? plan.items : [];
    const removed = new Set(removedItemIds.map(String));
    const map = new Map();

    for (const it of baseItems) {
      const id = String(it.id);
      if (!removed.has(id)) map.set(id, { ...it });
    }

    for (const extra of customItems) {
      const id = String(extra.id);
      if (removed.has(id)) continue;
      const existing = map.get(id);
      if (existing) {
        const qty = (Number(existing.quantity) || 0) + (Number(extra.quantity) || 1);
        map.set(id, { ...existing, quantity: qty, lineTotalCents: qty * (Number(existing.priceCents) || 0) });
      } else {
        map.set(id, {
          id,
          name: extra.name,
          slug: extra.slug,
          image: extra.image,
          category: extra.category,
          priceCents: Number(extra.priceCents) || 0,
          quantity: Number(extra.quantity) || 1,
          lineTotalCents: (Number(extra.priceCents) || 0) * (Number(extra.quantity) || 1)
        });
      }
    }

    return Array.from(map.values()).map((it) => {
      const id = String(it.id);
      const overrideQty = Number(quantityOverrides[id]);
      const qty = Number.isFinite(overrideQty) && overrideQty > 0 ? Math.floor(overrideQty) : Math.max(1, Number(it.quantity) || 1);
      return { ...it, quantity: qty, lineTotalCents: qty * (Number(it.priceCents) || 0) };
    });
  }, [plan?.items, customItems, quantityOverrides, removedItemIds]);

  const totalRON = useMemo(() => ((mergedItems.reduce((sum, it) => sum + (Number(it.lineTotalCents) || 0), 0)) / 100).toFixed(2), [mergedItems]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "guests" ? Number(value) || 5 : value }));
  }

  function resolveImage(src) {
    const raw = String(src || "").trim();
    if (!raw) return "/images/products/baloane.jpg";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("/uploads/")) return `${BACKEND_URL}${raw}`;
    return raw;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = await buildPartyPlan(form);
    setLoading(false);
    if (!data) {
      setError("We could not generate the party plan. Please try again.");
      return;
    }
    setPlan(data);
    setCustomItems([]);
    setRemovedItemIds([]);
    setQuantityOverrides({});
  }

  function addPlanToCart() {
    const currentById = new Map((cartItems || []).map((x) => [String(x.id), Number(x.quantity) || 0]));
    for (const it of mergedItems) {
      const id = String(it?.id || "");
      const qty = Math.max(1, Number(it?.quantity) || 1);
      if (!id) continue;
      const existing = currentById.get(id) || 0;
      if (existing > 0) {
        updateQty(id, existing + qty);
      } else {
        addToCart({ id });
        updateQty(id, qty);
      }
    }
  }

  async function openCatalog() {
    setCatalogOpen(true);
    if (catalog.length > 0) return;
    setCatalogLoading(true);
    const list = await fetchProducts();
    setCatalogLoading(false);
    setCatalog(Array.isArray(list) ? list : []);
  }

  function addProductToPlan(product) {
    const id = String(product?.id || "");
    if (!id) return;
    setRemovedItemIds((prev) => prev.filter((x) => String(x) !== id));
    setCustomItems((prev) => {
      const next = [...prev];
      const i = next.findIndex((x) => String(x.id) === id);
      if (i >= 0) {
        next[i] = { ...next[i], quantity: (Number(next[i].quantity) || 1) + 1 };
        return next;
      }
      return [...next, { id, name: String(product.name || "Product"), slug: String(product.slug || ""), image: String(product.image || ""), category: String(product.category || "uncategorized"), priceCents: Number(product.priceCents) || 0, quantity: 1 }];
    });
  }

  function changeItemQuantity(item, delta) {
    const id = String(item?.id || "");
    if (!id) return;
    const currentQty = Math.max(1, Number(item?.quantity) || 1);
    if (Number(delta || 0) < 0 && currentQty <= 1) {
      setRemovedItemIds((prev) => (prev.map(String).includes(id) ? prev : [...prev, id]));
      setCustomItems((prev) => prev.filter((x) => String(x.id) !== id));
      setQuantityOverrides((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    setQuantityOverrides((prev) => ({ ...prev, [id]: Math.max(1, currentQty + Number(delta || 0)) }));
  }

  return (
    <>
      <Head>
        <title>Party Builder - Party Shop</title>
      </Head>
      <main className="container party-builder-page">
        <section className="party-builder-hero">
          <h1>Party Builder</h1>
          <p>Configure your event and receive a recommended list of products and quantities.</p>
          <div className="party-builder-badges">
            <span>Smart recommendations</span>
            <span>Automatic quantity planning</span>
            <span>Fast cart setup</span>
          </div>
        </section>

        <form onSubmit={onSubmit} className="party-builder-form">
          <label>
            Event type
            <select name="eventType" value={form.eventType} onChange={onChange}>
              <option value="adult-birthday">Adult birthday</option>
              <option value="child-birthday">Children&apos;s birthday</option>
              <option value="baby-shower">Baby shower</option>
              <option value="gender-reveal">Gender reveal</option>
            </select>
          </label>

          <label>
            Number of guests
            <input name="guests" type="number" min="5" max="200" value={form.guests} onChange={onChange} />
          </label>

          <label>
            Budget
            <select name="budgetTier" value={form.budgetTier} onChange={onChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label>
            Venue
            <select name="location" value={form.location} onChange={onChange}>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate plan"}
          </button>
        </form>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

        {plan && (
          <section className="party-builder-result">
            <h2>Recommended plan</h2>
            {!!plan?.notes?.length && <ul className="party-builder-notes">{plan.notes.map((n, idx) => <li key={idx}>{n}</li>)}</ul>}

            {!mergedItems.length ? (
              <p>No suitable products are currently available.</p>
            ) : (
              <>
                <div className="party-builder-items">
                  {mergedItems.map((it) => (
                    <article key={it.id} className="party-builder-item">
                      <img src={resolveImage(it.image)} alt={it.name} className="party-builder-item-image" />
                      <div className="party-builder-item-main">
                        <strong>{it.name}</strong>
                        <div className="party-builder-item-category">{it.category}</div>
                        <div className="party-builder-item-qty">
                          Quantity:
                          <button type="button" className="pb-qty-btn" onClick={() => changeItemQuantity(it, -1)} aria-label={`Decrease quantity for ${it.name}`}>-</button>
                          <strong>{it.quantity}</strong>
                          <button type="button" className="pb-qty-btn" onClick={() => changeItemQuantity(it, 1)} aria-label={`Increase quantity for ${it.name}`}>+</button>
                        </div>
                      </div>
                      <div className="party-builder-item-price">{((Number(it.lineTotalCents) || 0) / 100).toFixed(2)} RON</div>
                    </article>
                  ))}
                </div>

                <p className="party-builder-total"><strong>Estimated total: {totalRON} RON</strong></p>

                <div className="party-builder-actions">
                  <button className="btn" type="button" onClick={addPlanToCart}>Add plan to cart</button>
                  <button className="btn secondary" type="button" onClick={openCatalog}>Add more products</button>
                  <button className="btn secondary full" type="button" onClick={() => { if (window.confirm("Would you like to clear the generated plan?")) setPlan(null); }} style={{ marginTop: 10 }}>
                    Clear plan
                  </button>
                  <Link className="btn" href="/cart">View cart</Link>
                </div>
              </>
            )}
          </section>
        )}

        {catalogOpen && (
          <div className="pb-modal-overlay" onClick={() => setCatalogOpen(false)}>
            <div className="pb-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pb-modal-head">
                <h3>Add products to the plan</h3>
                <button type="button" className="btn secondary" onClick={() => setCatalogOpen(false)}>Close</button>
              </div>

              {catalogLoading ? (
                <p>Loading products...</p>
              ) : (
                <div className="pb-modal-grid">
                  {catalog.map((p) => (
                    <article key={p.id} className="pb-modal-card">
                      <img src={resolveImage(p.image)} alt={p.name} />
                      <h4>{p.name}</h4>
                      <p>{(Number(p.priceCents || 0) / 100).toFixed(2)} RON</p>
                      <button type="button" className="btn" onClick={() => addProductToPlan(p)}>Add</button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
