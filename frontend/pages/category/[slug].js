import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

import ProductCard from "../../components/ProductCard";
import { fetchProducts } from "../../lib/api";
import { categories } from "../../lib/categories";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* =====================
     FIND CATEGORY LABEL (optional UI)
     (din lib/categories, ca să afișezi numele frumos)
  ===================== */
  const category = useMemo(() => {
    if (!slug) return null;

    for (const cat of categories) {
      if (cat.slug === slug) return cat;

      if (Array.isArray(cat.children)) {
        const sub = cat.children.find((c) => c.slug === slug);
        if (sub) return sub;
      }
    }

    return null;
  }, [slug]);

  /* =====================
     LOAD PRODUCTS FROM BACKEND
     folosește exact API-ul tău existent:
     GET /products?category=...
  ===================== */
  useEffect(() => {
  if (!router.isReady) return;

  let active = true;

  (async () => {
    setLoading(true);
    setNotFound(false);

    try {
      // IMPORTANT: backend pare să filtreze după "category" = NAME, nu slug
      if (!category) {
        // fallback: încercăm direct cu slug
        const list = await fetchProducts({ category: String(slug) });
        if (!active) return;

        setItems(Array.isArray(list) ? list : []);
        if (!list || list.length === 0) setNotFound(true);
        return;
      }

      // Dacă e părinte cu children -> agregăm produse din părinte + copii
      const categoryNames = [
        category.name,
        ...(Array.isArray(category.children)
          ? category.children.map((c) => c.name)
          : [])
      ].filter(Boolean);

      const results = await Promise.all(
        categoryNames.map((name) => fetchProducts({ category: name }))
      );

      if (!active) return;

      // merge + uniq by id
      const map = new Map();
      for (const arr of results) {
        if (!Array.isArray(arr)) continue;
        for (const p of arr) {
          const id = p?.id != null ? String(p.id) : null;
          if (!id) continue;
          if (!map.has(id)) map.set(id, p);
        }
      }

      const merged = Array.from(map.values());
      setItems(merged);

      // dacă nu găsim nimic nici după nume, atunci notFound/empty
      // (poți alege să nu fie "notFound", ci doar empty state)
      if (merged.length === 0) {
        setNotFound(false); // categorie există, doar nu are produse
      }
    } catch {
      if (!active) return;
      setNotFound(true);
      setItems([]);
    } finally {
      if (active) setLoading(false);
    }
  })();

  return () => {
    active = false;
  };
}, [router.isReady, slug, category]);

  const title = useMemo(() => {
    const name = category?.name || (slug ? String(slug) : "Category");
    return `${name} – Party Shop`;
  }, [category?.name, slug]);

  if (!router.isReady || loading) {
    return (
      <div className="container">
        <p>Se încarcă categoria…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: 24 }}>
        <h1>Categorie inexistentă</h1>
        <p>Nu am găsit categoria.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Produse din categoria ${category?.name || String(slug)}.`}
        />
      </Head>

      <div className="container" style={{ paddingTop: 24 }}>
        <button className="back-link" onClick={() => router.back()}>
          ← Înapoi
        </button>

        <h1 style={{ marginTop: 12 }}>
          {category?.name || String(slug)}
        </h1>

        {items.length === 0 ? (
          <p>Nu există produse în această categorie.</p>
        ) : (
          <div className="products-grid">
            {items.map((p) => (
              <ProductCard
                key={String(p.id)}
                product={{ ...p, id: String(p.id) }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}