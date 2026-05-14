import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { categories } from "../lib/categories";
import { useAdmin, useAuth } from "../lib/auth";
import { useCart } from "../lib/cart";
import { FavoritesContext } from "../lib/favorites";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isShrunk, setIsShrunk] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const closeTimerRef = useRef(null);

  const { isLoggedIn, logoutUser } = useAuth();
  const { isLoggedIn: isAdmin, logoutAdmin } = useAdmin();
  const { items } = useCart();

  const favCtx = useContext(FavoritesContext);
  const favoriteCount = favCtx?.favoriteIds?.length || 0;
  const cartCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    function handleScroll() {
      setIsShrunk(window.scrollY > 40);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  function openCategory(cat) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveCategory(cat);
  }

  function scheduleClose(cat) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveCategory((prev) => (prev?.id === cat.id ? null : prev));
    }, 180);
  }

  function submitSearch(e) {
    e.preventDefault();
    const q = searchTerm.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  if (!mounted) return <nav className="navbar" />;

  return (
    <nav className={`navbar ${isShrunk ? "shrink" : ""}`}>
      <Link href="/" className="logo">
        Party Shop
      </Link>

      <div className="nav-categories">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="nav-category-wrapper"
            onMouseEnter={() => openCategory(cat)}
            onMouseLeave={() => scheduleClose(cat)}
          >
            <span className="nav-category-label">{cat.name}</span>

            {activeCategory?.id === cat.id &&
              Array.isArray(cat.children) &&
              cat.children.length > 0 && (
                <div
                  className="dropdown"
                  onMouseEnter={() => openCategory(cat)}
                  onMouseLeave={() => scheduleClose(cat)}
                >
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

      <Link href="/party-builder" className="nav-category-label">
        Party Builder
      </Link>

      <form className="nav-search" onSubmit={submitSearch}>
        <span className="nav-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
        </span>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ce cauti? De exemplu, heliu..."
          aria-label="Cauta produse"
        />
        <button type="submit">Cautare</button>
      </form>

      <div className="nav-right">
        <Link href="/favorites" className="nav-action-link">
          <span className="nav-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </span>
          <span>Favorite</span>
          {favoriteCount > 0 && <span className="cart-badge">{favoriteCount}</span>}
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/orders" className="nav-action-link">
              <span className="nav-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span>Cont</span>
            </Link>
            <button type="button" className="nav-action-link nav-action-button" onClick={logoutUser}>
              <span className="nav-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </span>
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link href="/login" className="nav-action-link">
            <span className="nav-action-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M20 21a8 8 0 1 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span>Autentificare</span>
          </Link>
        )}

        <Link href="/cart" className="nav-action-link nav-cart-button">
          <span className="nav-cart-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M6.5 8.5h11L18.5 21h-13l1-12.5Z" />
              <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
            </svg>
          </span>
          <span>{cartCount > 0 ? `Cos (${cartCount})` : "Cos gol"}</span>
        </Link>

        {isAdmin && (
          <>
            <Link href="/admin/products" className="admin-shortcut">
              Panel Admin
            </Link>
            <button type="button" className="nav-action-link nav-action-button" onClick={logoutAdmin}>
              <span className="nav-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </span>
              <span>Logout Admin</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
