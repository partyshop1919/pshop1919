import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "./auth";
import { getMyFavorites, addFavorite as apiAdd, removeFavorite as apiRemove } from "./api";

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { token, isLoggedIn } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      if (!isLoggedIn || !token) {
        if (active) {
          setFavoriteIds([]);
          setFavoriteProducts([]);
          setLoading(false);
        }
        return;
      }

      const items = await getMyFavorites();
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

  const isFavorite = useCallback((productId) => {
    const id = productId != null ? String(productId) : "";
    return Boolean(id) && favoriteIds.includes(id);
  }, [favoriteIds]);

  const addFavorite = useCallback(async (product) => {
    const id = product?.id != null ? String(product.id) : "";
    if (!id) return;
    if (!isLoggedIn || !token) {
      alert("You need to be signed in to add favorites.");
      return;
    }

    setFavoriteIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
    setFavoriteProducts((prev) => (prev.some((p) => String(p.id) === id) ? prev : [product, ...prev]));

    const ok = await apiAdd(id);
    if (!ok) {
      setFavoriteIds((prev) => prev.filter((x) => x !== id));
      setFavoriteProducts((prev) => prev.filter((p) => String(p.id) !== id));
    }
  }, [isLoggedIn, token]);

  const removeFavorite = useCallback(async (productId) => {
    const id = productId != null ? String(productId) : "";
    if (!id) return;
    if (!isLoggedIn || !token) {
      alert("You need to be signed in to manage favorites.");
      return;
    }

    const prevIds = favoriteIds;
    const prevProducts = favoriteProducts;
    setFavoriteIds((prev) => prev.filter((x) => x !== id));
    setFavoriteProducts((prev) => prev.filter((p) => String(p.id) !== id));

    const ok = await apiRemove(id);
    if (!ok) {
      setFavoriteIds(prevIds);
      setFavoriteProducts(prevProducts);
    }
  }, [isLoggedIn, token, favoriteIds, favoriteProducts]);

  const toggleFavorite = useCallback(async (product) => {
    const id = product?.id != null ? String(product.id) : "";
    if (!id) return;
    if (isFavorite(id)) return removeFavorite(id);
    return addFavorite(product);
  }, [addFavorite, removeFavorite, isFavorite]);

  const value = useMemo(() => ({
    loading,
    favoriteIds,
    favorites: favoriteProducts,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  }), [loading, favoriteIds, favoriteProducts, isFavorite, addFavorite, removeFavorite, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
