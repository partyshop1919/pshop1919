import { useEffect, useState } from "react";
import Head from "next/head";

import { fetchProducts } from "../lib/api";
import { useCart } from "../lib/cart";

import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import EmptyState from "../components/EmptyState";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const products = await fetchProducts();

        if (active) {
          setItems(Array.isArray(products) ? products : []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        if (active) {
          setError("Nu s-au putut încărca produsele.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const breadcrumbs = [
    { label: "Acasă", href: "/" },
    { label: "Produse" }
  ];

  return (
    <>
      {/* =====================
          SEO
      ===================== */}
      <Head>
        <title>Toate produsele – Party Shop</title>
        <meta
          name="description"
          content="Descoperă toate produsele disponibile în magazinul nostru: baloane, decoruri și articole festive."
        />
      </Head>

      <main className="container">
        {/* =====================
            HEADER
        ===================== */}
        <section style={{ marginBottom: 32 }}>
          <Breadcrumb items={breadcrumbs} />
          <h1>Toate produsele</h1>
          <p style={{ maxWidth: 640 }}>
            Catalog complet de produse disponibile pentru
            petreceri și evenimente speciale.
          </p>
        </section>

        {/* =====================
            CONTENT
        ===================== */}
        {loading && <p>Se încarcă produsele...</p>}

        {!loading && error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="Nu există produse"
            message="Momentan nu sunt produse disponibile."
            actionLabel="Vezi categoriile"
            actionHref="/"
          />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="products-grid">
            {items.map((product) => (
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
