export function formatEuro(cents) {
  return (cents / 100).toFixed(2);
}

export function cartTotalCents(items, products) {
  // items: [{id, qty}]
  const map = new Map(products.map(p => [p.id, p]));
  return items.reduce((sum, item) => {
    const p = map.get(item.id);
    if (!p) return sum;
    const qty = Math.max(0, Number(item.qty || 0));
    return sum + p.priceCents * qty;
  }, 0);
}