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

  useEffect(() => {
    if (!router.isReady) return;
    let active = true;
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        if (!category) {
          const list = await fetchProducts({ category: String(slug) });
          if (!active) return;
          setItems(Array.isArray(list) ? list : []);
          if (!list || list.length === 0) setNotFound(true);
          return;
        }

        const categoryNames = [category.name, ...(Array.isArray(category.children) ? category.children.map((c) => c.name) : [])].filter(Boolean);
        const results = await Promise.all(categoryNames.map((name) => fetchProducts({ category: name })));
        if (!active) return;

        const map = new Map();
        for (const arr of results) {
          if (!Array.isArray(arr)) continue;
          for (const p of arr) {
            const id = p?.id != null ? String(p.id) : null;
            if (id && !map.has(id)) map.set(id, p);
          }
        }
        setItems(Array.from(map.values()));
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

  const title = `${category?.name || (slug ? String(slug) : "Category")} - Party Shop`;

  if (!router.isReady || loading) return <div className="container"><p>Loading category...</p></div>;
  if (notFound) return <div className="container" style={{ paddingTop: 24 }}><h1>Category not found</h1><p>We could not find the requested category.</p></div>;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`Products from the ${category?.name || String(slug)} category.`} />
      </Head>

      <div className="container" style={{ paddingTop: 24 }}>
        <button className="back-link" onClick={() => router.back()}>Back</button>
        <h1 style={{ marginTop: 12 }}>{category?.name || String(slug)}</h1>
        {items.length === 0 ? (
          <p>No products are currently available in this category.</p>
        ) : (
          <div className="products-grid">
            {items.map((p) => <ProductCard key={String(p.id)} product={{ ...p, id: String(p.id) }} />)}
          </div>
        )}
      </div>
    </>
  );
}
