import { useContext } from "react";
import { FavoritesContext } from "../lib/favorites";
import ProductCard from "../components/ProductCard";

export default function FavoritesPage() {
  const { favorites, loading } = useContext(FavoritesContext);

  return (
    <div className="container">
      <h1>Favorite</h1>

      {loading ? (
        <p>Se încarcă favoritele…</p>
      ) : !favorites || favorites.length === 0 ? (
        <p>Nu ai produse favorite încă.</p>
      ) : (
        <div className="products-grid">
          {favorites.map((p) => (
            <ProductCard key={String(p.id)} product={{ ...p, id: String(p.id) }} />
          ))}
        </div>
      )}
    </div>
  );
}