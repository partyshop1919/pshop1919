import { useContext, useMemo, useCallback } from "react";
import Link from "next/link";
import { FavoritesContext } from "../lib/favorites";
import { useCart } from "../lib/cart";
import { BACKEND_URL } from "../lib/api";

function resolveImage(image) {
  if (!image) return null;

  if (typeof image === "string") {
    if (image.startsWith("http")) return image;
    if (image.startsWith("/images")) return image; // static frontend
    return `${BACKEND_URL}${image}`; // /uploads/...
  }

  if (typeof image === "object" && image.url) {
    return image.url.startsWith("http") ? image.url : `${BACKEND_URL}${image.url}`;
  }

  return null;
}

export default function ProductCard({ product }) {
  const { addFavorite, removeFavorite, isFavorite, loading } = useContext(FavoritesContext);
  const { addToCart } = useCart();

  const productId = useMemo(() => {
    const id = product?.id ?? product?._id ?? product?.uuid ?? null;
    return id != null ? String(id) : null;
  }, [product?.id, product?._id, product?.uuid]);

  const href = useMemo(() => {
    return product?.slug ? `/product/${product.slug}` : "#";
  }, [product?.slug]);

  const favorite = productId ? isFavorite(productId) : false;
  const imageUrl = useMemo(() => resolveImage(product?.image), [product?.image]);

  const onToggleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!productId) return;

      if (favorite) {
        removeFavorite(productId);
      } else {
        // trimitem produsul complet ca să apară instant în /favorites
        addFavorite({ ...product, id: productId });
      }
    },
    [productId, favorite, addFavorite, removeFavorite, product]
  );

  const onAddToCart = useCallback(() => {
    if (!productId) return;
    addToCart({ ...product, id: productId }); // forțăm id string
  }, [addToCart, product, productId]);

  return (
    <div className="product-card">
      {/* FAVORITE */}
      <button
        type="button"
        className={`fav-btn ${favorite ? "active" : ""}`}
        onClick={onToggleFavorite}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        disabled={Boolean(loading)}
      >
        🖤
      </button>

      {/* IMAGE + LINK */}
      <Link href={href} className="product-image" style={{ display: "block" }}>
        {imageUrl ? (
          <img src={imageUrl} alt={product?.name || "Product"} loading="lazy" />
        ) : (
          <div className="image-placeholder" />
        )}
      </Link>

      {/* TITLE + LINK */}
      <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
        <h3>{product?.name}</h3>
      </Link>

      <p>{((Number(product?.priceCents) || 0) / 100).toFixed(2)} RON</p>

      <button className="btn" type="button" onClick={onAddToCart} disabled={!productId}>
        Adaugă în coș
      </button>
    </div>
  );
}