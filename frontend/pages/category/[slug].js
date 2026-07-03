import { useRouter } from "next/router";
import Head from "next/head";
import { useMemo } from "react";

import ProductCard from "../../components/ProductCard";
import CategoryCard from "../../components/CategoryCard";
import { categories } from "../../lib/categories";

const SSR_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.evamat.ro/api"
    : "http://localhost:4000/api");

export default function CategoryPage({ initialItems = [], initialNotFound = false, initialSlug = "" }) {
  const router = useRouter();
  const slug = String(router.query?.slug || initialSlug || "");

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
  const items = Array.isArray(initialItems) ? initialItems : [];
  const notFound = Boolean(initialNotFound);

  const title = `${category?.name || (slug ? String(slug) : "Category")} - Evamat`;
  const subcategories = Array.isArray(category?.children) ? category.children : [];

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

        {category?.intro && <p className="category-page-intro">{category.intro}</p>}

        {subcategories.length > 0 && (
          <section className="category-subcategories">
            <h2>Subcategories</h2>
            <div className="categories-grid">
              {subcategories.map((sub) => (
                <CategoryCard key={sub.id} category={sub} />
              ))}
            </div>
          </section>
        )}

        <section className="category-products-section">
          <h2>{subcategories.length > 0 ? "Products in this category" : "Products"}</h2>
        {items.length === 0 ? (
          <p>No products are currently available in this category.</p>
        ) : (
          <div className="products-grid">
            {items.map((p) => <ProductCard key={String(p.id)} product={{ ...p, id: String(p.id) }} />)}
          </div>
        )}
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const slug = String(context.params?.slug || "").trim();

  function findCategoryBySlug(value) {
    for (const cat of categories) {
      if (cat.slug === value) return cat;
      if (Array.isArray(cat.children)) {
        const sub = cat.children.find((c) => c.slug === value);
        if (sub) return sub;
      }
    }
    return null;
  }

  async function fetchCategoryProducts(categoryName) {
    const url = `${SSR_API_URL}/products?category=${encodeURIComponent(String(categoryName || "").trim())}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data?.items) ? data.items : [];
  }

  try {
    const category = findCategoryBySlug(slug);

    if (!category) {
      const list = await fetchCategoryProducts(slug);
      return {
        props: {
          initialItems: list,
          initialNotFound: list.length === 0,
          initialSlug: slug
        }
      };
    }

    const categoryNames = [category.name, ...(Array.isArray(category.children) ? category.children.map((c) => c.name) : [])].filter(Boolean);
    const results = await Promise.all(categoryNames.map((name) => fetchCategoryProducts(name)));

    const map = new Map();
    for (const arr of results) {
      if (!Array.isArray(arr)) continue;
      for (const p of arr) {
        const id = p?.id != null ? String(p.id) : null;
        if (id && !map.has(id)) map.set(id, p);
      }
    }

    return {
      props: {
        initialItems: Array.from(map.values()),
        initialNotFound: false,
        initialSlug: slug
      }
    };
  } catch {
    return {
      props: {
        initialItems: [],
        initialNotFound: true,
        initialSlug: slug
      }
    };
  }
}
