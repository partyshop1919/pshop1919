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
  const testimonials = [
    {
      id: 1,
      name: "Andreea, Bucuresti",
      text: "Comanda a ajuns rapid, iar decorul a iesit exact cum ne-am dorit pentru aniversare.",
      rating: 5
    },
    {
      id: 2,
      name: "Mihai, Cluj-Napoca",
      text: "Party Builder m-a ajutat mult sa aleg produsele potrivite pentru numarul de invitati.",
      rating: 5
    },
    {
      id: 3,
      name: "Ioana, Iasi",
      text: "Produse bune, preturi corecte si comunicare clara pe tot parcursul comenzii.",
      rating: 4
    }
  ];

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
  if (featured.length > 0) return featured.slice(0, 9);

  return items.slice(0, 9);
}, [items]);

  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const featuredSlides = useMemo(() => {
    const pageSize = 3;
    const chunks = [];
    for (let i = 0; i < featuredProducts.length; i += pageSize) {
      chunks.push(featuredProducts.slice(i, i + pageSize));
    }
    return chunks;
  }, [featuredProducts]);

  useEffect(() => {
    if (featuredSlides.length > 0 && featuredSlideIndex >= featuredSlides.length) {
      setFeaturedSlideIndex(0);
    }
  }, [featuredSlideIndex, featuredSlides.length]);

  useEffect(() => {
    if (featuredSlides.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedSlideIndex((prev) => (prev + 1) % featuredSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [featuredSlides.length]);

  const goPrevFeatured = () => {
    if (featuredSlides.length === 0) return;
    setFeaturedSlideIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const goNextFeatured = () => {
    if (featuredSlides.length === 0) return;
    setFeaturedSlideIndex((prev) => (prev + 1) % featuredSlides.length);
  };

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

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
              <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "6px 10px" }}>Plata securizata</span>
              <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "6px 10px" }}>Retur 14 zile</span>
              <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "6px 10px" }}>Livrare 24-48h</span>
            </div>
          </div>
        </section>

        <section className="home-featured">
          <h2>Produse recomandate</h2>

          {!loading && featuredSlides.length > 0 && (
            <div className="featured-slider">
              <div className="slider-controls">
                <button type="button" className="slider-arrow" onClick={goPrevFeatured} aria-label="Anterior">
                  ←
                </button>

                <button type="button" className="slider-arrow" onClick={goNextFeatured} aria-label="Următor">
                  →
                </button>
              </div>

              <div className="slider-viewport">
                <div
                  className="slider-track"
                  style={{ transform: `translateX(-${featuredSlideIndex * 100}%)` }}
                >
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

              <div className="slider-pagination slider-pagination-below">
                {featuredSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`slider-dot ${index === featuredSlideIndex ? "active" : ""}`}
                    onClick={() => setFeaturedSlideIndex(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && featuredSlides.length === 0 && (
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

          <div className="promo-actions">
            <Link href="/category/baloane" className="promo-btn">
              Vezi produsele
            </Link>
            <Link href="/party-builder" className="promo-btn promo-btn-secondary">
              Incearca Party Builder
            </Link>
          </div>
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

        <section className="home-testimonials">
          <h2>Feedback clienti</h2>
          <p className="testimonials-subtitle">
            Testimoniale selectate manual din feedback primit de la clienti.
          </p>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <article key={t.id} className="testimonial-card">
                <div className="testimonial-head">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <h3>{t.name}</h3>
                    <div className="testimonial-stars" aria-label={`Rating ${t.rating} din 5 stele`}>
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
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
