import { useEffect, useState, useContext } from "react";
import Link from "next/link";

import { categories } from "../lib/categories";
import { useAuth, useAdmin } from "../lib/auth";
import { useCart } from "../lib/cart";
import { FavoritesContext } from "../lib/favorites";
import { useFavorites } from "../lib/favorites";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isShrunk, setIsShrunk] = useState(false);

  const { user, isLoggedIn, logoutUser } = useAuth();
  const { isLoggedIn: isAdmin, logoutAdmin } = useAdmin();
  const { items } = useCart();

  const favCtx = useContext(FavoritesContext);
  const favoriteCount = favCtx?.favoriteIds?.length || 0;

  const cartCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    function handleScroll() {
      setIsShrunk(window.scrollY > 40);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  if (!mounted) return <nav className="navbar" />;

  return (
    <nav className={`navbar ${isShrunk ? "shrink" : ""}`}>
      <Link href="/" className="logo">
        Party Shop
      </Link>

      <div className="nav-categories" onMouseLeave={() => setActiveCategory(null)}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="nav-category-wrapper"
            onMouseEnter={() => setActiveCategory(cat)}
          >
            <span className="nav-category-label">{cat.name}</span>

            {activeCategory?.id === cat.id &&
              Array.isArray(cat.children) &&
              cat.children.length > 0 && (
                <div className="dropdown">
                  {cat.children.map((sub) => (
                    <Link key={sub.id} href={`/category/${sub.slug}`} className="dropdown-item">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="nav-right">
        <Link href="/favorites" className="cart-link">
          ❤️
          {favoriteCount > 0 && <span className="cart-badge">{favoriteCount}</span>}
        </Link>

        <Link href="/cart" className="cart-link">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {isLoggedIn ? (
          <>
            <span className="nav-user">{user?.email}</span>
            <Link href="/orders">My Orders</Link>
            <button type="button" onClick={logoutUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register" style={{ marginLeft: 10 }}>
              Register
            </Link>
          </>
        )}

        {isAdmin ? (
          <>
            <Link href="/admin/products">Admin</Link>
            <button type="button" onClick={logoutAdmin}>
              Logout Admin
            </button>
          </>
        ) : (
          <Link href="/admin/login">Admin Login</Link>
        )}
      </div>
    </nav>
  );
}
