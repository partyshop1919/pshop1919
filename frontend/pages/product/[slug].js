import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useMemo, useState, useContext } from "react";

import { fetchProductBySlug, BACKEND_URL } from "../../lib/api";
import { useCart } from "../../lib/cart";
import { FavoritesContext } from "../../lib/favorites";

function resolveImage(image) {
  if (!image) return null;
  if (typeof image !== "string") return null;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/images")) return image;
  return `${BACKEND_URL}${image}`;
}

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    let active = true;

    (async () => {
      setLoading(true);
      try {
        const item = await fetchProductBySlug(String(slug));
        if (active) setProduct(item || null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [router.isReady, slug]);

  const productId = useMemo(() => (product?.id != null ? String(product.id) : null), [product?.id]);
  const fav = productId ? isFavorite(productId) : false;
  const imageUrl = useMemo(() => resolveImage(product?.image), [product?.image]);

  if (!router.isReady || loading) {
    return (
      <div className="container">
        <p>Se încarcă produsul…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <h1>Produs inexistent</h1>
        <p>Nu am găsit produsul.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} – Party Shop</title>
        <meta name="description" content={`Cumpără ${product.name} la Party Shop.`} />
      </Head>

      <div className="container" style={{ paddingTop: 24 }}>
        <button className="back-link" onClick={() => router.back()}>
          ← Înapoi
        </button>

        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "1fr 1fr",
            alignItems: "start"
          }}
        >
          <div>
            <div className="product-image" style={{ minHeight: 320 }}>
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} style={{ width: "100%", height: "auto" }} />
              ) : (
                <div className="image-placeholder" />
              )}
            </div>
          </div>

          <div>
            <h1 style={{ marginTop: 0 }}>{product.name}</h1>

            <p style={{ fontSize: 18 }}>
              <strong>{(product.priceCents / 100).toFixed(2)} RON</strong>
            </p>

            <p style={{ opacity: 0.8 }}>
              Stoc: <strong>{product.stock}</strong>
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                className="btn"
                type="button"
                onClick={() => addToCart({ ...product, id: String(product.id) })}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Stoc epuizat" : "Adaugă în coș"}
              </button>

              <button
                className="btn"
                type="button"
                onClick={() => {
                  const id = String(product.id);
                  fav ? removeFavorite(id) : addFavorite({ ...product, id });
                }}
              >
                {fav ? "💔 Scoate din favorite" : "🖤 Adaugă la favorite"}
              </button>
            </div>

            <hr style={{ margin: "20px 0" }} />

            <p style={{ opacity: 0.85 }}>
              Categorie: <strong>{product.category}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}