import { useContext } from "react";
import { FavoritesContext } from "../lib/favorites";
import ProductCard from "../components/ProductCard";

export default function FavoritesPage() {
  const { favorites, loading } = useContext(FavoritesContext);

  return (
    <div className="container">
      <h1>Favorites</h1>
      {loading ? (
        <p>Loading favorites...</p>
      ) : !favorites || favorites.length === 0 ? (
        <p>You do not have any favorite products yet.</p>
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
