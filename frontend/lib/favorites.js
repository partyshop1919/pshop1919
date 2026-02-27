import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { useAuth } from "./auth";
import { getMyFavorites, addFavorite as apiAdd, removeFavorite as apiRemove } from "./api";

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { token, isLoggedIn } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD FAVORITES
     (când se loghează / deloghează)
  ===================== */
  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      // dacă nu e logat -> reset
      if (!isLoggedIn || !token) {
        if (active) {
          setFavoriteIds([]);
          setFavoriteProducts([]);
          setLoading(false);
        }
        return;
      }

      const items = await getMyFavorites(); // token e luat din storage în api.js
      if (!active) return;

      setFavoriteProducts(items);
      setFavoriteIds(items.map((p) => String(p.id)));
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [isLoggedIn, token]);

  const isFavorite = useCallback(
    (productId) => {
      const id = productId != null ? String(productId) : "";
      if (!id) return false;
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  const addFavorite = useCallback(
    async (product) => {
      const id = product?.id != null ? String(product.id) : "";
      if (!id) return;

      if (!isLoggedIn || !token) {
        alert("Trebuie să fii logat ca să adaugi favorite.");
        return;
      }

      // optimistic
      setFavoriteIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
      setFavoriteProducts((prev) => {
        const exists = prev.some((p) => String(p.id) === id);
        return exists ? prev : [product, ...prev];
      });

      const ok = await apiAdd(id); // ✅ fără token param
      if (!ok) {
        // rollback
        setFavoriteIds((prev) => prev.filter((x) => x !== id));
        setFavoriteProducts((prev) => prev.filter((p) => String(p.id) !== id));
      }
    },
    [isLoggedIn, token]
  );

  const removeFavorite = useCallback(
    async (productId) => {
      const id = productId != null ? String(productId) : "";
      if (!id) return;

      if (!isLoggedIn || !token) {
        alert("Trebuie să fii logat ca să modifici favorite.");
        return;
      }

      const prevIds = favoriteIds;
      const prevProducts = favoriteProducts;

      // optimistic
      setFavoriteIds((prev) => prev.filter((x) => x !== id));
      setFavoriteProducts((prev) => prev.filter((p) => String(p.id) !== id));

      const ok = await apiRemove(id); // ✅ fără token param
      if (!ok) {
        setFavoriteIds(prevIds);
        setFavoriteProducts(prevProducts);
      }
    },
    [isLoggedIn, token, favoriteIds, favoriteProducts]
  );

  const toggleFavorite = useCallback(
    async (product) => {
      const id = product?.id != null ? String(product.id) : "";
      if (!id) return;
      if (isFavorite(id)) return removeFavorite(id);
      return addFavorite(product);
    },
    [addFavorite, removeFavorite, isFavorite]
  );

  const value = useMemo(
    () => ({
      loading,
      favoriteIds,
      favorites: favoriteProducts,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite
    }),
    [loading, favoriteIds, favoriteProducts, isFavorite, addFavorite, removeFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}