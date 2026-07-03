import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useMemo, useState, useContext } from "react";
import Link from "next/link";

import { fetchProductBySlug, fetchProductRecommendations, BACKEND_URL } from "../../lib/api";
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
  const [reco, setReco] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const item = await fetchProductBySlug(String(slug));
        if (active) {
          setProduct(item || null);
          setActiveIndex(0);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router.isReady, slug]);

  useEffect(() => {
    if (!product?.id) return;
    let active = true;
    (async () => {
      const list = await fetchProductRecommendations(product.id);
      if (active) setReco(Array.isArray(list) ? list : []);
    })();
    return () => {
      active = false;
    };
  }, [product?.id]);

  const productId = useMemo(() => (product?.id != null ? String(product.id) : null), [product?.id]);
  const fav = productId ? isFavorite(productId) : false;
  const imageUrls = useMemo(() => {
    const list = Array.isArray(product?.images) ? product.images : [];
    const normalized = list.map(resolveImage).filter(Boolean);
    if (normalized.length > 0) return normalized.slice(0, 3);
    const fallback = resolveImage(product?.image);
    return fallback ? [fallback] : [];
  }, [product?.images, product?.image]);
  const mainImage = imageUrls[activeIndex] || imageUrls[0] || null;

  if (!router.isReady || loading) return <div className="container"><p>Loading product...</p></div>;
  if (!product) return <div className="container"><h1>Product not found</h1><p>We could not find the requested product.</p></div>;

  return (
    <>
      <Head>
        <title>{product.name} - Evamat</title>
        <meta name="description" content={`Discover ${product.name} at Evamat.`} />
      </Head>

      <div className="container" style={{ paddingTop: 24 }}>
        <button className="back-link" onClick={() => router.back()}>Back</button>

        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
          <div>
            <div className="product-image" style={{ minHeight: 320 }}>
              {mainImage ? <img src={mainImage} alt={product.name} style={{ width: "100%", height: "auto" }} /> : <div className="image-placeholder" />}
            </div>
            {imageUrls.length > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
                <button className="btn" type="button" onClick={() => setActiveIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)} aria-label="Previous image">Previous</button>
                <button className="btn" type="button" onClick={() => setActiveIndex((prev) => (prev + 1) % imageUrls.length)} aria-label="Next image">Next</button>
              </div>
            )}
          </div>

          <div>
            <h1 style={{ marginTop: 0 }}>{product.name}</h1>
            <p style={{ fontSize: 18 }}><strong>{(product.priceCents / 100).toFixed(2)} RON</strong></p>
            {product.description ? <p style={{ opacity: 0.9, lineHeight: 1.6, marginTop: 8 }}>{product.description}</p> : null}
            <p style={{ opacity: 0.8 }}>Availability: <strong>{product.stock}</strong> in stock</p>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn" type="button" onClick={() => addToCart({ ...product, id: String(product.id) })} disabled={product.stock <= 0}>
                {product.stock <= 0 ? "Out of stock" : "Add to cart"}
              </button>
              <button className="btn" type="button" onClick={() => {
                const id = String(product.id);
                fav ? removeFavorite(id) : addFavorite({ ...product, id });
              }}>
                {fav ? "Remove from favorites" : "Add to favorites"}
              </button>
            </div>

            <hr style={{ margin: "20px 0" }} />
            <p style={{ opacity: 0.85 }}>Category: <strong>{product.category}</strong></p>
          </div>
        </div>

        {reco.length > 0 && (
          <section style={{ marginTop: 32 }}>
            <h2>Recommended additions</h2>
            <div className="products-grid">
              {reco.map((it) => {
                const img = resolveImage(Array.isArray(it.images) ? it.images[0] : it.image);
                return (
                  <div key={it.id} className="product-card">
                    <Link href={`/product/${it.slug}`} className="product-image" style={{ display: "block" }}>
                      {img ? <img src={img} alt={it.name} loading="lazy" /> : <div className="image-placeholder" />}
                    </Link>
                    <Link href={`/product/${it.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3>{it.name}</h3>
                    </Link>
                    <p>{((Number(it.priceCents) || 0) / 100).toFixed(2)} RON</p>
                    <button className="btn" type="button" onClick={() => addToCart({ ...it, id: String(it.id) })}>
                      Add to cart
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
