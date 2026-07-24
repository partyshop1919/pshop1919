import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { categories } from "../lib/categories";

import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";

const SSR_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.evamat.ro/api"
    : "http://localhost:4000/api");

export default function HomePage({ initialItems = [] }) {
  const [items] = useState(Array.isArray(initialItems) ? initialItems : []);
  const [loading] = useState(false);
  const testimonials = [
    { id: 1, name: "Andreea, București", text: "Comanda a ajuns repede, iar decorul a arătat exact cum ne-am dorit pentru aniversare.", rating: 5 },
    { id: 2, name: "Mihai, Cluj-Napoca", text: "Constructorul de petrecere m-a ajutat să aleg produsele potrivite pentru numărul de invitați.", rating: 5 },
    { id: 3, name: "Ioana, Iași", text: "Produse foarte bune, prețuri corecte și comunicare clară pe tot parcursul comenzii.", rating: 4 }
  ];

  const featuredProducts = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];
    const featured = items.filter((p) => Boolean(p.featured));
    if (featured.length > 0) return featured.slice(0, 9);
    return items.slice(0, 9);
  }, [items]);

  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const featuredSlides = useMemo(() => {
    const pageSize = 3;
    const chunks = [];
    for (let i = 0; i < featuredProducts.length; i += pageSize) chunks.push(featuredProducts.slice(i, i + pageSize));
    return chunks;
  }, [featuredProducts]);

  useEffect(() => {
    if (featuredSlides.length > 0 && featuredSlideIndex >= featuredSlides.length) setFeaturedSlideIndex(0);
  }, [featuredSlideIndex, featuredSlides.length]);

  useEffect(() => {
    if (featuredSlides.length === 0) return;
    const interval = setInterval(() => setFeaturedSlideIndex((prev) => (prev + 1) % featuredSlides.length), 4200);
    return () => clearInterval(interval);
  }, [featuredSlides.length]);

  return (
    <>
      <Head>
        <title>Evamat - Articole pentru petreceri</title>
        <meta name="description" content="Baloane, decorațiuni și accesorii festive pentru aniversări, petreceri și evenimente speciale." />
      </Head>

      <main className="homepage">
        <section className="hero">
          <div className="hero-content">
            <h1>Totul pentru petreceri memorabile</h1>
            <p>Descoperă baloane, decorațiuni și accesorii festive pentru aniversări, petreceri tematice și evenimente speciale.</p>
            <ul className="hero-benefits">
              <li>Livrare rapidă din stoc</li>
              <li>Produse pentru toate vârstele</li>
              <li>Prețuri accesibile</li>
            </ul>

            <Link href="#categories" className="hero-btn">
              Vezi categoriile
            </Link>
          </div>
        </section>

        <section className="home-featured">
          <h2>Produse recomandate</h2>
          {!loading && featuredSlides.length > 0 && (
            <div className="featured-slider">
              <div className="slider-controls">
                <button type="button" className="slider-arrow" onClick={() => setFeaturedSlideIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length)} aria-label="Anterior">{"<"}</button>
                <button type="button" className="slider-arrow" onClick={() => setFeaturedSlideIndex((prev) => (prev + 1) % featuredSlides.length)} aria-label="Următor">{">"}</button>
              </div>

              <div className="slider-viewport">
                <div className="slider-track" style={{ transform: `translateX(-${featuredSlideIndex * 100}%)` }}>
                  {featuredSlides.map((slide, slideIndex) => (
                    <div className="slider-panel" key={slideIndex}>
                      <div className="products-grid">
                        {slide.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && featuredSlides.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">Nou</div>
              <h3>Urmează și alte produse</h3>
              <p>Adăugăm produse noi în curând. Revino în scurt timp.</p>
            </div>
          )}
        </section>

        <section id="categories" className="home-categories">
          <h2>Categorii populare</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="home-promo">
          <h2>Plănuiești o petrecere?</h2>
          <p>Alege din sute de produse festive și creează rapid un decor memorabil.</p>
          <div className="promo-actions">
            <Link href="/products" className="promo-btn">Vezi produsele</Link>
            <Link href="/party-builder" className="promo-btn promo-btn-secondary">Încearcă constructorul</Link>
          </div>
        </section>

        <section className="home-testimonials">
          <h2>Păreri de la clienți</h2>
          <p className="testimonials-subtitle">Câteva impresii din feedback-ul recent primit de la clienți.</p>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <article key={t.id} className="testimonial-card">
                <div className="testimonial-head">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <h3>{t.name}</h3>
                    <div className="testimonial-stars" aria-label={`Evaluare ${t.rating} din 5 stele`}>
                      {"*".repeat(t.rating)}
                    </div>
                  </div>
                </div>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`${SSR_API_URL}/products`, {
      headers: { Accept: "application/json" }
    });

    if (!res.ok) {
      return { props: { initialItems: [] } };
    }

    const data = await res.json().catch(() => ({}));
    const initialItems = Array.isArray(data?.items) ? data.items : [];

    return {
      props: { initialItems }
    };
  } catch {
    return {
      props: { initialItems: [] }
    };
  }
}
