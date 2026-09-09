function normalize(value) {
  return String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-_]/g, " ").replace(/\s+/g, " ");
}

const categoryAliases = new Map(Object.entries({
  "Latex Balloons": ["Baloane latex"],
  "Foil Balloons": ["Baloane folie"],
  "Garlands": ["Ghirlande"],
  "Confetti": [],
  "Banners": ["Bannere"],
  "Party Hats & Accessories": ["Coifuri și accesorii"],
  "Cups & Plates": ["Pahare și farfurii"]
}).flatMap(([canonical, aliases]) => [canonical, ...aliases].map(alias => [normalize(alias), canonical])));

export function normalizePartyCategory(category) {
  return categoryAliases.get(normalize(category)) || null;
}

export function buildPartyPlan(catalog, options = {}) {
  const eventType = ["adult-birthday", "child-birthday", "baby-shower", "gender-reveal"].includes(options.eventType) ? options.eventType : "adult-birthday";
  const budgetTier = ["low", "medium", "high"].includes(options.budgetTier) ? options.budgetTier : "medium";
  const location = options.location === "outdoor" ? "outdoor" : "indoor";
  const value = Number(options.guests ?? 20);
  const guests = Number.isFinite(value) ? Math.max(5, Math.min(200, Math.floor(value))) : 20;
  const products = catalog.filter(p => !p.deletedAt && p.stock > 0 && normalizePartyCategory(p.category));
  if (!products.length) {
    return {
      eventType,
      guests,
      budgetTier,
      location,
      notes: ["Nu am găsit produse disponibile potrivite pentru această configurație."],
      items: [],
      totalCents: 0
    };
  }

  const byCategory = new Map();
  for (const p of products) {
    const key = normalizePartyCategory(p.category);
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(p);
  }

  function pickOne(category) {
    const arr = [...(byCategory.get(category) || [])];
    if (budgetTier === "low") arr.sort((a, b) => a.priceCents - b.priceCents);
    return arr[0] || null;
  }

  const basePlan = [];
  const decorMultiplier = budgetTier === "high" ? 1.5 : 1;
  const balloonQty = Math.max(15, Math.ceil(guests * decorMultiplier * (location === "outdoor" ? 1.8 : 1.5)));
  const bannerQty = (guests > 20 ? 2 : 1) + (budgetTier === "high" ? 1 : 0);
  const confettiQty = (guests > 25 ? 3 : 1) + (budgetTier === "high" ? 1 : 0);
  const cupsQty = Math.max(1, Math.ceil(guests / 8));
  const hatsQty = Math.max(1, Math.ceil(guests / 10));

  const latex = pickOne("Latex Balloons");
  if (latex) basePlan.push({ product: latex, quantity: balloonQty });

  const foil = pickOne("Foil Balloons");
  if (foil && budgetTier !== "low") basePlan.push({ product: foil, quantity: Math.max(1, Math.ceil(guests / 12)) });

  const garland = pickOne("Garlands");
  if (garland) basePlan.push({ product: garland, quantity: guests > 30 ? 2 : 1 });

  const confetti = pickOne("Confetti");
  if (confetti) basePlan.push({ product: confetti, quantity: confettiQty });

  const banner = pickOne("Banners");
  if (banner) basePlan.push({ product: banner, quantity: bannerQty });

  if (eventType === "child-birthday") {
    const hats = pickOne("Party Hats & Accessories");
    if (hats) basePlan.push({ product: hats, quantity: hatsQty });
  }

  if (eventType === "child-birthday" || eventType === "baby-shower" || eventType === "gender-reveal") {
    const table = pickOne("Cups & Plates");
    if (table) basePlan.push({ product: table, quantity: cupsQty });
  }

  // Avoid zero/negative quantities and clamp by stock.
  const items = basePlan
    .map(({ product, quantity }) => {
      const qty = Math.max(1, Math.min(Number(product.stock) || 1, Number(quantity) || 1));
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        slug: product.slug,
        image: product.image,
        category: product.category,
        priceCents: product.priceCents,
        quantity: qty,
        lineTotalCents: qty * (Number(product.priceCents) || 0)
      };
    })
    .filter((x) => x.quantity > 0);

  const totalCents = items.reduce((sum, it) => sum + (Number(it.lineTotalCents) || 0), 0);

  const notes = [];
  if (basePlan.some(({ product, quantity }) => product.stock < quantity)) notes.push("Unele cantități au fost reduse la stocul disponibil.");
  if (budgetTier === "high") notes.push("Am inclus mai multe decorațiuni pentru bugetul mare.");
  if (guests > 20) notes.push("Am inclus decorațiuni suplimentare pentru grupuri mai mari.");
  if (budgetTier === "low") notes.push("Planul prioritizează produsele cu preț redus.");
  if (location === "outdoor") notes.push("Pentru exterior, recomandăm mai multe baloane.");

  return {
    eventType,
    guests,
    budgetTier,
    location,
    notes,
    items,
    totalCents
  };
}
