import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { categories } from "../lib/categories";
import { fetchProducts } from "../lib/api";

import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const list = await fetchProducts();
        if (!active) return;
        setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = useMemo(() => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const featured = items.filter((p) => Boolean(p.featured));
  if (featured.length > 0) return featured.slice(0, 8);

  return items.slice(0, 8);
}, [items]);

  return (
    <>
      <Head>
        <title>Party Shop – Articole pentru petreceri</title>
        <meta
          name="description"
          content="Baloane, decoruri și articole festive pentru petreceri, aniversări și evenimente speciale."
        />
      </Head>

      <main className="homepage">
        <section className="hero">
          <div className="hero-content">
            <h1>Totul pentru petreceri reușite</h1>
            <p>
              Descoperă baloane, decoruri și articole festive potrivite pentru aniversări,
              petreceri tematice și evenimente speciale.
            </p>
            <ul className="hero-benefits">
              <li>Livrare rapidă din stoc</li>
              <li>Produse pentru toate vârstele</li>
              <li>Prețuri accesibile</li>
            </ul>

            <Link href="#categorii" className="hero-btn">
              Vezi categoriile
            </Link>
          </div>
        </section>

        <section className="home-featured">
          <h2>Produse recomandate</h2>

          {!loading && featuredProducts.length > 0 && (
  <div className="products-grid">
    {featuredProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

{!loading && featuredProducts.length === 0 && (
  <div className="empty-state">
    <div className="empty-icon">🎉</div>
    <h3>Produse în curând</h3>
    <p>Adăugăm produse noi foarte curând. Revino în scurt timp.</p>
  </div>
)}
        </section>

        <section id="categorii" className="home-categories">
          <h2>Categorii populare</h2>

          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="home-events">
          <h2>Tipuri de petreceri</h2>

          <div className="events-grid">
            <Link href="/category/baloane" className="event-card">
              <span className="event-image">
                <img src="/images/events/copii.jpg" alt="Petreceri pentru copii" />
              </span>
              <span className="event-title">Petreceri pentru copii</span>
            </Link>

            <Link href="/category/articole-aniversare" className="event-card">
              <span className="event-image">
                <img src="/images/events/adulti.png" alt="Aniversări adulți" />
              </span>
              <span className="event-title">Aniversări adulți</span>
            </Link>

            <Link href="/category/decor-petrecere" className="event-card">
              <span className="event-image">
                <img src="/images/events/tematice.jpg" alt="Petreceri tematice" />
              </span>
              <span className="event-title">Petreceri tematice</span>
            </Link>

            <Link href="/category/decor-petrecere" className="event-card">
              <span className="event-image">
                <img src="/images/events/baby.jpg" alt="Baby shower & gender reveal" />
              </span>
              <span className="event-title">Baby shower & gender reveal</span>
            </Link>
          </div>
        </section>

        <section className="home-promo">
          <h2>Organizezi o petrecere?</h2>
          <p>Alege din sute de produse festive și pregătește rapid un decor memorabil.</p>

          <Link href="/category/baloane" className="promo-btn">
            Vezi produsele
          </Link>
        </section>

        <section className="home-benefits">
          <div className="benefits-grid">
            <div>
              <h3>Produse atent selectate</h3>
              <p>Găsești articole festive potrivite pentru orice tip de eveniment.</p>
            </div>

            <div>
              <h3>Livrare rapidă</h3>
              <p>Comenzile sunt procesate rapid, direct din stoc.</p>
            </div>

            <div>
              <h3>Suport dedicat</h3>
              <p>Suntem aici să te ajutăm să alegi produsele potrivite.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
