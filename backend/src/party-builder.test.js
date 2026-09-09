import test from "node:test";
import assert from "node:assert/strict";
import { buildPartyPlan, normalizePartyCategory } from "./party-builder.js";

const categories = ["Baloane latex", "Baloane folie", "Ghirlande", "Confetti", "Bannere", "Coifuri și accesorii", "Pahare și farfurii"];
const catalog = categories.map((category, index) => ({
  id: String(index), name: category, category, priceCents: 300 + index * 100, stock: 1000
}));
const quantity = (plan, category) => plan.items.find(item => item.category === category)?.quantity;

test("Romanian catalog produces full plans for every event and budget", () => {
  for (const eventType of ["adult-birthday", "child-birthday", "baby-shower", "gender-reveal"]) {
    for (const budgetTier of ["low", "medium", "high"]) {
      const plan = buildPartyPlan(catalog, { eventType, budgetTier, guests: 20 });
      assert.ok(plan.items.length >= 4, `${eventType}/${budgetTier}`);
      assert.ok(quantity(plan, "Baloane latex"));
      assert.equal(Boolean(quantity(plan, "Baloane folie")), budgetTier !== "low");
      assert.equal(Boolean(quantity(plan, "Coifuri și accesorii")), eventType === "child-birthday");
      assert.equal(Boolean(quantity(plan, "Pahare și farfurii")), eventType !== "adult-birthday");
      assert.equal(plan.totalCents, plan.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0));
    }
  }
});

test("guest count, location and large budget change quantities", () => {
  const standard = buildPartyPlan(catalog, { guests: 20 });
  for (const options of [{ guests: 40 }, { guests: 20, location: "outdoor" }, { guests: 20, budgetTier: "high" }]) {
    const plan = buildPartyPlan(catalog, options);
    assert.ok(quantity(plan, "Baloane latex") > quantity(standard, "Baloane latex"));
    assert.ok(plan.totalCents > standard.totalCents);
  }
});

test("legacy English, Romanian diacritics and category slugs are supported", () => {
  assert.equal(normalizePartyCategory("  COIFURI SI ACCESORII "), "Party Hats & Accessories");
  assert.equal(normalizePartyCategory("pahare-si-farfurii"), "Cups & Plates");
  const english = ["Latex Balloons", "Foil Balloons", "Garlands", "Confetti", "Banners", "Party Hats & Accessories", "Cups & Plates"];
  const plan = buildPartyPlan(catalog.map((p, i) => ({ ...p, category: english[i] })), { eventType: "child-birthday" });
  assert.equal(plan.items.length, 7);
});

test("stock limits and unavailable or unrelated products are respected", () => {
  const plan = buildPartyPlan([
    { ...catalog[0], stock: 2 },
    { ...catalog[1], stock: 0 },
    { ...catalog[2], deletedAt: new Date() },
    { ...catalog[3], category: "Accesorii pentru baloane" }
  ]);
  assert.equal(plan.items.length, 1);
  assert.equal(plan.items[0].quantity, 2);
  const empty = buildPartyPlan([]);
  assert.deepEqual(empty.items, []);
  assert.equal(empty.totalCents, 0);
  assert.ok(empty.notes.length);
});

test("small budget chooses the cheaper product even if a premium one is featured", () => {
  const plan = buildPartyPlan([{ ...catalog[0], id: "premium", priceCents: 900 }, ...catalog], { budgetTier: "low" });
  assert.equal(plan.items.find(item => item.category === "Baloane latex").id, "0");
});
