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
        if (active) setError("We could not load the products.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Products" }];

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
        <title>{query ? `Search: ${query} - Evamat` : "All Products - Evamat"}</title>
        <meta
          name="description"
          content="Discover all products available in our shop: balloons, decorations, and festive accessories."
        />
      </Head>

      <main className="container">
        <section style={{ marginBottom: 32 }}>
          <Breadcrumb items={breadcrumbs} />
          <h1>{query ? `Results for "${query}"` : "All products"}</h1>
          <p style={{ maxWidth: 640 }}>
            Browse our full catalog of products for parties and special events.
          </p>
        </section>

        {loading && <p>Loading products...</p>}

        {!loading && error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && visibleItems.length === 0 && (
          <EmptyState
            title={query ? "No products found" : "No products available"}
            message={
              query
                ? "Try a simpler search term or browse the full catalog."
                : "There are no products available right now."
            }
            actionLabel={query ? "View all products" : "Browse categories"}
            actionHref={query ? "/products" : "/"}
          />
        )}

        {!loading && !error && visibleItems.length > 0 && (
          <div className="products-grid">
            {visibleItems.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
