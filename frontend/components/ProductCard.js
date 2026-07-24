import { useContext, useMemo, useCallback } from "react";
import Link from "next/link";
import { FavoritesContext } from "../lib/favorites";
import { useCart } from "../lib/cart";
import { BACKEND_URL } from "../lib/api";

function resolveImage(image) {
  if (!image) return null;

  if (typeof image === "string") {
    if (image.startsWith("http")) return image;
    if (image.startsWith("/images")) return image;
    return `${BACKEND_URL}${image}`;
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
  const imageUrl = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return resolveImage(product.images[0]);
    }
    return resolveImage(product?.image);
  }, [product?.images, product?.image]);

  const onToggleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!productId) return;

      if (favorite) {
        removeFavorite(productId);
      } else {
        addFavorite({ ...product, id: productId });
      }
    },
    [productId, favorite, addFavorite, removeFavorite, product]
  );

  const onAddToCart = useCallback(() => {
    if (!productId) return;
    addToCart({ ...product, id: productId });
  }, [addToCart, product, productId]);

  return (
    <div className="product-card">
      <button
        type="button"
        className={`fav-btn ${favorite ? "active" : ""}`}
        onClick={onToggleFavorite}
        aria-label={favorite ? "Elimină din favorite" : "Adaugă la favorite"}
        disabled={Boolean(loading)}
      >
        <span className="fav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="fav-icon-svg">
            <path
              d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.1 4.42 2.75 7.5 2.75c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.35 5.5 5.5 0 3.84-3.4 6.99-8.55 11.76L12 21.35Z"
              className="fav-icon-shape"
            />
          </svg>
        </span>
      </button>

      <Link href={href} className="product-image" style={{ display: "block" }}>
        {imageUrl ? <img src={imageUrl} alt={product?.name || "Produs"} loading="lazy" /> : <div className="image-placeholder" />}
      </Link>

      <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
        <h3>{product?.name}</h3>
      </Link>
      {product?.description ? (
        <p className="product-desc">
          {String(product.description).slice(0, 110)}
          {String(product.description).length > 110 ? "..." : ""}
        </p>
      ) : null}

      <p>{((Number(product?.priceCents) || 0) / 100).toFixed(2)} RON</p>

      <button className="btn" type="button" onClick={onAddToCart} disabled={!productId}>
        Adaugă în coș
      </button>
    </div>
  );
}
