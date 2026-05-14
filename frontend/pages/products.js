import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { fetchProducts } from "../lib/api";
import { useCart } from "../lib/cart";

import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import EmptyState from "../components/EmptyState";

export default function ProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const query = String(router.query?.q || "").trim();

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const products = await fetchProducts();
        if (active) setItems(Array.isArray(products) ? products : []);
      } catch (err) {
        console.error("Failed to load products:", err);
        if (active) setError("Nu s-au putut incarca produsele.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const breadcrumbs = [
    { label: "Acasa", href: "/" },
    { label: "Produse" }
  ];

  const visibleItems = items.filter((product) => {
    if (!query) return true;
    const haystack = [product?.name, product?.description, product?.category, product?.slug]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <>
      <Head>
        <title>{query ? `Cautare: ${query} - Party Shop` : "Toate produsele - Party Shop"}</title>
        <meta
          name="description"
          content="Descopera toate produsele disponibile in magazinul nostru: baloane, decoruri si articole festive."
        />
      </Head>

      <main className="container">
        <section style={{ marginBottom: 32 }}>
          <Breadcrumb items={breadcrumbs} />
          <h1>{query ? `Rezultate pentru "${query}"` : "Toate produsele"}</h1>
          <p style={{ maxWidth: 640 }}>
            Catalog complet de produse disponibile pentru petreceri si evenimente speciale.
          </p>
        </section>

        {loading && <p>Se incarca produsele...</p>}

        {!loading && error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && visibleItems.length === 0 && (
          <EmptyState
            title={query ? "Nu am gasit produse" : "Nu exista produse"}
            message={
              query
                ? "Incearca un termen mai simplu sau vezi catalogul complet."
                : "Momentan nu sunt produse disponibile."
            }
            actionLabel={query ? "Vezi toate produsele" : "Vezi categoriile"}
            actionHref={query ? "/products" : "/"}
          />
        )}

        {!loading && !error && visibleItems.length > 0 && (
          <div className="products-grid">
            {visibleItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
